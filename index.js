const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/push', (req, res) => {
  const { message } = req.body;
  const name = message.data
    ? Buffer.from(message.data, 'base64').toString()
    : 'unknown';
  console.log(req.body);
  console.log(`hello ${name}`);
  res.send(`hello ${name}`);
});
app.get('/', function(req, res) {
  res.send('Backend Business Boutique is Ready');
});
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
