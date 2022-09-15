const express = require('express')
const { exec } = require("child_process");
const AWS = require('aws-sdk')
var convert = require('xml-js');
const fs = require("fs");
const bodyParser = require('body-parser')

const app = express()
const port = 8080

app.use(bodyParser.json())

app.get('/health', (req, res) => {
    var options = {compact: true, ignoreComment: true, spaces: 4};
    var result2 = convert.json2xml(req.body, options);
    fs.writeFile("fo.xml", result2, function(err, result) {
        if(err) console.log('error', err);
      });
    // fs.unlinkSync("demo.xml");
    console.log(result2)
    res.sendStatus(204)

})

app.post('/convert-to-pdf', async (req, res) => {
    const result = req.body.number1 + req.body.number2
    res.status(204).json({
        result: result// ./fop -fo examples/fo/tables/headfoot.fo -pdf ./header-table.pdf 
    })

    exec("./trialscript 'headfoot.fo' '../../opt/fop-my-app/pdfs/header-1.pdf'", (error, stdout, stderr) => {
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
    const s3 = new AWS.S3({
        region: 'us-east-1',
    })
    const filePdf = './pdfs/header-1.pdf'
    const uploadImageResult = await fetch(filePdf)
    const blob = await uploadImageResult.buffer()

    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.files[0].originalFilename,
        Body: blob,
    }).promise()
})

app.listen(port, () => {
    console.log('listening to port ', port)
})