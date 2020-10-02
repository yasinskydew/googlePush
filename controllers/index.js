import gmailHistories from './gmailHistories';
import gmailApis from './gmailApis';

export default app => ({
  gmailHistories: gmailHistories(app),
  gmailApis: gmailApis(app),
});
