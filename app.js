const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utility/database');
const userRoute = require('./routes/userRoute');
const expenseRoute = require('./routes/expenseRoute');
const paymentRoute = require('./routes/paymentRoute');
const premiumRoute = require('./routes/premiumUserRoute');
const passwordRouter = require("./routes/password");
const userModel = require('./models/userModel');
const expenseModel = require('./models/expenseModel');
const orderModel = require('./models/order');
const ForgotPassword = require("./models/forgotPassword");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/payment', paymentRoute);
app.use("/leaderboard", premiumRoute);
app.use("/password", passwordRouter);
userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);

userModel.hasMany(ForgotPassword);
ForgotPassword.belongsTo(userModel);

sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT);
    console.log(`Server Running at port ${process.env.PORT}`);
    
}).catch((err)=>{
    console.log(err);
})