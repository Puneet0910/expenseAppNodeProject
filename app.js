const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utility/database');
const userRoute = require('./routes/userRoute');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoute);

sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT);
    console.log(`Server Running at port ${process.env.PORT}`);
    
}).catch((err)=>{
    console.log(err);
})