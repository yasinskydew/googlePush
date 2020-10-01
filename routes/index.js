import express from 'express';
import { cloneDeep } from 'lodash';
import allControllers from '../controllers';
import gmailHistories from './gmailHistories';
import gmailApis from './gmailApis';

export default app => {
  const router = express.Router();
  const controllers = allControllers(app);
  router.use('/api/gmailhistories', gmailHistories(app, controllers));
  router.use('/api/gmailapis', gmailApis(app, controllers));
  router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        errors: Object.keys(err.errors).reduce((errors, key) => {
          const clonedError = cloneDeep(errors);
          clonedError[key] = err.errors[key].message;

          return clonedError;
        }, {}),
      });
    }

    return next(err);
  });

  return router;
};
