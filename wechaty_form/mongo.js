/**
 * Created by zhuozhuo on 2017/5/16.
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/runoob'; //数据库为 runoob

var insertData = function(db, callback) {
    //连接到表 site
    var collection = db.collection('site');
    //插入数据
    var data = [{"contact":"aa","name":"Mary","sex":"female","age":"12","job":"student","hobby":"swim"},{"contact":"aa","name":"Bob","sex":"male","age":"18","job":"student","hobby":"baskteball"}];
    collection.insert(data, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        callback(result);
    });
}

MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    insertData(db, function(result) {
        console.log(result);
        db.close();
    });
});