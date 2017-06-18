/**
 * Created by zhuozhuo on 2017/5/18.
 */
/*---------------------Accept----------------------*/
function acceptIt(x) {
    var contact = x.parentNode.firstChild.innerHTML;
    var datatosend1 = {
        "contact": contact,
        "accept": 1
    };
    console.log(datatosend1);
    $.ajax({
        type: "get",
        url: 'http://192.168.1.121:8081/accept_get',
        crossDomain: true,
        dataType: "json",
        data: datatosend1,
        success: function (data) {
            location.reload();
        },
        error: function (data) {
            var a = JSON.stringify(data);
            // console.log(a);
            /*console.log(XMLHttpRequest.status);
             console.log(XMLHttpRequest.readyState);
             console.log(textStatus);
             console.log(XMLHttpRequest.responseText);*/
        }
    });
}
function refuseIt(x) {
    var contact = x.parentNode.firstChild.innerHTML;
    alert(contact);
    var datatosend2 = {
        "contact": contact,
        "accept": 2
    };
    console.log(contact);
    console.log(datatosend2);
    $.ajax({
        type: "get",
        url: 'http://192.168.1.121:8081/accept_get',
        crossDomain: true,
        dataType: "json",
        data: datatosend2,
        success: function (data) {
            location.reload();
        },
        error: function (data) {
            var a = JSON.stringify(data);
            // console.log(a);
            /*console.log(XMLHttpRequest.status);
             console.log(XMLHttpRequest.readyState);
             console.log(textStatus);
             console.log(XMLHttpRequest.responseText);*/
        }
    });
}
$(function () {
    $.ajax({
        type: "get",
        url: 'http://192.168.1.121:8081/check_get',
        crossDomain: true,
        dataType: "json",
        success: function (data) {
            //$("#name").val()
            //console.log(data);
            var txt = "";
            for (var i = 0; i < data.length; i++) {
                //  console.log(data[0]);
                txt = txt + ' <div class="row"><span style="display:none" name="contact" id="contact">' + data[i].contact + '</span><span class="label">Name:</span><span class="label1" name="name" id="name">' + data[i].name + '</span>' + '<span class="label">Sex:</span><span class="label1" name="sex" id="sex">' + data[i].sex + '</span><span class="label">Age:</span>' + '<span class="label1" name="age" id="age">' + data[i].age + '</span><span class="label">Job:&nbsp;</span>' + '<span class="label1" name="job" id="job">' + data[i].job + '</span><span class="label">Hobby:</span><span class="label1" name="hobby" id="hobby">' + data[i].hobby + '</span>' + '<button name="accept" class="btn btn1" onClick="javascript:acceptIt(this);">Accept</button><button name="accept" class="btn btn2" onClick="javascript:refuseIt(this);">Refuse</button></div>';
            }
            //console.log(txt);

            $(".container").html(txt);
        },
        error: function (data) {
            var a = JSON.stringify(data);
            // console.log(a);
            /*console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
            console.log(XMLHttpRequest.responseText);*/
        }
    });
});

//# sourceMappingURL=accept-compiled.js.map