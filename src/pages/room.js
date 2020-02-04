import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import Layout from '../components/layout';
import VideoDisplay from '../components/video-display';
import { navigate } from 'gatsby';

const BounceToHome = () => {
  useEffect(() => {
    navigate('/', { replace: true });
  }, []);

  return null;
};

const Room = () => (
  <>
    <Layout>
      <Router>
        <VideoDisplay path="room/:roomID" />
        <BounceToHome default />
      </Router>
    </Layout>
  </>
);

export default Room;
