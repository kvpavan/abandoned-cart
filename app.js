//require the express module
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/router");
const abandonedCart = require("./services");
const abandonedCartModal = require("./models/abandonedCart");
var cors = require('cors');
var cron = require('node-cron');



app.use(cors());
//require the http module
const http = require("http").Server(app);


const port = 3002;

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
});


//routes
app.use("/api", router);


process.on('unhandledRejection', (reason, p) => {
  console.log('Track Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

//to insert cart data
cron.schedule('0 0/10 * 1/1 * ? *', async()=>{
  const data = await abandonedCart();
  abandonedCartModal.abandonedCart.createBulk(data);
});


//to check cart data and trigger notification
cron.schedule('0 0/15 * 1/1 * ? *', async()=>{
  abandonedCartModal.abandonedCart.triggerNotification();
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
