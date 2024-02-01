import {useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

let Reactivate = ({form, setValues, setDisplayHeaders, LoginUser}) => {
    
    let navigate = useNavigate();
    const URL = process.env.REACT_APP_SERVER_URL;
    
    useEffect(()=>{
        console.log("Reactivate.js useEffect")
        setDisplayHeaders(true);
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit");
        try{
            const response = await axios.post(URL+'/users/reactivateUser',{
                username: form.username,
                email: form.email,
                password: form.password
            });
            if(response.data.ok === true){
                alert(response.data.message);
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
                    LoginUser(res.data.token)
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
            }
            else{
                alert(response.data.message);
            }
        }catch(error){
        console.log(error)
        };
    }

    let handleChange= (e) =>{
		setValues({ ...form, 
			[e.target.name]: e.target.value });
		console.log(form.username);
		console.log(form.password);
        console.log(form.email);
	}
    
    return (
    <>
    <div className="reactivateFormWrapper">
        <form
            onChange={handleChange}
            onSubmit={handleSubmit}
            className="reactivateFormContainer"
        >    
            <h1>Reactivate</h1>
            <p>Username and email must match the deleted account. This form will reactivate your account. :) </p>
            <div className="reactivateForm">
                <input placeholder='Username' name="username" value={form.username}></input> 
                <input placeholder='Password' name="password" value={form.password}></input> 
                <input placeholder='Email' name="email" value={form.email}></input> 
            </div>
            <div>
            <button className="buttonFormat" style={{marginTop: 10}}>Submit</button>
            </div>
        </form>
    </div>
    </>
    )
};

export default Reactivate