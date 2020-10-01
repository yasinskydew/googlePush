const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/push', async (req, res) => {
  axios.post('http://0.0.0.0:3001/api/gmailapis/push', req.body)
    .then(function (response) {
      res.send('success')
    })
    .catch(function (error) {
      res.send('error')
    });
});
const port = process.env.PORT || 3002;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
