layui.use(['form','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;

    //登录按钮
    form.on("submit(login)",function(data){
        var __this = $(this);
        __this.text("登录中...").attr("disabled","disabled").addClass("layui-disabled");
        if (data.field.rememberMe ==='on'){
            data.field.rememberMe = 1;
        }else{
            data.field.rememberMe = 0;
        }
        $.ajax({
            url:config.host + config.login,
            type:'POST',
            data:{username:data.field.username,password:data.field.password,rememberMe:data.field.rememberMe},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function(xhr) {

            },
            success:function (result) {
                console.log(result)
                if (result.code == 0 || result.message == '已登陆')
                {
                    localStorage.userId = result.data.userId;
                    layer.msg('登录成功');
                    setTimeout(function(){
                        window.location.href = "/";
                    },1000);
                }else{
                    alertS(result.message)
                    __this.text("登录").attr("disabled",false).removeClass("layui-disabled");
                }
            },
            error:function (jqXHR, textStatus, errorThrown) {
                layer.msg(textStatus)
            }
        })
        return false;
    })

})
