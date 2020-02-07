import React, { useEffect } from 'react';
import useTwilioVideo from '../hooks/use-twilio';
import { navigate } from 'gatsby';

const VideoDisplay = ({ roomID, sessionID }) => {
  // let videoRef = useRef();
  const { state, startVideo, videoRef, leaveRoom } = useTwilioVideo();
  console.log('video Display', videoRef);

  useEffect(() => {
    // videoRef.current = document.querySelector('.chat');
    if (!state.token) {
      navigate('/', { state: { roomName: roomID, sessionId: sessionID } });
    }

    if (!state.room) {
      startVideo();
    }
    window.addEventListener('beforeunload', leaveRoom);

    return () => {
      window.addEventListener('beforeunload', leaveRoom);
    };
  }, [state, roomID, startVideo, leaveRoom]);
  return (
    <>
      <h1>Room: {roomID}</h1>
      {state.room && (
        <button className="leave-room" onClick={leaveRoom}>
          Leave Room
        </button>
      )}
      <div className="chat" ref={videoRef}></div>
    </>
  );
};

export default VideoDisplay;
