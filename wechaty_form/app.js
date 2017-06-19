/**
 * Created by zhuozhuo on 2017/5/16.
 */
//express_demo.js 文件
var express = require('express');
//var router = express.Router()
var app = express();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/runoob';
//var contact=""
app.use(express.static('public'));

app.get('/form', function (req, res) {
    response={
        contact:req.query.contact
    }
    contact=req.query.contact
    console.log(req.query.contact)
    //  res.render(contact:req.query.contact)
    res.sendFile( __dirname + "/public/"+ "form.html" );
})

/*--------------------------form submit-----------------------*/

app.get('/process_get', function (req, res) {
   // console.log(response);
    // 输出 JSON 格式
    response = {
        contact:contact,
        name:req.query.name,
        sex:req.query.sex,
        age:req.query.age,
        job:req.query.job,
        hobby:req.query.hobby
    };

    var insertData = function(db, callback) {
        //连接到表 site
        var collection = db.collection('site');
        //插入数据
        var data = [{"contact":contact,"name":req.query.name,"sex":req.query.sex,"age":req.query.age,"job":req.query.job,"hobby":req.query.hobby,"status":0}];
        collection.insert(data, function(err, result) {
            if(err)
            {
               // console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        insertData(db, function(result) {
           // console.log(result);
            db.close();
        });
    });

   // console.log(response);
   // res.end(JSON.stringify(response));
    res.redirect('/success.html');
})


/*-----------------------check---------------------------------*/
app.get('/check', function (req, res) {
    res.sendFile( __dirname + "/public/"+ "check.html" );
})

app.get('/check_get', function (req, res) {
    // console.log(response);
    // 输出 JSON 格式


    var selectData = function (db, callback) {
        //连接到表
        var collection = db.collection('site');
        //查询数据
        var array = {"status": 0};
        collection.find(array).toArray(function (err, result) {
            if (err) {
               // console.log('Error:' + err);
                return;
            }
            callback(result);

        });
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
       // console.log("连接成功！");
        selectData(db, function (result) {
            //console.log(result);
            response = {
                contact: result.contact,
                name: result.name,
                sex: result.sex,
                age: result.age,
                job: result.job,
                hobby: result.hobby
            };
            res.end(JSON.stringify(result));
            db.close();
        });
    });
})

app.get('/accept_get', function (req, res) {
   // console.log(response);
    var updateData = function(db/*, callback*/) {
     //连接到表
     var collection = db.collection('site');
     //更新数据
     var whereStr = {"contact":req.query.contact};
        console.log("contact"+req.query.contact)
        console.log(req.query.accept);
     var updateStr="";
        if(req.query.accept==1){
            updateStr = {$set: { "status" : 1 }};
        }
        else if(req.query.accept==2){
            updateStr = {$set: { "status" : 2 }};
        }
        console.log(typeof(updateStr));
     /*collection.update(whereStr,updateStr, function(err, result) {
     if(err)
     {
         console.log('Error:'+ err);
         return;
     }
     callback(result);
     });*/
        collection.update(whereStr,updateStr,false,true);
     }

     MongoClient.connect(DB_CONN_STR, function(err, db) {
     console.log("连接成功！");
     updateData(db);/*, function(result) {
     console.log(result);
         res.end(JSON.stringify(result));

     });*/
         db.close();
     });
})







var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://%s:%s`, host, port)
})