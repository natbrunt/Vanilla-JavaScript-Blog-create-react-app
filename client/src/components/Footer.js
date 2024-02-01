import React from 'react';
import {useEffect} from "react";

function Footer(props) {

    useEffect(()=> {
        console.log("display useEffect")
    },[props.displayHeaders])

    const handleHide = () => {
        props.setShowFooter(false);
    }

    const handleShow = () => {
        props.setShowFooter(true);
    }

    if(props.displayHeaders === true){
        return (
            <>
            {props.showFooter? 
            <div className="footer">
                <p>
                    All rights reserved ©
                </p>
                <div className="footerButtonWrapper">
                    <button onClick={handleHide} className="footerButton">Hide</button>
                </div>
            </div> : 
            <div className="hiddenFooter">
                <div className="footerButtonWrapper">
                    <button onClick={handleShow} className="footerButton">^</button>
                </div>
            </div>}
            </>
        );
    }
    return null
}

export default Footer;