import mongoose from 'mongoose';
import { get, merge } from 'lodash';

export default app => {
  const GmailHistory = mongoose.model('GmailHistory');
  const create = async (req, res, next) => {
    try {
      const gmailHistory = new GmailHistory(req.body);
      await gmailHistory.save();
      return res.json(gmailHistory);
    } catch (err) {
      next(err);
    }
  };

  const getByEmail = async (req, res, next) => {
    try {
      const gmailHistory = await GmailHistory.findOne({
        userEmail: req.params.email
      });
      if (!gmailHistory) {
        return res.sendStatus(404);
      }
      return res.json(gmailHistory);
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const gmailHistory = await GmailHistory.findById(req.params.id);

      if (!gmailHistory) {
        return res.sendStatus(404);
      }
      const reqGmailHistory = get(req, 'body', {});
      const clonedGmailHistory = merge(gmailHistory, reqGmailHistory);
      await clonedGmailHistory.save();
      return res.json(clonedGmailHistory);
    } catch (err) {
      next(err);
    }
  };

  const destroy = async (req, res, next) => {
    try {
      const gmailHistory = await GmailHistory.findById(req.params.id);
      if (!gmailHistory) {
        return res.sendStatus(401);
      }
      await gmailHistory.remove();
      return res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  return {
    create,
    getByEmail,
    update,
    destroy,
  };
};
