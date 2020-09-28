const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/push', (req, res) => {
  console.log(req.body);
  res.send('success');
});
app.get('/', function(req, res) {
  res.send('Backend Business Boutique is Ready');
});
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
