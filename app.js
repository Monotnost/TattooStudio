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
