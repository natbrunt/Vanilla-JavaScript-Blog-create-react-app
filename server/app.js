const express = require('express'), 
app = express(),
mongoose = require('mongoose');

// to print incoming requests from mongoose in the terminal
mongoose.set('debug',true)
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const cors = require('cors')
app.use(cors())

require('dotenv').config({ path: './.env' });
const PORT = process.env.PORT;

const path = require('path');

async function connecting(){
try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to the DB')
} catch ( error ) {
    console.log('ERROR: Seems like your DB is not running, please start it up !!!');
}
}
connecting()

//routes
app.use('/assets', express.static(path.join(__dirname, 'static')))
// serving static files from public folder under the rout /assets
app.use('/assets', require('express').static(__dirname + '/files'));

/*Cyclic start*/
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
/*Cyclic end*/
app.use('/posts', require('./routes/posts.routes.js'));
app.use('/admin', require('./routes/admin.routes.js'));
app.use('/users', require('./routes/users.routes.js'));
app.use('/pictures', require('./routes/pictures.routes.js'))

app.listen(PORT, () => console.log(`listening`))