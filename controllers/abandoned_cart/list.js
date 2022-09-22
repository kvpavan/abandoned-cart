const abandonedCart = require("../../models/abandonedCart");
exports.list = (req, res)=>{
    abandonedCart.abandonedCart.list(req, res);
}