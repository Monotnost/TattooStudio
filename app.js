const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");
const axios = require('axios')


const app = express();
app.use(express.static(path.resolve('./public/')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post(
  '/api/book',
  (req, res) => {
    let url = 'https://api.telegram.org/bot' + config.telegram_token + '/sendMessage';
    let params = req.body;


    // include mysql module
    var mysql = require('mysql');


// create a connection variable with the required details
    var con = mysql.createConnection({
      host: "localhost",    // ip address of server running mysql
      user: "root",    // user name to your mysql database
      password: "root", // corresponding password
      database: "tattoo" // use the specified database
    });

// make to connection to the database.
    con.connect(function (err) {
      if (err) throw err;
      // if connection is successful
      con.query("INSERT INTO client (artist, description, name, phone) values ('" + params.artist + "','" + params.msg + "','" + params.name + "', '" + params.phone + "')", function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) throw err;
        // if there is no error, you have the result
        console.log('row added successfully');
      });
    });


    console.log(params);
    let text = `Name: ${params.name}\nPhone: ${params.phone}\nArtist: ${params.artist}\nMessage: ${params.msg}\n`
    axios.get(url, {
      params: {
        chat_id: config.admin_id,
        text
      }
    }).then(
      () => {
        res.redirect('/')
      }
    ).catch(
      (e) => {
        console.log(e);
        res.redirect('/')
      }
    )
  }
);

app.listen(process.env.PORT || config.port);
console.log(`Application running on port ${process.env.PORT || config.port}`)
