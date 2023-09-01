import React from "react";
import Lottie from "lottie-react";
import HostlevelAnimation from '../../../static/lottie/cloud-hosting.json';

const style = {
    height: 140,
    width:140
  };

const PeerLevelControl = ()=>{
    return(
        <Lottie animationData={HostlevelAnimation} style={style}> </Lottie>
    )
}

export default PeerLevelControl;
