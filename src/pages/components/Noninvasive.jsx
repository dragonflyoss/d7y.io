import React from "react";
import Lottie from "lottie-react";
import NoninvasiveAnimation from '../../../static/lottie/data-security.json';

const Style = {
    height: 140,
    width:140
  };

const Noninvasive = ()=>{
    return(
        <Lottie animationData={NoninvasiveAnimation} style={Style}> </Lottie>
    )
}

export default Noninvasive;
