const express=require('express');
const app=express();
const routes=require('./Routes/routes')
const cors = require('cors');

require('dotenv').config()
const port=process.env.PORT
app.use(cors());

// parses incoming requests with JSON payloads
app.use(express.json());
// start
app.use('/api/', routes)


app.listen(port,(error)=>
{
    if(!error)
    { console.log("Server is Successfully Running,  and App is listening on port "+ port) }
    else 
    {
        console.log("Error occurred, server can't start", error); 
    } 
})