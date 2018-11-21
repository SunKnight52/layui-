layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getAllBank,
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
            {field: 'bankCnfName', title: '中文名称',  align:'center'},
            {field: 'bankEnfName', title: '英文名称', align:'center'},
        ]]
    });



    //提交表单，添加银行
    form.on('submit(addBank)', function(data){

        $.ajax({
            url:config.host + config.addBank,
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
            title : "添加银行",
            type : 1,
            content : $('#add_template'),
            area: ['450px', '450px'],
        })
    }
    $(".add_btn").click(function(){
        $('#userId').val(localStorage.userId)
        addNews();
    })
})