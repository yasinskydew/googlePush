import express from 'express';
export default (app, controllers) => {
  const router = express.Router();

  router
    .route('/')
    .post(controllers.gmailHistories.create)
  router
    .route('/:email')
    .get(controllers.gmailHistories.getByEmail)
    .put(controllers.gmailHistories.update)
    .delete(controllers.gmailHistories.destroy);
  return router;
};
