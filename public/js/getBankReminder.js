layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getBankReminder,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        where:{
            userId:localStorage.userId,
        },
        cols : [[
            {type:'checkbox'},
            {field: 'title', title: '标题',  align:'center'},
            {field: 'type', title: '类型', align:'center',templet:function (d) {
                    if (d.type == 1)
                    {
                        return '温馨提示';
                    }else if (d.type == 2)
                    {
                        return '汇款提示';
                    }
                }},
            {field: 'content', title: '内容', align:'center'},
            {field: 'created', title: '时间', align:'center',templet:function (d) {
                    return getDate(d.created)
                }},
        ]]
    });


    var active = {
        edit: function(){
            //新增
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            if (data.length>1 || data.length<=0){
                alertS('请选中一条数据');
                return false;
            }
            addNews(data[0]);
        }

    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    //提交表单，添加银行
    form.on('submit(editForm)', function(data){
        $.ajax({
            url:config.host + config.updateBankReminder,
            type:'POST',
            data:data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                alertS(result.message)
                if (result.code == 0)
                {
                    tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });

    function addNews(edit){
        index = layui.layer.open({
            title : "修改",
            type : 1,
            content : $('#add_template'),
            area: ['650px', '450px'],
            success : function(layero, index){
                if(edit){
                    $('#userId').val(localStorage.userId);
                    $('#add_template input[name=reminderId]').val(edit.reminderId);
                    $('#add_template input[name=title]').val(edit.title);
                    $('#add_template textarea[name=content]').val(edit.content);
                }
            }
        })
    }
})