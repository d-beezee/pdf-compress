import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import fs from "fs";
import gs from "ghostscript-js";
import { isValidPDF } from "ghostscript-node";
import multer from 'multer';
import tmp from "tmp";

dotenv.config();

const app: Express = express();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/', multer().any(), async(req: Request, res: Response) => {
  if (!req.query || !req.query.key || req.query.key != process.env.KEY) {
    res.status(403).send("Invalid key");
    return
  }
  if (!req.files || !req.files.length) {
    res.status(400).send("No files posted");
    return
  }
  const files = req.files as Express.Multer.File[]
  const file = files[0].buffer
  if (await isValidPDF(file) === false) {
    res.status(400).send("Not a valid pdf");
    return
  }

  const tmpFile = tmp.fileSync()
  
  const tmpFileOut = tmp.fileSync()

  fs.appendFileSync(tmpFile.fd, file);
  
  gs.exec([
    '-q',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    '-dPDFSETTINGS=/ebook',
    '-sOutputFile=' + tmpFileOut.name,
    tmpFile.name
  ], (codeError: any) => {
    tmpFile.removeCallback()
    if (codeError) {
      console.log(codeError)
      tmpFileOut.removeCallback()
      res.send('Error');
    } else {
      const data = fs.readFileSync(tmpFileOut.name)
      tmpFileOut.removeCallback()
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});