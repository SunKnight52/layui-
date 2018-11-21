layui.use(['form','layer'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //加载数据
    function initData()
    {
        $.ajax({
            url:config.host + config.getWithdrawSetting,
            type:'GET',
            data:{userId:localStorage.userId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0)
                {
                    $('#add_template input[name=userId]').val(localStorage.userId);
                    $('#add_template input[name=settingId]').val(result.data.id);
                    $('#add_template input[name=limits]').val(result.data.limits);
                    $('#add_template input[name=max]').val(result.data.max);
                    $('#add_template input[name=created]').val(getDate(result.data.created));
                    $('#add_template input[name=updated]').val(getDate(result.data.updated));
                }else{
                    alertS(result.message)
                }
            }
        });
    }

    initData();


    //提交编辑
    form.on('submit(updateForm)', function(data){

        var updateData = {
            userId: data.field.userId,
            id: data.field.settingId,
            limits: data.field.limits,
            max: data.field.max,
        }
        $.ajax({
            url:config.host + config.withdrawSetting,
            type:'POST',
            data:updateData,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                alertS(result.message)
                if (result.code == 0)
                {
                    //window.location.reload();
                }
            }
        });
        return false;
    });

})