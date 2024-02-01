import { MdOutlineRocketLaunch } from "react-icons/md";
import { MdOutlineIosShare } from "react-icons/md";
import { LuPenTool } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'

let Home = (props) => {

    let navigate = useNavigate();

    useEffect(() => {
        console.log("Home.js useEffect")
        props.setDisplayHeaders(false);

    }, [])

    useEffect(() => {
        if(props.isLoggedIn) navigate('/feed')
    }, [props.isLoggedIn])


    return(
    <>
    <div className="homeWrapper">
   
        <p className="homeTitle">Book Worm Forum</p>
    
        <p className="homeDescription">Share <MdOutlineIosShare size={20}/> Inspire <MdOutlineRocketLaunch size={20}/> Create <LuPenTool size={20} /></p>
    
        <NavLink to={"/feed"}>
            <button className="homeButton">Explore</button>
        </NavLink>
   
    </div>
    </>
    );
    }
    
export default Home