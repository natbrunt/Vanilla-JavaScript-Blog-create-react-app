import './App.css';
import {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
  } from "react-router-dom";
import axios from 'axios';
import Home from "./components/Home";
import Feed from './components/Feed';
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login';
import * as jose from "jose";
import AdminLogin from './components/AdminLogin'
import Register from './components/Register'
import ForgottenPassword from './components/ForgottenPassword';
import Enter from './components/Enter';
import Reactivate from './components/Reactivate';

function App(){

    const URL = process.env.REACT_APP_SERVER_URL;

    const [list, setList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [displayHeaders, setDisplayHeaders] = useState(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const [user, setUser] = useState('');

    const [showFooter, setShowFooter] = useState(true);

    const [form, setValues] = useState({
      username: '',
      password: '',
      email: ''
    })

    useEffect(()=>{
        console.log("App.js useEffect");
        const fetchList = async () =>{
            axios.post(URL+'/posts/findAll')
            .then((res) => {
            setList(res.data)
            console.log("Feed list declared")
            })
            .catch((err)=>{
            console.log(err)
            })
        }
        fetchList();
    }, [])

    const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

    useEffect(() => {
        const verify_token = async () => {
          try {
            if(!token){
              setIsLoggedIn(false)
              console.log("no token")
              console.log(token)
            } else {
              console.log("token found")
              axios.defaults.headers.common["Authorization"] = token;
              const response = await axios.post(URL+'/users/verifyToken');
              //console.log(response);
              return response.data.ok ? LoginUser(token) : LogoutUser();
            }
          }catch(error){
            console.log(error)
          }
        }
        verify_token();
        console.log("App.js verifyToken useEffect " + user)
      }, [token]);

    const LoginUser = (token) => {
        
        let decodedToken = jose.decodeJwt(token);
        setUser(decodedToken.username);
        setIsLoggedIn(true);
        localStorage.setItem("token", JSON.stringify(token));
        alert('Welcome back!')

    }

    let LogoutUser = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        alert("You have logged out");
      }

    const sendEmail = async (paramEmail, magicLink) => {

      axios.post(URL+'/users/sendEmail', {thisEmail: paramEmail, magicLink})
      .then((res) => {
        if(res.data.ok)
        {
          LoginUser(res.data.token)
        }
        alert(res.data.message)
      })
      .catch((err)=>{
      console.log(err)
      })
      
    }

    return(
    <Router>
        <Navbar 
          displayHeaders={displayHeaders} 
          user={user}
          LogoutUser={LogoutUser}
          />
        <Routes>
            <Route 
                path="/" 
                element={
                    <Home 
                    setDisplayHeaders={setDisplayHeaders}
                    isLoggedIn={isLoggedIn}
                    />}
            />
            <Route 
                path="/adminDashboard" 
                element={isAdmin? 
                    <AdminDashboard 
                    setDisplayHeaders={setDisplayHeaders}
                    user={user}
                    list={list}
                    setList={setList}
                    /> : 
                    <Navigate to="/adminLogin" />} 
            />
            {/* <Route path="/adminLogin" element={<AdminLogin LoginUser={LoginUser} />}/>
            <Route path="/login" element={<Login />} /> */}
            <Route 
                path="/dashboard" 
                element={isLoggedIn? 
                    <Dashboard 
                    setDisplayHeaders={setDisplayHeaders}
                    user={user}
                    list={list}
                    setList={setList}
                    LogoutUser={LogoutUser}
                    /> : 
                    <Navigate to= "/login" />
                    } 
            />
            <Route
                path="/login"
                element={ isLoggedIn?
                    <Navigate to= "/dashboard" /> :
                    <Login 
                    setDisplayHeaders={setDisplayHeaders}
                    LoginUser={LoginUser}
                    form={form}
                    setValues={setValues}
                    />}
            />
            <Route 
                path="/feed" 
                element={
                    <Feed 
                    setDisplayHeaders={setDisplayHeaders}
                    list={list}
                    setList={setList}
                    />} />
            <Route
              path="/adminLogin"
              element={
                <AdminLogin
                setDisplayHeaders={setDisplayHeaders}
                LoginUser={LoginUser}
                setIsAdmin={setIsAdmin}
                />
              }/>
              <Route
              path="/Register"
              element={
                <Register
                setDisplayHeaders={setDisplayHeaders}
                LoginUser={LoginUser}
                form={form}
                setValues={setValues}
                />
              }/>
            <Route 
                path="/ForgottenPassword" 
                element={
                    <ForgottenPassword 
                    setDisplayHeaders={setDisplayHeaders}
                    sendEmail={sendEmail}
                    />} />
            <Route
                path="sendEmail/:email/:link"
                element={<Enter sendEmail={sendEmail} />}
            />
            <Route
                path="/reactivate"
                element={
                  <Reactivate 
                    setDisplayHeaders={setDisplayHeaders}
                    form={form}
                    setValues={setValues}
                    LoginUser={LoginUser}
                  />}
            />
        </Routes>
        <Footer displayHeaders={displayHeaders} showFooter={showFooter} setShowFooter={setShowFooter}/>
    </Router>

    )
}

export default App;