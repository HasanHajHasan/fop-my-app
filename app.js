const express = require('express')
const { exec } = require("child_process");

const bodyParser = require('body-parser')

const app = express()
const port = 8080

app.use(bodyParser.json())

app.get('/health',(req,res)=>{
    res.header({
        "System-Health" :true,
    })
    res.sendStatus(204)
})

app.post('/sum',(req,res)=>{
    const result = req.body.number1 + req.body.number2
    res.status(204).json({
        result : result
    })
    exec("ls -la", (error, stdout, stderr) => {
        console.log("ls--->>")
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
    console.log("0000>>>>",result)
})

app.listen(port,()=>{
    console.log('listening to port ',port)
})