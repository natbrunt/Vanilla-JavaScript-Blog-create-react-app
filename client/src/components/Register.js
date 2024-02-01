import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = (props) => {

    const URL = process.env.REACT_APP_SERVER_URL;
    let navigate = useNavigate();

    const [form, setValues] = useState({
        username: "",
        password: "",
        email: ""
      });
    
    useEffect(()=>{
        console.log("Register.js useEffect")
        props.setDisplayHeaders(true);
    }, [])

    let handleChange= (e) =>{
		setValues({ ...form, 
			[e.target.name]: e.target.value });
		console.log(form.username);
		console.log(form.password);
        console.log(form.email);
	}

    let handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Register Submit")
		try{
		const response = await 
		axios.post(URL+'/users/addUser', 
		{username: form.username,
        password: form.password,
        email: form.email});
		if(response.data.ok){
			//alert(response.data.message)
            axios.post(URL+'/users/login', 
            {username: form.username, password: form.password})
            .then((res) => {
            setValues({
                username: "",
                password: "",
                email: ""
                })
            if(res.data.ok)
            {
                props.LoginUser(res.data.token)
                navigate('/feed')
            }
            else
            {
                alert(res.data.message)
            }
            })
            .catch((err)=>{
            console.log(err)
            })
		}else{
            if(response.data.reactivate === true){
                props.setValues({
                    username: form.username,
                    password: '',
                    email: ''
                })
                setValues({
                    username: "",
                    password: "",
                    email: ""
                    })
                navigate('/reactivate')
            }
            else alert(response.data.message)}
		}
		catch(error){console.log(error)}
	}

    return (
        // reused CSS from adminLogin
        <div className="adminLoginWrapper">
            <div className="adminLoginRow">
                <form 
                    className="adminLoginContainer"
                    onSubmit={handleSubmit}
                    onChange={handleChange}>
                    <h1>Register</h1>
                    <p>Email</p>
                    <input name="email" className="RegisterInput"></input>
                    <p>Username</p>
                    <input name="username" className="RegisterInput"></input>
                    <p>Password</p>
                    <input name="password" className="RegisterInput"></input>
                    <button className="buttonFormat">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Register;