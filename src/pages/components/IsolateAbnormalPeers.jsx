import React from "react";
import Lottie from "lottie-react";
import IsolateAnimation from '../../../static/lottie/legal-alert-message.json';

const Style = {
    height: 140,
    width:140
  };

const IsolateAbnormalPeers = ()=>{
    return(
        <Lottie animationData={IsolateAnimation} style={Style}> </Lottie>
    )
}

export default IsolateAbnormalPeers;
