const posts = require('../models/Post.js');
const { v4: uuidv4 } = require('uuid');

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
			image: imageUrl,
			body: bodyText
		} = req.body;
		try{

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
				image: imageUrl,
				body: bodyText,
				bookTitle: title,
				bookAuthor: author,
				id: uuidv4()
	       	})
			const newList = await posts.find({});
	        res.send({ok: true, message: "Post added", list:newList});

	    }
	    catch(error){
	        res.send({error});
	    };
	}

	async updatePost(req, res){
		let { 
			id: thisId,
			body: bodyText,
			bookTitle: title,
			bookAuthor: author,
			image: imageUrl,
			} = req.body
		try {
			const updatedOne = await posts.updateOne(
				{id:thisId}, 
				{
					body: bodyText,
					bookTitle: title,
					bookAuthor: author,
					image: imageUrl,
				}, 
				{returnDocument:'after'}
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
			await posts.deleteOne(
				{id: thisId}
			)
			const newList = await posts.find({});
			res.send({ok: true, message: "Post deleted", list: newList})
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
