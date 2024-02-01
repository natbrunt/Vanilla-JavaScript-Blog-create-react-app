import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useState } from 'react'

let AdminLogin = (props) => {

    const URL = process.env.REACT_APP_SERVER_URL;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        console.log("adminSubmit")
        
        axios.post(URL+'/admin/adminLogin', {username: username, password: password,})
        .then((response) => {
        if(response.data.ok){
            console.log(response.data.message)
            setTimeout(() => {
                props.LoginUser(response.data.token)
                props.setIsAdmin(true);
                navigate('/AdminDashboard')
            }, 10);
        }else{
        console.log(response.data.message)}
        })
        .catch((e) => {console.log(e)})
    }

    return(
    <>
    <div className="adminLoginWrapper">
        <div className="adminLoginRow">
            <form className="adminLoginContainer"
                onSubmit={handleSubmit}
            >
                <p style={{marginBottom: 0, paddingRight: 3}}>Admin</p>
                <p style={{fontSize: 13}}>Username</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)}/>
                <p style={{fontSize: 13}}>Password</p>
                <input value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="buttonFormat">Login</button>
            </form>
        </div>
    </div>
    </>
    );
    }
    
    export default AdminLogin
    