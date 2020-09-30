import mongoose from 'mongoose';
import { get, merge } from 'lodash';

export default app => {
  const JobBull = mongoose.model('JobBull');
  const create = async () => {
    try {
      const gmailHistory = new JobBull({

      });
      await gmailHistory.save();
    } catch (err) {
    }
  };

  return {
    create,
  };
};
