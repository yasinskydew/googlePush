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

const gmailThreadFunc = (params, gmail) => {
  return new Promise((resolve, reject) => {
    gmail.users.threads.get(params, (err, res) => {
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
        console.log(err);
        reject(err.message)
      } else {
        resolve(res);
      }
    })
  });
};

export const getGmailHistory = async (userEmail) => {
  const GmailHistory = mongoose.model('GmailHistory');
  const gmailHistory = await GmailHistory.findOne({
    userEmail
  });
  if(!gmailHistory) {
    const newGmailHistory = new GmailHistory({
      userEmail,
    });
    await newGmailHistory.save();
    return newGmailHistory;
  }
  return gmailHistory;
}

export const parseNotification = (message) => {
  const { emailAddress, historyId } = JSON.parse(Buffer.from(message.data, 'base64').toString());
  return {
    userEmail: emailAddress,
    historyId,
  }
}


export const getThread = async (defaultHistoryId, gmail) => {
  const { history } = await gmailHistoryFunc({
    startHistoryId: `${defaultHistoryId}`,
    userId: 'me',
  }, gmail);
  const { messagesAdded, messages, id } = history[0];
  const [{ message:{ threadId } }] = messagesAdded;
  console.log(messagesAdded, 'messagesAdded');
  console.log(messages, 'messages');
  console.log(threadId, 'threadId');
  console.log(defaultHistoryId, 'defaultHistoryId');
  return threadId;
}
