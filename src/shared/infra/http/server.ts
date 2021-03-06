import morgan from 'morgan';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import { LoggerStream } from '@config/winston';
import routes from './routes';
import globalErrorHandling from './middlewares/globalErrorHandling';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(
  morgan('combined', {
    stream: new LoggerStream(),
  }),
);

app.use(globalErrorHandling);

app.listen(process.env.PORT || 3000, async () => {
  /* eslint-disable no-console */
  console.log(`🚀 Server started on port ${process.env.PORT || 3000}!`);
});
