import axios from 'axios';
import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

let AdminDashboard = (props) => {

    const URL = process.env.REACT_APP_SERVER_URL;
    const [listUsers, setListUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);

    useEffect(() => {
        console.log("AdminDashboard.js useEffect")
        props.setDisplayHeaders(true);
        axios.post(URL+'/users/findAll')
                .then((res) => {
                setListUsers(res.data);
                console.log(res.data);
                })
                .catch((err)=>{
                console.log(err)
                })
        axios.post(URL+'/users/findAllDeletedUsers')
                .then((res) => {
                setDeletedUsers(res.data);
                console.log(res.data);
                })
                .catch((err)=>{
                console.log(err)
                })
    }, [])

    const handleRemovePost = (thisId) => {
        axios.post(URL+'/posts/removePost', {id: thisId})
                .then((res) => {
                alert(res.data.message);
                props.setList(res.data.list);
                })
                .catch((err)=>{
                console.log(err)
                })
    }

    const renderPosts = () => (
        props.list.map((data, idx) => {
                return(
                    <>
                    <div className="adminPostEditWrapper">
                        
                    
                        <div className="postEdit" key={idx}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <p style={{margin: 0, paddingTop: 9, fontWeight: 'bold'}}>{data.username}</p>
                                <div style={{paddingTop: 9, display: 'flex', gap: 5}}>
                                    <button onClick={() => handleRemovePost(data.id)}>delete</button>
                                </div>
                            </div>
                            <p style={{margin: 0, fontSize: 14, fontStyle: "italic", paddingBottom: 10}}>{data.date}</p>
                            {data.image[0]? <p style={{marginTop: 0}}>
                                <img className="postImage" src={data.image[0]} />
                                <p className="postInfo">{data.bookTitle}, {data.bookAuthor}</p>
                                {data.body}
                            </p> : 
                            <div>
                                <p className="postInfo">{data.bookTitle}, {data.bookAuthor}</p>
                                <p style = {{marginTop: "0px"}}>{data.body}</p>
                            </div>
                            }
                        </div>
                    </div>
                    </>
                )
        })
    )

    const handleDelete = (user) => {
        console.log("user=" + user);
        axios.post(URL+'/users/removeUser', {username: user})
        .then((res) => {
        alert(res.data.message);
        setListUsers(res.data.list);
        setDeletedUsers(res.data.deletedList);
        })
        .catch((err)=>{
        console.log(err)
        })
    }

    const renderAllUsers = () => (
        listUsers.map((data, idx) => {
            return(
                <div className="adminUserContainer"
                    key={idx}>
                    <p>{data.username}</p>
                    <button onClick={() => {handleDelete(data.username)}}>delete</button>
                </div>
            )
        })
    )

    const renderAllDeletedUsers = () => (
        deletedUsers.map((data, idx) => {
            return(
                <div className="adminUserContainer"
                    key={idx}>
                    <p>{data.username}</p>
                </div>
            )
        })
    )

    return(
    <>

    <div className="adminWrapper">
        <div className="adminContainer">
            <h1 style={{textAlign: 'center'}}>Admin Dashboard</h1>
            <div className="adminGrid">
                <div className="adminLeft">
                    <h2>All users</h2>
                    <div className="adminUserWrapper">
                        {renderAllUsers()}
                    </div>
                    <h3>All deleted users</h3>
                    <div className="adminUserWrapper">
                        {renderAllDeletedUsers()}
                    </div>
                </div>
                <div className="adminRight">
                    <h2>All posts</h2>
                        {renderPosts()}
                </div>
            </div>
        </div>
    </div>

    </>
    );
    }
    
    export default AdminDashboard
    