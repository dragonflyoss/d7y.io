import React from "react";
import Lottie from "lottie-react";
import ContactAnimation from '../../../static/lottie/contact.json';

const Style = {
    height: 58,
    width:'100%'
  };

const Contact = ()=>{
    return(
        <Lottie animationData={ContactAnimation} style={Style}> </Lottie>
    )
}
export default Contact;
