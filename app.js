import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import routes from './routes';
import errors from './helpers/errors';
import './models';
import './db';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
app.use(cors());
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.use(express.static(`public`));

app.use(
  session({
    secret: 'conduit',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);

if (!isProduction) {
  app.use(errorhandler());
}

app.get('/', (req, res) => {
  res.send('Backend Business Boutique is Ready');
});

app.use(routes(app));
app.use((req, res, next) => {
  const err = new Error(errors.notfound);
  err.status = 404;
  next(err);
});
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${server.address().port}`);
});

module.exports = app;
