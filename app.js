const express = require('express')
const { exec } = require("child_process");
const AWS = require('aws-sdk')

const bodyParser = require('body-parser')

const app = express()
const port = 8081

app.use(bodyParser.json())

app.get('/health', (req, res) => {
    res.header({
        "System-Health": true,
    })
    res.sendStatus(204)
})

app.post('/sum',async  (req, res) => {
    const result = req.body.number1 + req.body.number2
    res.status(204).json({
        result: result// ./fop -fo examples/fo/tables/headfoot.fo -pdf ./header-table.pdf 
    })
    console.log("====>>>")

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
        region:'us-east-1',
    })
    const filePdf = './pdfs/header-1.pdf'
    const uploadImageResult = await fetch(filePdf)
    const blob = await uploadImageResult.buffer()

    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.files[0].originalFilename,
        Body: blob,
    }).promise()
    console.log(uploadedImage.Location)
    console.log("0000>>>>", result)
})

// app.get('/get-pdf',(req,res)=>{

//     let reporter = new Reporter().use(require('./')())

//     reporter.init()
//     jsreport.init()

//     const request = {
//         template: { content: fs.readFileSync(path.join(__dirname, '/hello.fo')).toString(), recipe: 'fop-pdf', engine: 'none' }
//       }
//       console.log("--->>>>",request)
//       return reporter.render(request).then(function (response) {
//         response.content.toString().should.containEql('%PDF')
//       })

// })

app.listen(port, () => {
    console.log('listening to port ', port)
})