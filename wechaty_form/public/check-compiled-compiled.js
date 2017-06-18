/**
 * Created by zhuozhuo on 2017/5/16.
 */
$(function () {
    var url = encodeURI(window.location.search);
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]);return null;
    }

    var contact = decodeURI(getQueryString("contact"));

    var datatosend = {
        "contact": contact

    };
    //  alert(contact);
    $.ajax({
        type: "get",
        url: 'http://192.168.1.121:8081/accept_get',
        crossDomain: true,
        dataType: "json",
        data: datatosend,
        success: function (data) {},
        error: function (data) {
            var a = JSON.stringify(data);
            // console.log(a);
            /*console.log(XMLHttpRequest.status);
             console.log(XMLHttpRequest.readyState);
             console.log(textStatus);
             console.log(XMLHttpRequest.responseText);*/
        }
    });

    $(".btn").click(function () {
        console.log("1");
        var reg_num = /^[0-9]{1,20}$/;
        var sex = $("input:radio[name='sex']:checked").val();

        if ($("#name").val() == "") {
            alert("Please input your name!");
            return false;
        }
        if ($("#age").val() == "") {
            alert("Please input your age1!");
            return false;
        } else if (!reg_num.test($("#age").val())) {
            alert("Please input your age2!");
            return false;
        }
        if (sex == "" || sex == null || sex == undefined) {
            alert("Please choose your sex!");
            console.log(sex);
            return false;
        }

        window.location.href = "./success.html";
    });
});

//# sourceMappingURL=check-compiled.js.map

//# sourceMappingURL=check-compiled-compiled.js.map