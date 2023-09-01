import React from "react";
import Lottie from "lottie-react";
import DistributionAnimation from '../../../static/lottie/transfer-files.json';

const Style = {
    height: 140,
    width:140
  };

const P2PFileDistribution = ()=>{
    return(
        <Lottie animationData={DistributionAnimation} style={Style}> </Lottie>
    )
}

export default P2PFileDistribution;
