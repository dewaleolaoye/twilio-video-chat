import React, { useEffect, forwardRef } from 'react';
import useTwilioVideo from '../hooks/use-twilio';
import { navigate } from 'gatsby';

// const display = forwardRef((props, ref) => {});

const VideoDisplay = ({ roomID }) => {
  // let videoRef = useRef();
  const { state, startVideo, videoRef } = useTwilioVideo();
  console.log('video Display', videoRef);

  useEffect(() => {
    // videoRef.current = document.querySelector('.chat');
    if (!state.token) {
      navigate('/', { state: { roomName: roomID } });
    }

    if (!state.room) {
      startVideo();
    }
  }, [state, roomID, startVideo, videoRef.current]);
  return (
    <>
      <h1>Room: {roomID}</h1>
      <div className="chat" ref={videoRef}></div>
    </>
  );
};

export default VideoDisplay;
