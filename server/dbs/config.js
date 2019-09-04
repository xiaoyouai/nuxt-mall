var mongoose = require('mongoose');

//连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/store', { useNewUrlParser: true });

mongoose.connection.on('connected', function() { //连接成功
    console.log("mongdb connected success");
})
mongoose.connection.on('error', function(error) { //连接异常
    console.log("mongdb connected fail", error);
})
mongoose.connection.on('disconnected', function() { //连接断开
    console.log("mongdb connected disconnected");
})

module.exports = mongoose;