import React from "react";
import Lottie from "lottie-react";
import BackgroundAnimation from '../../../static/lottie/card-background.json';

const Style = {
    height: 220,
    width:150,
    position: 'absolute', 
    left: '25%', 
    zIndex: -1,
  };

const CardBackground = ()=>{
    return(
        <Lottie animationData={BackgroundAnimation} style={Style}> </Lottie>
    )
}

export default CardBackground;
