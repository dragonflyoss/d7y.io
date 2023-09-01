import React from "react";
import Lottie from "lottie-react";
import ConsistencyAnimation from '../../../static/lottie/education.json';

const Style = {
    height: 140,
    width:140
  };

const Consistency = ()=>{
    return(
        <Lottie animationData={ConsistencyAnimation} style={Style}> </Lottie>
    )
}

export default Consistency;
