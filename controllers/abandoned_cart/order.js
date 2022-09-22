const abandonedCart = require("../../models/abandonedCart");
exports.order = (req, res)=>{
    abandonedCart.abandonedCart.order(req, res);
}