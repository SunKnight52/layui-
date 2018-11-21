layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        verifierId;

    //获取用户信息
    function getCheck() {
        var userId = GetQueryString('userId');

        $.ajax({
            url:config.host + config.memberCheck,
            type:'GET',
            data:{userId:userId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0)
                {
                    if (result.data.verifierId != undefined)
                    {
                        verifierId = result.data.verifierId
                    }
                    $('#userVerifierId').val(localStorage.userId);
                    $('#userMemberId').val(userId);
                    $('#verifierId').val(result.data.verifierId);

                    $('#userVerifierStatus').val(result.data.userVerifierStatus);
                    $('#userRealName').val(result.data.userRealName);
                    $('#userVerifierRemark').val(result.data.userVerifierRemark);
                    if (result.data.userIdentityImg1 != null){
                        $('#img1').attr('src',config.memberImg + result.data.userIdentityImg1);
                    }
                    if (result.data.userIdentityImg2 != null) {
                        $('#img2').attr('src', config.memberImg + result.data.userIdentityImg2);
                    }
                    if (result.data.userIdentityImg3 != null) {
                        $('#img3').attr('src', config.memberImg + result.data.userIdentityImg3);
                    }
                    form.render();
                }else{
                    alertS(result.message)
                }
            }
        });
    }

    getCheck();


    //提交表单
    form.on('submit(memberAffirm)', function(data){

        $.ajax({
            url:config.host + config.memberAffirm,
            type:'POST',
            data:data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0)
                {
                    alertS(result.message)
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }else{
                    alertS(result.message)
                }
            }
        });
        return false;
    });

    //获取参数
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
})