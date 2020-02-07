import React, { createContext, useContext, useReducer, useRef } from 'react';
import axios from 'axios';
import { connect } from 'twilio-video';

// const TWILIO_TOKEN_URL =
//   'https://scarlet-hippopotamus-3934.twil.io/create-room-token';

// const TWILIO_TOKEN_URL = 'https://wheat-shark-5480.twil.io/aegle-video';
const TWILIO_TOKEN_URL = 'http://localhost:4000/video';
const DEFAULT_STATE = {
  identity: false,
  roomName: false,
  token: false,
  room: false,
  sessionId: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'join':
      return {
        ...state,
        sessionId: action.sessionId,
        token: action.token,
        identity: action.identity,
        roomName: action.roomName,
      };

    case 'set-active-room':
      return { ...state, room: action.room, sessionId: action.sessionId };

    case 'disconnect':
      state.room && state.room.disconnect();
      return DEFAULT_STATE;

    default:
      return DEFAULT_STATE;
  }
};

const TwilioVideoContext = createContext();

const TwilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useReducer(reducer, DEFAULT_STATE)}>
    {children}
  </TwilioVideoContext.Provider>
);

export const wrapRootElement = ({ element }) => (
  <TwilioVideoProvider>{element}</TwilioVideoProvider>
);

const useTwilioVideo = () => {
  const [state, dispatch] = useContext(TwilioVideoContext);

  let videoRef = useRef();
  let prev_result;

  const getRoomToken = async ({ identity, roomName, sessionId }) => {
    const result = await axios.post(TWILIO_TOKEN_URL, {
      identity,
      room: roomName ? roomName : null,
      sessionId: sessionId ? sessionId : null,
    });

    console.log({ identity, roomName, sessionId }, 'info reg');

    prev_result = result.data;

    console.log(result.data, 'result');
    // console.log(result, 'result');

    dispatch({
      type: 'join',
      token: result.data.token,
      identity,
      sessionId: result.data.sessionId,
      // roomName: roomName,
      roomName: roomName ? roomName : result.data.room,
    });
  };

  const handleRemoteParticipant = (container, participant) => {
    const id = participant.sid;

    const el = document.createElement('div');
    el.id = id;
    el.className = 'remote-participant';
    const name = document.createElement('h4');
    name.innerText = participant.identity;

    el.appendChild(name);

    container.appendChild(el);

    const addTrack = track => {
      const participantDiv = document.getElementById(id);
      const media = track.attach();

      participantDiv.appendChild(media);
    };

    participant.tracks.forEach(publication => {
      if (publication.isSubcribed) {
        addTrack(publication.track);
      }
    });

    participant.on('trackSubscribed', addTrack);

    participant.on('trackUnsubscribed', track => {
      track.detach().forEach(el => el.remove());

      const container = document.getElementById(id);
      if (container) container.remove();
    });
  };

  const connectToRoom = async () => {
    if (!state.token) {
      return;
    }

    console.log('state token', state.token);
    const room = await connect(state.token, {
      name: state.roomName,
      audio: true,
      video: { width: 640 },
      logLevel: 'info',
    }).catch(error => {
      console.error(`Unable to join the room ${error.message}`);
    });

    const localTrack = [...room.localParticipant.videoTracks.values()][0].track;
    if (!videoRef.current.hasChildNodes()) {
      const localEl = localTrack.attach();

      videoRef.current.appendChild(localEl);
    }

    const handleParticipant = participant => {
      handleRemoteParticipant(videoRef.current, participant);
    };

    room.participants.forEach(handleParticipant);
    room.on('participant', handleParticipant);

    dispatch({ type: 'set-active-room', room });
  };

  const startVideo = () => connectToRoom();
  const leaveRoom = () => dispatch({ type: 'disconnect' });

  return { state, getRoomToken, startVideo, videoRef, leaveRoom };
};

export default useTwilioVideo;
