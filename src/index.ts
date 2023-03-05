import protectedByKey from "@src/middeware/secret";
import pdfcompress from "@src/routes/pdfcompress";
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import multer from 'multer';

dotenv.config();

const app: Express = express();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/', protectedByKey, multer().any(), pdfcompress);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});