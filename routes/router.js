const express = require("express");

const { list }  = require('../controllers/abandoned_cart/list')
const { order }  = require('../controllers/abandoned_cart/order')
const router = express.Router();

router.get('/cart/list', list);     //to see the list of abandoned_cart
router.post('/webhook/order', list);    //to update cart status when order placed

module.exports = router;
