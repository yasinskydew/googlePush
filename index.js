const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const app = express();
app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const credential = {
  client_id:"343029256848-8cf71b6a3m9dktirbsbobiqqob9ss252.apps.googleusercontent.com",
  refresh_token: "1//04oFVLodJSi_FCgYIARAAGAQSNwF-L9IrXxY0Ew-j-3pfo63LRZchjPRF9kE8hqyN2fkp7gQFuMsaiNu_djVPIWPB8PRCn4xm1tI",
  client_secret:"jhQJznZjzIJUvCTmyJH3HKln",
  redirect_uris: ["https://developers.google.com/oauthplayground"],
};
const oauth2Client = new google.auth.OAuth2(
    credential.client_id,
    credential.client_secret,
    credential.redirect_uris[0],
);
oauth2Client.setCredentials({
  refresh_token: credential.refresh_token
});
const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});

app.post('/push', (req, res) => {
  const { message } = req.body;
  const data = Buffer.from(message.data, 'base64').toString();
  console.log(data.historyId, 'message.data.historyId')
  // gmail.users.history.list({
  //   startHistoryId: historyId,
  //   userId: 'me',
  // }, (err, res) => {
  //   if (err) return console.log('The API returned an error: ' + err);
  //   gmail.users.messages.get({
  //     userId: 'me',
  //     id: res.data.history[0].messagesAdded[0].message.id
  //   }, (err, res) => {
  //     if (err) return console.log('The API returned an error: ' + err);
  //     res.data.payload.parts.map(i => {
  //       console.log(Buffer.from(i.body.data, 'base64').toString())
  //     })
  //     console.log(res.data.payload.parts)
  //   })
  // });
  res.send('Success');
});
app.get('/', function(req, res) {
  gmail.users.history.list({
    startHistoryId: '3893',
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    gmail.users.messages.get({
      userId: 'me',
      id: res.data.history[0].messagesAdded[0].message.id
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      res.data.payload.parts.map(i => {
        console.log(Buffer.from(i.body.data, 'base64').toString())
      })
      console.log(res.data.payload.parts)
    })
  });
  res.send('Backend Business Boutique is Ready');
});
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
