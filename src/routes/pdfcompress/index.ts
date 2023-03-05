import { isValidPDF } from "@src/gs";
import { spawn } from 'child_process';
import { Request, Response } from 'express';
import fs from "fs";
import tmp from "tmp";


export default async (req: Request, res: Response) => {
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

    console.log("Working on " + files[0].originalname)

    const tmpFile = tmp.fileSync()


    fs.appendFileSync(tmpFile.fd, file);

    const processpdf = spawn('gs', [
        '-q',
        '-dNOPAUSE',
        '-dBATCH',
        '-dSAFER',
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/ebook',
        '-sOutputFile=-',
        tmpFile.name
    ])

    processpdf.stdout.on("data", function (data) {
        res.write(data)
    })

    processpdf.on('exit', function (code) {
        if (code) console.log('child process exited with code ' + code.toString());
        tmpFile.removeCallback()
        res.end()
    });
}