import express from "express";
import { exec } from "child_process";
import AWS from 'aws-sdk';
import convert from 'xml-js';
import fs from 'fs';
import bodyParser from "body-parser";
import path from "path";
import { writeFileSync } from 'fs';
import { rando } from '@nastyox/rando.js';

const s3 = new AWS.S3({
    region: 'us-east-1',
})

const app = express();
const port = 8080;

app.use(bodyParser.json())

app.post( "/export-to-pdf", async ( req, res ) => {
    const options = {compact: true, ignoreComment: true, spaces: 4};
    const result = convert.json2xml(req.body, options);
    console.log("fop file")
    const fileName = `${rando(100000)}-pdf`
    writeFileSync(`../fops/${fileName}.fo`, result);
    console.log("file name: ",fileName)
    exec(`fopScript.sh '../../opt/fop-my-app/fops/${fileName}.fo' '../../opt/fop-my-app/pdfs/${fileName}.pdf'`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    const filePdf = `../pdfs/${fileName}.pdf`
    // const blob = fs.createReadStream(filePdf)

    const uploadedImage = await s3.upload({
        Bucket: "fop-bucket778",
        Key: `${fileName}.pdf`,
        Body: `../pdfs/${fileName}.pdf`,
        ContentType : 'application/pdf'

    }).promise();
    console.log("---->>",uploadedImage)
    res.send({
        url:uploadedImage.Location
    }) 
    
} );

app.listen( port, () => {
    console.log( `server started at port ${ port }` );
} );