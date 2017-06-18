/**
 * Created by zhuozhuo on 2017/5/16.
 */
const { Wechaty, Room } = require('wechaty')
var who=""
var MongoClient = require('mongodb').MongoClient
var DB_CONN_STR = 'mongodb://localhost:27017/runoob'
Wechaty.instance()
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        require('qrcode-terminal').generate(loginUrl)
        console.log(url)
    })

    .on('login', user => {
        console.log(`${user} login`)
    })

    .on('room-join', (room, invitee, inviter) => {
        const user = bot.user()
        console.log((user).id)
    })

    .on('friend', function(contact, request) {
        if (request) {
            request.accept().then(function() {
                console.log(`Contact: ${contact.name()} send request ${request.hello}`)
            })
        }
    })

   /* .on('room-join', function(this, room, inviteeList, inviter) {
        log.info('Bot', 'EVENT: room-join - Room %s got new member %s, invited by %s',
            room.topic(),
            inviteeList.map(c => c.name()).join(','),
            inviter.name(),
        )
    })*/

    .on('message',async function(message){
        const contact = message.from()
        const content = message.content()
        const room = message.room()

        if (room) {
            console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
        } else {
            console.log(`Contact: ${contact.name()} Content: ${content}`)
        }

        if (message.self()) {
            return
        }

        if (/hello/.test(content)) {
            message.say("hello how are you")
        }

        if (/swim/.test(content)) {
            let keyroom = await  Room.find({topic: "swim"})
            if (keyroom) {
                await keyroom.add(contact)
                await keyroom.say("welcome!", contact)
            }
        }
    })
        .on('message', function(m){
            const contact = m.from()
            const content = m.content()
            const room = m.room()

            if(/room/.test(content)){
                let joinroom = Room.find({topic:"swim"});
                if(joinroom){
                    joinroom.add(contact);
                }
            }

            if (room) {
                console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
            } else {
                console.log(`Contact: ${contact.name()} Content: ${content}`)
            }

            if (m.self()) {
                return
            }

            if (/What/.test(content)) {
                m.say("I am coding!")
            }

            if (/swim/.test(content)) {
                let user = `${contact.name()}`
                m.say("Please click the following url, and input the form. You will be invited into the group after checked!")
                m.say('http://192.168.1.112:8081/form?contact='+user)

                var selectData = function (db, callback) {
                    //连接到表
                    var collection = db.collection('site')
                    //查询数据
                    var array = {"status": 1}
                    collection.find(array).toArray(function (err, result) {
                        if (err) {
                            console.log('Error:' + err)
                            return;
                        }
                        callback(result);

                    });
                }

                MongoClient.connect(DB_CONN_STR, function (err, db) {

                    if(err){
                        console.log('Error:'+ err);
                        console.log("數據庫連接失敗！");
                        return;
                    }

                    console.log("连接成功！");
                    selectData(db, function (result) {
                        console.log(result);
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++){
                                console.log("聯係人1："+JSON.stringify(result[i]))
                                who = result[i].contact;
                                console.log(who);
                                Room.find({topic: "swim"}).then(function(keyroom){
                                    console.log("聯係人："+who)
                                    console.log(keyroom)
                                    if (keyroom) {
                                       // keyroom.say("welcome!", who)
                                        keyroom[0].add(who).then(function () {
                                            keyroom[0].say("welcome!", who)
                                        })
                                    }
                                })
                            }

                        }
                        // res.end(JSON.stringify(result));
                        db.close();
                    });
                });
            }



            if (/out/.test(content)) {
                Room.find({ topic: "test" }).then(function(keyroom) {
                    if (keyroom) {
                        keyroom.del(contact).then(function() {
                            keyroom.say("Remove from the room", contact)
                        })
                    }
                })
            }
        })

        .init()