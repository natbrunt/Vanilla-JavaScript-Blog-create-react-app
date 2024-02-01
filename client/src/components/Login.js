import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios'

let Login = (props) => {

    useEffect(()=>{
        console.log("Login.js useEffect")
        props.setDisplayHeaders(true);
    }, [])

    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const URL = process.env.REACT_APP_SERVER_URL;

    let navigate = useNavigate();

    const handleSubmit = (e) => {
        console.log("LoginSubmit");
        e.preventDefault();
        axios.post(URL+'/users/login', 
        {username: usernameInput, password: passwordInput})
            .then((res) => {
            if(res.data.ok)
            {
                props.LoginUser(res.data.token)
                navigate('/feed')
            }
            else
            {
                if(res.data.reactivate === true){
                    props.setValues({
                        username: usernameInput,
                        password: '',
                        email: ''
                    })
                    navigate('/reactivate');
                }else alert(res.data.message)
            }
            })
            .catch((err)=>{
            console.log(err)
            })
        //we need to fetch the response here this is how we choose to navigate or not
    }

    return(
    <> 
    {/* reused CSS from adminLogin */}
    <div className="adminLoginWrapper">
        <div className="adminLoginRow">
            <form className="adminLoginContainer"
            onSubmit={handleSubmit}>
                <p style={{marginBottom: 0, paddingRight: 3}}>Login</p>
                <p style={{fontSize: 13}}>Username</p>
                <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}/>
                <p style={{fontSize: 13}}>Password</p>
                <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}/>
                <button className="buttonFormat">Login</button>
                <NavLink style={{color: 'orange'}}to={"/Register"}>Register</NavLink>
                <NavLink style={{color: 'orange', paddingBottom: 15}}to={"/ForgottenPassword"}>Forgotten Password</NavLink>
            </form>
        </div>
    </div>



    </>
    );
    }
    
    export default Login
    