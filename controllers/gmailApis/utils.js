import{ google } from 'googleapis';
import mongoose from "mongoose";

export const getGmailClient = (credentials) => {
  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0],
  );
  oauth2Client.setCredentials({
    refresh_token: credentials.refresh_token
  });
  return google.gmail({
    version: 'v1',
    auth: oauth2Client,
  });
}

const gmailHistoryFunc = (params, gmail) => {
  return new Promise((resolve, reject) => {
    gmail.users.history.list(params, (err, res) => {
      if(err) reject(err);
      resolve(res.data);
    });
  })
};

export const gmailWatch = (gmail) => {
  return new Promise((resolve, reject) => {
    gmail.users.watch({
      topicName: 'projects/node-js-290510/topics/test-theme',
      userId: 'me',
      labelIds: ["INBOX"],
    }, (err, res) => {
      if(err){
        console.log(err.message);
        reject(err.message)
      } else {
        resolve(res.data);
      }
    })
  });
};

export const getGmailHistory = async (params) => {
  const { userEmail } = params;
  const GmailHistory = mongoose.model('GmailHistory');
  const gmailHistory = await GmailHistory.findOne({
    userEmail
  });
  if(!gmailHistory) {
    const newGmailHistory = new GmailHistory(params);
    await newGmailHistory.save();
    return newGmailHistory;
  }
  return gmailHistory;
}

export const getGmailMessageFunc = (id, gmail) => {
  return new Promise((resolve, reject) => {
    gmail.users.messages.get({
      userId: 'me',
      id,
    }, (err, res) => {
      if(err){
        console.log(err.message);
        reject(err.message)
      } else {
        resolve(res.data);
      }
    })
  });
}

export const parseNotification = (message) => {
  const { emailAddress, historyId } = JSON.parse(Buffer.from(message.data, 'base64').toString());
  return {
    userEmail: emailAddress,
    historyId,
  }
}


export const getMessageData = async (defaultHistoryId, gmail) => {
  const { history } = await gmailHistoryFunc({
    startHistoryId: `${defaultHistoryId}`,
    userId: 'me',
  }, gmail);
  if(!history[history.length-1].messagesAdded) {
    return false;
  }
  const { messagesAdded } = history[history.length-1];
  const [{ message:{ threadId, id } }] = messagesAdded;
  const messageData = await getGmailMessageFunc(id, gmail);
  const { snippet, payload:{ headers } } = messageData;
  const delivery = headers.find(i => i.name === 'From');
  return {
    threadId,
    snippet,
    deliveryFromValue: delivery.value,
  }
}
