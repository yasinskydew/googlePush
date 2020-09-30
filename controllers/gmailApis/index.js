import mongoose from 'mongoose';
import {
  getGmailClient,
  gmailWatch,
  getGmailHistory,
  parseNotification,
  getThread,
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
        userEmail: 'vovatesttestvova@gmail.com',
        topicName: 'projects/node-js-290510/topics/test-theme',
        labelIds: ["INBOX"],
      };
      const gmail = getGmailClient(credentials);
      const [
        resultForWatch,
        gmailHistory,
      ] = await Promise.all([
        gmailWatch(gmail),
        getGmailHistory(credentials.userEmail)
      ]);
      if (resultForWatch.historyId) {
        const {historyId} = resultForWatch;
        await gmailHistory.update({
          historyId,
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
      const {message} = req.body;
      const {
        userEmail,
        historyId,
      } = parseNotification(message);
      const gmailHistory = await getGmailHistory(userEmail);
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
      const threadId = await getThread(gmailHistory.historyId, gmail);
      await GmailHistory.findByIdAndUpdate(gmailHistory._id, {
        historyId,
        userEmail,
      });
      return res.json({
        threadId,
      });
    } catch (err) {
      next(err);
    }
  }

  return {
    watchUser,
    pushNotification,
  };
};
