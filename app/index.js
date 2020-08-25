const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const cors = require('cors')();

require('dotenv').config();

// App Init:
const app = express();

// Set Cors:
app.use(cors);

// Key:
const CKEY = process.env.CUSTOMER_KEY;

// URL Generator
const URL = (PARAMS)=>`https://api.500px.com/v1/photos?consumer_key=${CKEY}&${PARAMS}`;


// Routes:
app.get('/', async(req,res)=>{
   
    return res.status(200).send(`
        <div style="width:100%; padding-top:150px; text-align:center">
            <h1 style="font-size:60px">Welcome to my 500px API</h1>
            <br/> 
            <p style="font-size: 20px;font-family: monospace;">Use '/popular' for photo GETS.</p>
        </div>
    `)
});

app.get('/popular/:filter/:page', async(req,res)=>{
    const {filter, page} = req.params;
    const validFilters = ['popular','highest_rated','upcoming' ,'editors','fresh_today','fresh_yesterday','fresh_today','fresh_week' ];
    const ifFilterIsValid = validFilters.includes(filter);

    if(ifFilterIsValid){
        const results = await axios.get(URL(`feature=${filter}&page=${page}&rpp=20`)).then(response => response).catch(error => error);
        
        return res.status(200).send(results.data)
    }
    else{
        return res.status(200).send(`
            <div style="width:100%; padding-top:150px; text-align:center">
                <h1 style="font-size:60px">Invalid Filter</h1>
                <br/> 
                <p style="font-size: 20px;font-family: monospace;">Use one of the following filters</p>
                <p style="font-size: 15px;font-family: monospace; opacity:0.8">${validFilters}</p>
            </div>
        `)
    }
});

app.listen(process.env.PORT || 5555, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    } else {
        console.log(`Running on ${process.env.PORT || 5555}`)
    }
});


// Handle 404 - Keep this as a last route:
app.use(function(req, res) {
    res.status(404).send(`
        <div style="width:100%; padding-top:150px; text-align:center">
            <h1 style="font-size:60px">404</h1>
            <br/> 
            <p style="font-size: 20px;font-family: monospace;">Invalid Route Request</p>
        </div>
    `);
});

