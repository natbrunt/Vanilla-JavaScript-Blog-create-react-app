import React, {useEffect , useState} from 'react';

function ForgottenPassword(props) {

    const [form, setValues] = useState({
        email: ""
      });

    useEffect(()=>{
        console.log("Feed.js useEffect")
        props.setDisplayHeaders(true);
    }, [])

    let handleChange= (e) =>{
		setValues({ ...form, 
			[e.target.name]: e.target.value });
        console.log(form.email);
	}

    let handleSubmit = (e) => {
        e.preventDefault()
        console.log(form.email)
        props.sendEmail(form.email);
    }


    return (
        // reused CSS from adminLogin
        <div className="adminLoginWrapper">
        <div className="adminLoginRow">
            <form 
                className="adminLoginContainer"
                onSubmit={handleSubmit}
                onChange={handleChange}>
                <h2>Forgotten Password</h2>
                <p>Email</p>
                <input name="email" className="RegisterInput"></input>
                <button className="buttonFormat" style={{marginBottom: 15}}>Send Link</button>
            </form>
        </div>
        </div>
    );
}

export default ForgottenPassword;