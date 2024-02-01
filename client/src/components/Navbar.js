import React from "react";
import { NavLink } from "react-router-dom";
import { useEffect } from 'react'
import { MdDashboard } from "react-icons/md";

const Navbar = (props) => {

  useEffect(()=> {
    console.log("Navbar useEffect")
  },[])

  if(props.displayHeaders ===true){
    return (
      <>
      <div className="header">
        
      <p className="webTitle">
          <NavLink to={"/feed"} className="webTitleNavLink">Book Worm Forum</NavLink>
      </p>
      
      <div className="dashboardRightView">
      {props.user && <div className="userBar">
        <p>{props.user}</p>
        <button
          className="buttonFormatSmall" 
          onClick={() => props.LogoutUser()}>Logout</button>
      </div>}
      
        <div className="dashboard">
          <NavLink to={"/dashboard"} style={{display: "flex", alignItems: "center", textDecoration: "none"}}>
            <p className="buttonText">Dashboard</p>
            <MdDashboard size={20} color={"white"}/>
          </NavLink>
        </div>
      </div>

      </div>
      
      </>
    )
  }
  return null
}

export default Navbar

const linkStyles = {
  activeLink: {
    color: "gray",
  },
  defaultLink: {
    textDecoration: "none",
    color: "black",
  },
};
//