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
  refresh_token: "1//04WbDCMc_WpA4CgYIARAAGAQSNwF-L9IrDBFytXK5ir2LxJEGcUl2vFHRTNfU6H_F-FKVzcpre7-9ZbyWDUwNoZ3Kpq5h0Onuty0",
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
const gmailHistoryFunc = (params) => {
  return new Promise((resolve, reject) => {
    gmail.users.history.list(params, (err, res) => {
      if(err) reject(err);
      resolve(res.data);
    });
  })
};

app.post('/push', async (req, res) => {
  const { message } = req.body;
  const { emailAddress, historyId } = JSON.parse(Buffer.from(message.data, 'base64').toString());
  const history = await gmailHistoryFunc({
    startHistoryId: `${historyId}`,
    userId: 'me',
  });
  console.log('update');
  console.log(history, 'history');
  // gmail.users.history.list({
  //   startHistoryId: String(data.historyId),
  //   userId: 'me',
  // }, (err, res) => {
  //   if (err) return console.log('The API returned an error: ' + err);
  //   if(res.data.history.length) {
  //     const messages = res.data.history[0].messages;
  //     const messagesAdd = res.data.history[0].messagesAdded;
  //     if(messages.length) {
  //       gmail.users.messages.get({
  //         userId: 'me',
  //         id: messages[0].id
  //       }, (err2, res2) => {
  //         if (err2) return console.log('The API returned an error: ' + err);
  //         res2.data.payload.parts.map(i => {
  //           console.log(Buffer.from(i.body.data, 'base64').toString())
  //         })
  //         console.log(res.data.payload.parts)
  //       });
  //     }
  //     if(messagesAdd.length) {
  //       gmail.users.messages.get({
  //         userId: 'me',
  //         id: messagesAdd[0].message.id
  //       }, (err2, res2) => {
  //         if (err2) return console.log('The API returned an error: ' + err);
  //         res2.data.payload.parts.map(i => {
  //           console.log(Buffer.from(i.body.data, 'base64').toString())
  //         })
  //         console.log(res.data.payload.parts)
  //       })
  //     }
  //   }
  // });
  res.send('Success');
});

app.get('/watch', (req, res) => {
  gmail.users.watch({
    topicName: 'projects/node-js-290510/topics/test-theme',
    userId: 'me',
  }, (err, responce) => {
    if(err){
      console.log(err);
      res.send('error')
    } else {
      console.log(responce)
      res.send('success')
    }
  })
});

app.get('/', async function(req, res) {
  const history = await gmailHistoryFunc({
    startHistoryId: '5140',
    userId: 'me',
  });
  const threadId = history.history[0].messages[0].id;
  gmail.users.messages.list({
      userId: 'me',
      id: threadId
    }, (err2, res2) => {
      if (err2) return console.log('The API returned an error: ' + err);
      res2.data.payload.parts.map(i => {
        console.log(Buffer.from(i.body.data, 'base64').toString())
      })
    })
  res.send('Backend Business Boutique is Ready');
});
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
