import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import widgetStyle from "./widgetStyle";
import { FaSquareXmark } from "react-icons/fa6";

let Dashboard = (props) => {

    const URL = process.env.REACT_APP_SERVER_URL;
    const [currentView, setCurrentView] = useState('posts');
    const [image_secure_url, set_image_secure_url] = useState('');
    const [image_public_id, set_image_public_id] = useState('');
    const [thisBody, setThisBody] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [authorInput, setAuthorInput] = useState('');
    const [currentPostID, setCurrentPostId] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [noPosts, setNoPosts] = useState(true);

    let navigate = useNavigate();

    const [form, setValues] = useState({
        newPassword: "",
        oldPassword: ""
    });

    let handleChange= (e) =>{
    setValues({ ...form, 
        [e.target.name]: e.target.value });
        console.log("oldPassword= " + form.oldPassword);
        console.log("newPassword= " + form.newPassword);
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        console.log("update password")
        await axios.post(URL+"/users/updatePassword",{
            username: props.user, oldPassword: form.oldPassword, newPassword: form.newPassword
        })
        .then((res) => {
            if(res.data.ok === true){
                console.log("ok")
                setValues({newPassword: "", oldPassword: ""})
            }
            alert(res.data.message);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleDeleteAccount = async (e) => {
        e.preventDefault()
        console.log("delete account")
        await axios.post(URL+"/users/deleteAccount",{
            username: props.user, password: form.oldPassword
        })
        .then((res) => {
            if(res.data.ok === true){
                setValues({newPassword: "", oldPassword: ""})
                props.LogoutUser();
                alert(res.data.message);
                navigate('/feed');
            }
            else{
                alert(res.data.message);
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }


    useEffect(()=>{
        console.log("Dashboard.js useEffect")
        props.setDisplayHeaders(true);
    }, [])

    useEffect(()=>{
        setValues({oldPassword: '', newPassword: ''});
        set_image_secure_url('');
        set_image_public_id('');
        setThisBody('');
        setAuthorInput('');
        setTitleInput('');
    }, [currentView])

    const handleSubmit = (method) => {
        console.log("Submit")
        if (method === 'add'){
            axios.post(URL+'/posts/addPost', 
            {
                //req.body
                username: props.user,
                bookTitle: titleInput,
                bookAuthor: authorInput,
                imageSecureUrl: image_secure_url,
                imagePublicId: image_public_id,
                body: thisBody
            })
            .then((res) => {
              alert(`${res.data.message}`)
              props.setList(res.data.list)
              setCurrentView('posts')
            })
            .catch((err)=>{
              console.log(err)
            })
        }
        else if (method === 'update')
        {
            axios.post(URL+'/posts/updatePostById', 
            {
                //req.body
                id: currentPostID,
                username: props.user,
                bookTitle: titleInput,
                bookAuthor: authorInput,
                imageSecureUrl: image_secure_url,
                imagePublicId: image_public_id,
                body: thisBody
            })
            .then((res) => {
              alert(`${res.data.message}`)
              props.setList(res.data.list);
              setCurrentView('posts');
            })
            .catch((err)=>{
              console.log(err)
            })
        }
        
        set_image_secure_url('');
        set_image_public_id('');
        setThisBody('');
        setAuthorInput('');
        setTitleInput('');
        setCurrentPostId('');
    }

    const handleUpdate = (thisId) => {
        console.log("thisId = " + thisId);
        setCurrentPostId(thisId);
        setCurrentView('updatePost');
        const updateOne = async () =>{
            axios.post(URL+'/posts/findPostById',
            { id: thisId
                //organize state variables in views
            })
            .then((res) => {
            set_image_public_id(res.data.post.imagePublicId);
            set_image_secure_url(res.data.post.imageSecureUrl);
            setThisBody(res.data.post.body);
            setAuthorInput(res.data.post.bookAuthor);
            setTitleInput(res.data.post.bookTitle);
            })
            .catch((err)=>{
            console.log(err)
            })
        }
        updateOne();
    }

    const handleDelete = (thisId) => {
        handleUpdate(thisId);
        setDeleteMode(true);
    }

    const renderDeleteWindow = () => {

        const confirmDelete = async (mode) => {
            if(mode === 'confirm')
            {
                console.log(currentPostID);
                axios.post(URL+'/posts/removePost',
                { id: currentPostID
                    //organize state variables in views
                })
                .then((res) => {
                alert(res.data.message)
                props.setList(res.data.list);
                })
                .catch((err)=>{
                console.log(err)
                })
            }
            else if (mode === 'cancel'){
                alert("canceled.")
            }
            
            setCurrentPostId('');
            setCurrentView('posts');
            set_image_public_id('');
            set_image_secure_url('');
            setThisBody('');
            setAuthorInput('');
            setTitleInput('');
            setDeleteMode(false);
            
        }

        return(
            <div className="modalWrapper">
                <div className="modal">
                    <h1>Delete post?</h1>
                    <p>This action cannot be undone</p>
                    <button className="buttonFormat" style={{marginRight: 8}}onClick={() => confirmDelete('confirm')}>confirm</button>
                    <button className="buttonFormat" onClick={() => confirmDelete('cancel')}>cancel</button>
                </div>
            </div>
        )
    }

    const NoPostsView = () => {
        return(
            <div className="noPosts">
                No posts yet 😴
            </div>
        )
    }

    const uploadWidget = () => {
        window.cloudinary.openUploadWidget(
            {
              cloud_name: process.env.REACT_APP_CLOUD_NAME,
              upload_preset: process.env.REACT_APP_UPLOAD_PRESET,
              max_files: '1',
              tags: ["user"],
              stylesheet: widgetStyle,
            },
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                result.event === "queues-end" && parseSecureURL(result);
              }
            }
          );
    }

    const parseSecureURL = async (result) => {
        const secure_url = result.info.files[0].uploadInfo.secure_url;
        const public_id = result.info.files[0].uploadInfo.public_id;
        set_image_secure_url(secure_url);
        set_image_public_id(public_id);
    };

    const deleteImage = async (_id) => {
        try {
            const response = await axios.delete(URL + `/pictures/remove/${_id}`);
            if(response.data.ok){
                console.log(response.data.message);
                set_image_public_id('');
                set_image_secure_url('');
            }
            else{
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderView = () => {
        console.log("view rendered")
        if(currentView === 'create'){
            return(
            <>
            <div className="myPostsTitle">
                <p>Create</p>
            </div>
            <div className="create">
                <div className="createContainer">
                    <div style={{ 
                        display: 'flex',
                        width: "100%", 
                        justifyContent:"center"}}>
                        <p>Add a post</p>
                    </div>


                    <div className="createInputField" >
                        <p>Book Title</p>
                        <input 
                        style={{height: 22}}
                        value={titleInput}
                        onChange={e=> setTitleInput(e.target.value)}
                        ></input>
                    </div>

                    <div className="createInputField" >
                        <p>Book Author</p>
                        <input
                        style={{height: 22}} 
                        value={authorInput}
                        onChange={e=> setAuthorInput(e.target.value)}
                        ></input>
                    </div>

                    
                    <div className="createInputField">
                        <p>Image </p>
                        {(image_secure_url !== '') ? 
                        <div className="uploadImageDisplay">
                            <img className="editImage" src={image_secure_url} />
                            <div onClick={() => deleteImage(image_public_id)}><div className="iconStyle"><FaSquareXmark size={34} color={'#FF4949'}/></div></div>
                        </div>
                        : <button 
                            className="buttonFormat"
                            onClick={uploadWidget}
                            style={{paddingLeft: 8, paddingRight: 9}}>
                            Upload
                        </button>}
                    </div>
                    
                    <div className="userAddBodyTitle">
                        <p>Body</p>
                        <textarea 
                        className="userAddBody"
                        value={thisBody}
                        onChange={e=> setThisBody(e.target.value)}
                        ></textarea>
                    </div>
                    <div style={{ 
                        display: 'flex',
                        width: "100%", 
                        justifyContent:"right"}}>
                        <button
                            className="buttonFormat"
                            style={{margin: 10,
                            marginRight: 0}} 
                            onClick={() => handleSubmit('add')}
                            >Submit
                        </button>
                    </div>
                </div>
            </div>
            </>
            )
        }
        else if(currentView === 'posts'){
            return(
                <>
                <div className="myPostsTitle">
                <p>My posts</p>
                </div>
                {renderPosts()}
                {noPosts && <NoPostsView />}
                </>
            )
        }
        else if(currentView === 'updatePassword'){
            return(
            <>
            <div className="myPostsTitle">
                <p>Account Settings</p>
            </div>
            <form className="accountDashboard"
            onSubmit={handleUpdatePassword}
            onChange={handleChange}>
                <div className="accountContainer">
                    <h2>Update Password</h2>
                    <p>Old password</p>
                    <input name="oldPassword" value={form.oldPassword}/>
                    <p>New password</p>
                    <input name="newPassword" value={form.newPassword}/>
                    <button>Submit</button>
                </div>
            </form>
            </>
            )
        }
        else if(currentView === 'deleteAccount'){
            return(
            <>
            <div className="myPostsTitle">
                <p>Account Settings</p>
            </div>
            <form className="accountDashboard"
            onSubmit={handleDeleteAccount}
            onChange={handleChange}>
                <div className="accountContainer">
                    <h2>Are you sure?</h2>
                    <p>Password</p>
                    <input name="oldPassword" value={form.oldPassword}/>
                    <button>Submit</button>
                </div>
            </form>
            </>
            )
        }
        else if(currentView === 'updatePost'){
            return(
            <>
            <div className="myPostsTitle">
                <p>Update post</p>
            </div>
            <div className="create">
                {deleteMode && renderDeleteWindow()}
                <div className="createContainer">

                    <div style={{ 
                        display: 'flex',
                        width: "100%", 
                        justifyContent:"center"}}>
                        <p>Update post</p>
                    </div>


                    <div className="createInputField" >
                        <p>Book Title</p>
                        <input 
                        style={{height: 22}}
                        value={titleInput}
                        onChange={e=> setTitleInput(e.target.value)}
                        ></input>
                    </div>

                    <div className="createInputField" >
                        <p>Book Author</p>
                        <input
                        style={{height: 22}} 
                        value={authorInput}
                        onChange={e=> setAuthorInput(e.target.value)}
                        ></input>
                    </div>

                    
                    <div className="createInputField">
                        <p>Image </p>
                        {(image_secure_url !== '') ? 
                        <div className="uploadImageDisplay">
                            <img className="editImage" src={image_secure_url} />
                            <div onClick={() => deleteImage(image_public_id)}><div className="iconStyle"><FaSquareXmark size={34} color={'#FF4949'}/></div></div>
                        </div>
                        : <button 
                            className="buttonFormat"
                            onClick={uploadWidget}
                            style={{paddingLeft: 8, paddingRight: 9}}>
                            Upload
                        </button>}
                    </div>
                    
                    <div className="userAddBodyTitle">
                        <p>Body</p>
                        <textarea 
                        className="userAddBody"
                        value={thisBody}
                        onChange={e=> setThisBody(e.target.value)}
                        ></textarea>
                    </div>
                    <div style={{ 
                        display: 'flex',
                        width: "100%", 
                        justifyContent:"right"}}>
                        <button
                            className="buttonFormat"
                            style={{margin: 10, marginRight: 0}} 
                            onClick={() => handleSubmit('update')}
                            >Submit
                        </button>
                    </div>
                </div>
            </div>
            </>
            )
        }
    }

    const renderPosts = () => (
        props.list.map((data, idx) => {
            if(data.username === props.user){
                if(noPosts === true){
                    setNoPosts(false)
                }
                return(
                    <>
                    <div className="postEditWrapper">
                        
                    
                        <div className="postEdit" key={idx}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <p style={{margin: 0, paddingTop: 9, fontWeight: 'bold'}}>{data.username}</p>
                                <div style={{paddingTop: 9, display: 'flex', gap: 5}}>
                                    <button className="buttonFormat" onClick={() => handleUpdate(data.id)}>update</button>
                                    <button className="buttonFormat" onClick={() => handleDelete(data.id)}>delete</button>
                                </div>
                            </div>
                            <p style={{margin: 0, fontSize: 14, fontStyle: "italic", paddingBottom: 10}}>{data.date}</p>
                            {(data.imageSecureUrl !== "")? 
                            <p style={{marginTop: 0}}>
                                <img className="postImage" src={data.imageSecureUrl} />
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
            }
            
        })
    )


    return(
    <>
    <div className="userNavbar">
        <p className="userNavbarTitle">Dashboard</p>
        <div className="dashButton">Account Settings
            <div className="dashButtonOptions">
                <button onClick={() => setCurrentView("updatePassword")}>Update password</button>
                <button onClick={() => setCurrentView("deleteAccount")} 
                style={{marginLeft: 130}}>Delete account</button>
            </div>
        </div>
        <div className="userButton">Views
            <div className="userButtonOptions">
                <button onClick={() => setCurrentView("create")}>Create</button>
                <button onClick={() => setCurrentView("posts")}
                style={{marginLeft: 65}}>My Posts</button>
            </div>
        </div>
    </div>

    <div className="feedWrapperEdit">
    {renderView()}
    </div>
    </>
    );
    }
    
    export default Dashboard
    