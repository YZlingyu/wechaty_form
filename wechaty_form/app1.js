/**
 * Created by zhuozhuo on 2017/5/16.
 */
//express_demo.js 文件
var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/form.html', function (req, res) {
    res.sendFile( __dirname + "/" + "form.html" );
})

/*app.get('/', function (req, res) {
    res.send('Hello World');
})*/
app.get('/process_get', function (req, res) {

    // 输出 JSON 格式
    response = {
        name:req.query.name,
        sex:req.query.sex,
        age:req.query.age,
        job:req.query.job,
        hobby:req.query.hobby
    };

    console.log(response);
    res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})