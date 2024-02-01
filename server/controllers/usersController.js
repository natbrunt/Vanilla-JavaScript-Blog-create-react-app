const validator = require("validator");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const deletedUsers = require('../models/deletedUser.js');
const users = require('../models/User.js');
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');


class Example {

	async findAllReturn(req, res){
		try{
			const test = await users.find({});
			res.send(test)
		}catch(e){
			console.log(e);
		}
	}
	
	async findAllDeletedUsers(req, res){
		try{
			const all = await deletedUsers.find({});
			res.send(all)
		}catch(e){
			console.log(e);
		}
	}

	async removeUser(req, res){
		let {username: name} = req.body;
		try {
			const user = await users.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			if (user) {
				const user_added = await deletedUsers.create({
					username: name,
					password: user.password,
					email: user.email
			})
			 await users.findOneAndDelete({username: name});
				const newUsers = await users.find({});
				const deleted = await deletedUsers.find({});
				return res.send({ok: true, message: `${user.username} removed.`, list: newUsers, deletedList: deleted})
			}
			res.send({ok: false, message:"User not found"})
		} catch (error) {
			console.log(error)
		}
	}

	async deleteAccount(req, res){
		let {username: name, password: pass} = req.body;
		try {
			const user = await users.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			const match = await argon2.verify(user.password, pass);
			if(match){
			const user_added = await deletedUsers.create({
					username: name,
					password: user.password,
					email: user.email
			})
			await users.findOneAndDelete({username: name});
				res.send({ok: true, message: "Account successfully deleted"})
			}
			res.send({ok: false, message: "password is not valid"})
		} catch (error) {
			console.log(error);
		}
	}

	async updatePassword(req, res){
		let {username: name, oldPassword: oldPass, newPassword: newPass} = req.body;
		try {
			const user = await users.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			const match = await argon2.verify(user.password, oldPass);
			if(match){
				//new password
				const salt = "321dsa"
				const hash = await argon2.hash(newPass, salt);
				await users.updateOne(
					{username:name}, 
					{
						password: hash
					}
				);
				res.send({ok: true, message: "Password changed"});
			}
			res.send({ok: false, message: "Old password is invalid"})
		} catch (error) {
			console.log(error);
		}
		
	}

async reactivateUser(req, res){
		let {username: name, email: mail, password: pass} = req.body;
		try{
			const deletedUser = await deletedUsers.findOne({username:name})
			if (deletedUser && deletedUser.email === mail){
				const match = await argon2.verify(deletedUser.password, pass);
				if (match) {
					const user_added = await users.create({
						username: deletedUser.username,
						password: deletedUser.password,
						email: deletedUser.email
					})
					await deletedUsers.findOneAndDelete({username: deletedUser.username});
					res.send({ok: true, message: "Account reactivated successfully"});
				}
				res.send({ok: false, message: "Password is invalid."});
			}
			res.send({ok: false, message: "Credentials do not match a deleted user."});
		}catch(error){console.log(error)}
	}

async addUser(req,res){
		
	let {username: name, password: passName, email: mail}=req.body
		
  	try{
		const deletedUser = await deletedUsers.findOne({username:name})
		if (deletedUser){
			return res.send({ok:false, message: "user found, redirecting to reactivate", reactivate: true});
		}
		
      	const user = await users.findOne({username: name});
		if (user) return res.json({ ok: false, message: "User exists!"});
		const thisMailAddress = await users.findOne({email: mail});
		if (thisMailAddress) return res.json({ ok: false, message: "Account already created with this email"});
      	if (!validator.isEmail(mail)) return res.json({ ok: false, message: "invalid email provided" });
            
      	const salt = "321dsa"
      	const hash = await argon2.hash(passName, salt);
						
		const user_added = await users.create({
			username: name,
			password: hash,
			email: mail
		})
			
      	res.send({ok: true, message: "User successfully added"})
	}
	catch(e){
		console.log(e);
	}
}

async login(req, res){
		let {username: name, password: passName}=req.body
		try{
			const deletedUser = await deletedUsers.findOne({username:name})
			if (deletedUser){
				return res.send({ok:false, message: "user found, redirecting to reactivate", reactivate: true});
			}
			const user = await users.findOne({username: name})
			if(!user) return res.json({ok:false, message:"User not found!"})
			const match = await argon2.verify(user.password, passName);
			if(match){
			// once user is verified and confirmed we send back the token to keep in localStorage in the client and in this token we can add some data -- payload -- to retrieve from the token in the client and see, for example, which user is logged in exactly. The payload would be the first argument in .sign() method. In the following example we are sending an object with key userEmail and the value of email coming from the "user" found in line 47
	  		console.log(process.env.JWT_SECRET)
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
	    	expiresIn: "1h",
	  		}); //{expiresIn:'365d'}
	  		// after we send the payload to the client you can see how to get it in the client's Login component inside handleSubmit function
	  		console.log("Login Success")
            res.json({ ok: true, message: "login success", token });
			}else{
				res.json({ok:false,
				message:"incorrect password"})
			}
		}catch(e){
			res.send({e})
		}
	}

    /* create a login function that works with tokens
    hashs, and magicLink */

	async verifyToken(req, res){
		const token = req.headers.authorization;
		jwt.verify(token, process.env.JWT_SECRET, (err, succ) => {
			err
	  		  ? res.json({ ok: false, message: "Token is corrupted" })
	  		  : res.json({ ok: true, succ });
	});
	}

	async sendEmail(req, res){
        const senderEmail = process.env.NODEMAILER_EMAIL;
        const senderPassword = process.env.NODEMAILER_PASSWORD;

        const { thisEmail, magicLink } = req.body;

		console.log(thisEmail);

		const user = await users.findOne({ 
			email:thisEmail });
		
		if(!user){
			res.send({ ok: false,
				message: "username not found"})
		}

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: senderEmail,
              pass: senderPassword,
            },
        });
        // send mail with defined transport object
        try {
			if(!magicLink){
				const user = await users.findOneAndUpdate(
					{email:thisEmail}, 
					{MagicLink: uuidv4(), MagicLinkExpired: false}, 
					{returnDocument:'after'}
					);
				
				const URL = process.env.DOMAIN + '/sendEmail/';

				const info = await transporter.sendMail({
					from: senderEmail, // sender address
					to: thisEmail, // list of receivers
					subject: "Hello ✔", // Subject line
					text: "Hello world? Test1", // plain text body
					html: `<p>Hello friend and welcome back. This is your link to sign in to your account: ${URL}${thisEmail}/${user.MagicLink}'</p><p>Needless to remind you not to share this link with anyone 🤫</p>`, // html body
				});
		
				console.log("Message sent: %s", info.messageId);
				res.send({ok: false, message: "Link sent."})
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		
				//
				// NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
				//       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
				//       <https://github.com/forwardemail/preview-email>
				//
			} else if(user.MagicLink == magicLink && !user.MagicLinkExpired){
				const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: "1h" }); //{expiresIn:'365d'}
				//set the variable to expired, and send back the token
				await users.findOneAndUpdate(
					{email:thisEmail}, 
					{MagicLinkExpired: true}
					)
				res.json({ ok: true, message: "Welcome back", token, thisEmail });
				}
        } catch (error) {
           console.log(error);
        }
    }

}

module.exports = new Example()