import { exec } from 'child_process';
import fs from 'fs';
import tmp from "tmp";



export async function countPDFPages(pdfBuffer: Buffer): Promise<number> {

    const tmpFile = tmp.fileSync()

    fs.appendFileSync(tmpFile.fd, pdfBuffer);
    return new Promise((resolve, reject) => {
        exec('gs --permit-file-read=' + tmpFile.name + ' -q -dNODISPLAY -c "(' + tmpFile.name + ') (r) file runpdfbegin pdfpagecount = quit"', function (err, stdout, stderr) {
            tmpFile.removeCallback()
            if (err) {
                console.log(err)
                return reject("Error")
            }
            resolve(parseInt(stdout))
        })

    })

}

export async function isValidPDF(pdfBuffer: Buffer): Promise<boolean> {
    try {
        await countPDFPages(pdfBuffer);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}