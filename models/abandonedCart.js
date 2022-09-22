const pool = require("../mysql_connect");
const moment = require("moment");

const nodemailer = require("nodemailer");

exports.abandonedCart = {
    create: function (customerId, email, triggered, createdAt, status = 0) {
        let params = [customerId, email, triggered, createdAt, status];
        this.queryRun("insert into abandoned_cart ( customerId, email, triggered, createdAt, status) values(?, ?, ?, ?, ?)")
        .then(data=>{
           return {status: "success", "message": "data added tp abandonedCart!!!"}
        })
        .catch(function(error){
            //console.error(error);
            return error;
        });
    },
    update: function (customerId, triggered, status) {
        const updateData = '';
        const params = [];
        if(triggered){
            updateData += ' triggered=?'
            params.push(triggered);
        }

        if(triggered){
            if(updateData){
                updateData += ', ';
            }
            params.push(status);
            updateData += ' status=?'
        }
        params.push(customerId);

        this.queryRun(`UPDATE abandoned_cart SET ${updateData} WHERE customerId=?`, params)
        .then(data=>{
            return {status: "success", "message": "Abandoned cart updated successfully!!!"}
        })
        .catch(function(error){
            //console.error(error);
            return error;
        });
    },
    get: async function (customerId) {
        const params = [customerId]
        return this.queryRun("select * from abandoned_cart where customerId=? and status=0", customerId)
        
    },
    createBulk: async function (data) {
        data.forEach(async(cart)=>{
            let check = await this.get(data.customerId);
            if(check && check.length > 0){
                continue;
            }
            this.create(data.customerId, data.email, 0, Date(), 0);
        })
    },
    triggerNotification: async function () {  
        this.queryRun("select * from abandoned_cart where status = 0 and triggered< 3")
        .then(data=>{
            data.forEach(cart=>{
                let timeDiff = moment.duration(moment(cart.createdAt).diff(moment())).asMinutes();
                if(cart.triggered == 0 && timeDiff > 30){
                    //send notification and update cart
                    this.update(data.customerId, 1, null);
                    continue;
                }
                if(cart.triggered == 1 && timeDiff > 60*24){
                    //send notification and update cart
                    this.update(data.customerId, 2, null);
                    continue;
                }
                
                if(cart.triggered == 1 && timeDiff > 60*24*3){
                    //send notification and update cart
                    this.update(data.customerId, 3, null);
                    continue;
                }
            })
        })
        .catch(function(error){
            //console.error(error);
            return error;
        });
    },
    list: async function (req, res) {  
        this.queryRun("select * from abandoned_cart")
        .then(data=>res.json(data))
        .catch(function(error){
            //console.error(error);
            res.json(error)
        });
    },
    order: async function (req, res) {  
        return this.update(req.body.customer.id, null, 1);
    },
    queryRun: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            
            pool.getConnection(function(err, connection) {
                if (err){
                    console.log(err)
                    reject({status: "error", "message": "Connection pool failed!!!", "message":err});
                }
                connection.query(sql, params, function (err, result) {                
                    if (err){
                    // console.log(err)
                        
                        //console.log(pool._freeConnections.indexOf(connection)); // -1

                        connection.release();

                        //console.log(pool._freeConnections.indexOf(connection)); // 0
                        reject({status: "error", "message": "Connection failed!!!", "message":err});
                    } 
                    else{                    
                        //console.log(err, result)
                        //console.log(pool._freeConnections.indexOf(connection)); // -1

                        connection.release();

                        //console.log(pool._freeConnections.indexOf(connection)); // 0
                        var string=JSON.stringify(result);
                        var json =  JSON.parse(string);
                        //connection.end();
                        resolve(json);
                    }
                });
            });
        })
        
    }

}