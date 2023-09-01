import React from "react";
import Lottie from "lottie-react";
import EcosystemAnimation from '../../../static/lottie/website-optimization.json';

const Style = {
    height: 140,
    width:140
  };

const Ecosystem = ()=>{
    return(
        <Lottie animationData={EcosystemAnimation} style={Style}> </Lottie>
    )
}

export default Ecosystem;
