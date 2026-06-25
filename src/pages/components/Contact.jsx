import React from 'react';
import Lottie from 'lottie-react';
import ContactAnimation from '../../../static/lottie/contact.json';

const Style = {
  height: 58,
  width: '100%',
};

const Contact = ({ ariaLabel }) => {
  return <Lottie animationData={ContactAnimation} style={Style} aria-label={ariaLabel} />;
};
export default Contact;
