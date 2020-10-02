import mongoose from 'mongoose';
import axios from 'axios';
import {
  getGmailClient,
  gmailWatch,
  getGmailHistory,
  parseNotification,
  getMessageData,
} from './utils';
export default app => {
  const GmailHistory = mongoose.model('GmailHistory');

  const watchUser = async (req, res, next) => {
    try {
      const credentials = {
        client_id: "343029256848-8cf71b6a3m9dktirbsbobiqqob9ss252.apps.googleusercontent.com",
        refresh_token: "1//04WbDCMc_WpA4CgYIARAAGAQSNwF-L9IrDBFytXK5ir2LxJEGcUl2vFHRTNfU6H_F-FKVzcpre7-9ZbyWDUwNoZ3Kpq5h0Onuty0",
        client_secret: "jhQJznZjzIJUvCTmyJH3HKln",
        redirect_uris: ["https://developers.google.com/oauthplayground"],
        topicName: 'projects/node-js-290510/topics/test-theme',
        labelIds: ["INBOX"],
      };
      const gmail = getGmailClient(credentials);
      const [
        resultForWatch,
        gmailHistory,
      ] = await Promise.all([
        gmailWatch(gmail),
        getGmailHistory(req.body)
      ]);
      if (resultForWatch.historyId) {
        const {historyId} = resultForWatch;
        await gmailHistory.update({
          ...req.body,
          currentHistoryId: historyId,
        });
        return res.json({
          status: 'success',
        })
      }
      return res.json({
        status: 'error',
      })
    } catch(err) {
      next(err);
    }
  };

  const pushNotification = async (req, res, next) => {
    try {
      const { message } = req.body;
      const {
        userEmail,
        historyId,
      } = parseNotification(message);
      const gmailHistory = await getGmailHistory({userEmail});
      const { user, company } = gmailHistory;
      const credentials = {
        client_id: "343029256848-8cf71b6a3m9dktirbsbobiqqob9ss252.apps.googleusercontent.com",
        refresh_token: "1//04WbDCMc_WpA4CgYIARAAGAQSNwF-L9IrDBFytXK5ir2LxJEGcUl2vFHRTNfU6H_F-FKVzcpre7-9ZbyWDUwNoZ3Kpq5h0Onuty0",
        client_secret: "jhQJznZjzIJUvCTmyJH3HKln",
        redirect_uris: ["https://developers.google.com/oauthplayground"],
        userEmail: 'vovatesttestvova@gmail.com',
        topicName: 'projects/node-js-290510/topics/test-theme',
        labelIds: ["INBOX"],
      };
      const gmail = getGmailClient(credentials);
      const messageData = await getMessageData(gmailHistory.currentHistoryId, gmail);
      if(messageData) {
        await GmailHistory.findByIdAndUpdate(gmailHistory._id, {
          currentHistoryId: historyId,
        });
        const result = {
          ...messageData,
          userEmail,
          user,
          company,
          status: 1,
          timeOfGetMessage: new Date(),
        }
        const inputAxios = axios.create({
          baseURL: 'http://192.168.100.18:3000/api/',
        });
        await inputAxios.post('usermessages', result);
        return res.sendStatus(200);
      }
      return res.sendStatus(404);
    } catch (err) {
      next(err);
    }
  }

  return {
    watchUser,
    pushNotification,
  };
};
