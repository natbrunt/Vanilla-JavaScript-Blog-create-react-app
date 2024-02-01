const admins = require('../models/Admin.js');
const dotenv = require('dotenv');
dotenv.config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

class AdminLogin {

	async findAllReturn(req, res){
		try{
			const data = await admins.find({});
			res.send(data)
		}catch(e){
			res.send({e})
		}
	}

	async addAdmin(req, res){

        const salt = "123ytr"

		let { 
			username: name,
            password: pass,
            adminKey: key,
		} = req.body;
		try{
            if(process.env.ADMIN_KEY === key){
                console.log("key match")
                
                const user = await admins.findOne({username: name});
                if (user) return res.json({ ok: false, message: "User exists!"});
                
                const hash = await argon2.hash(pass, salt);

                await admins.create(
                    {
                        username: name,
                        password: hash,
                        isAdmin: "true",
                    })
                res.send({ok: true, message: "admin created"});
            }
            res.send({ok: false, message: "failed to create"})

	    }
	    catch(error){
	        console.log(error)
	    };
	}

    async adminLogin(req, res){

        let {username: name, password: pass}=req.body
        
        try{
            const user = await admins.findOne({username: name})
            
            if(!user) return res.json({ok:false, message:"Admin not found!"})
            
            const match = await argon2.verify(user.password, pass);
            
            if(match){
                const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            }); //{expiresIn:'365d'}
                  
            res.json({ ok: true, message: "Login success", token });
        
        }else{
            res.json({ok:false, message:"incorrect password"})}
        }catch(e){
        console.log(e)
        }        
    }

    
    async verifyToken(req, res){
		const token = req.headers.authorization;
        console.log("verifyTokenServer");
		jwt.verify(token, process.env.JWT_SECRET, (err, succ) => {
			err
	  		  ? res.json({ ok: false, message: "Token is corrupted" })
	  		  : res.json({ ok: true, succ });
	    });
    }
        

}

module.exports = new AdminLogin()
