import React, { useEffect } from 'react';
import useTwilioVideo from '../hooks/use-twilio';
import { navigate } from 'gatsby';

const VideoDisplay = ({ roomID }) => {
  const { state, startVideo, videoRef } = useTwilioVideo();

  useEffect(() => {
    if (!state.token) {
      navigate('/', { state: { roomName: roomID } });
    }

    if (!state.romm) {
      return startVideo();
    }
  }, [state, roomID, startVideo]);
  return (
    <>
      <h1>Room: {roomID}</h1>
      <div className="chat" ref={videoRef}></div>
    </>
  );
};

export default VideoDisplay;
