import gmailHistories from './gmailHistories';
import gmailApis from './gmailApis';
import jobBulls from './jobBulls';

export default app => ({
  gmailHistories: gmailHistories(app),
  gmailApis: gmailApis(app),
  jobBulls: jobBulls(app),
});
