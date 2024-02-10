const posts = require('../models/Post.js');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
  });


class Post {

	async findAllReturn(req, res){
		try{
			const data = await posts.find({});
			res.send(data)
		}catch(e){
			res.send({e})
		}
	}

	async addPost(req, res){
		let { 
			username: name,
			bookTitle: title,
			bookAuthor: author,
			imageSecureUrl: secure_url,
			imagePublicId: public_id,
			body: bodyText
		} = req.body;
		try{
			console.log('secure_url=')
			console.log(secure_url);
			const dateData = new Date()
			const day = dateData.getDate()
			const monthData = dateData.getMonth()
			let month;
			switch (monthData) {
				case 0:
					month="January"
					break;
				case 1:
					month="February"
					break;
				case 2:
					month="March"
					break;
				case 3:
					month="April"
					break;
				case 4:
					month="May"
					break;
				case 5:
					month="June"
					break;
				case 6:
					month="July"
					break;
				case 7:
					month="August"
					break;
				case 8:
					month="September"
					break;
				case 9:
					month="October"
					break;
				case 10:
					month="November"
					break;
				case 11:
					month="December"
					break;
				default:
					break;
			}
			const year = dateData.getFullYear()
			const newDate = month + " " + day + " " + year;
			
	       await posts.create(
	       	{
	       		username: name,
				date: newDate,
				timeStamp: dateData,
				imageSecureUrl: secure_url,
				imagePublicId: public_id,
				body: bodyText,
				bookTitle: title,
				bookAuthor: author,
				id: uuidv4()
	       	})
			const newList = await posts.find({});
	        res.send({ok: true, message: "Post added", list:newList});

	    }
	    catch(error){
	        console.log(error);
	    };
	}

	async updatePost(req, res){
		let { 
			id: thisId,
			body: bodyText,
			bookTitle: title,
			bookAuthor: author,
			imageSecureUrl: secure_url,
			imagePublicId: public_id,
			} = req.body
		try {
			await posts.updateOne(
				{id:thisId}, 
				{
					body: bodyText,
					bookTitle: title,
					bookAuthor: author,
					imageSecureUrl: secure_url,
					imagePublicId: public_id,
				}, 
			);
			const newList = await posts.find({});
			res.send({ok: true, message: "Post updated", 
				list: newList})
		} catch (error) {
			console.log(error)
		}
	}

	async removePost(req, res){
		let {
			id: thisId
		} = req.body;

		try {
			const deletedPost = await posts.findOneAndDelete(
				{id: thisId}
			)
			const newList = await posts.find({});
			try {
				console.log('deletedPostPublidId=')
				console.log(deletedPost.imagePublicId)
				await cloudinary.v2.api.delete_resources([deletedPost.imagePublicId]);
				res.send({ok: true, message: "Post deleted", list: newList})
			  } catch (error) {
				console.log(error)
				res.send({ ok: false, message: "Could not delete image from Cloudinary", list:newList})
			  }
		} catch (error) {
			console.log(error)
		}
	}

	async findOnePostById(req, res){
		let { id: thisId } = req.body;
		try {
			const thisPost = await posts.findOne(
				{id: thisId}
			)
			res.send({
				ok: true, 
				message: "post found",
				post: thisPost})
		} catch (error) {
			console.log(error)
		}
	}

}

module.exports = new Post()
