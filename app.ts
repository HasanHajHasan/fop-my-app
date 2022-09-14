import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 8080;

app.use(bodyParser.json())

app.get('/health',(req,res)=>{
    res.header({'System-Health':true});
    res.sendStatus(204)
})

const fibonacci = (n:number ):any=>{
    if(n<=1){
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}
app.post('/add',(req,res)=>{
    const fibIndex = req.body.index;
    res.status(202).json({index:fibIndex , result:'Calculating....'})
    console.log("Fibonacci number = ", fibonacci(fibIndex))
})

app.listen(port,()=>{
    console.log('Listen to port ',port)
})