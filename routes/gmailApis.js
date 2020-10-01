import express from 'express';
export default (app, controllers) => {
  const router = express.Router();

  // router
  //   .route('/')
  //   .post(controllers.gmailHistories.create)
  router
    .route('/push')
    .post(controllers.gmailApis.pushNotification)
  return router;
};
