layui.use(['form','layer'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //加载数据
    function initData()
    {
        $.ajax({
            url:config.host + config.getYbbSetting,
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
                    $('#add_template input[name=ybbSetId]').val(result.data.ybbSetId);

                    $('#add_template input[name=yearProfit]').val(result.data.yearProfit);
                    $('#add_template input[name=wanProfit]').val(result.data.wanProfit);
                    $('#add_template textarea[name=fund]').val(result.data.fund);
                    $('#add_template textarea[name=careful]').val(result.data.careful);
                    $('#add_template input[name=created]').val(getDate(result.data.created));
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
            ybbSetId: data.field.ybbSetId,
            wanProfit: data.field.wanProfit,
            fund: data.field.fund,
            careful: data.field.careful,
        }
        $.ajax({
            url:config.host + config.updateYbbSetting,
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
                    window.location.reload();
                }
            }
        });
        return false;
    });

})