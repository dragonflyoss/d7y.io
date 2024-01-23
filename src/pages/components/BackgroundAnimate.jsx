import React from 'react';
import styles from '../index.module.css';

const Style = {
  height: '15vh',
  width: '100%',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 4,
};

const BackgroundAnimate = () => {
  return (
    <svg
      style={Style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
      </defs>
      <g className={styles.backgroundAnimation}>
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="#e1feed" fillOpacity="0.79"></use>
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="#b1f5ce" fillOpacity="0.79"></use>
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="#99eabb" fillOpacity="0.79"></use>
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="#85d9a8" fillOpacity="1"></use>
      </g>
    </svg>
  );
};

export default BackgroundAnimate;
