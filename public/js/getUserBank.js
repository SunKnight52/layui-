layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getUserBank,
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
            {field: 'userAccount', title: '账号',  align:'center'},
            {field: 'bankName', title: '银行名称', align:'center'},
            {field: 'bankCode', title: '卡号', align:'center'},
            {field: 'created', title: '时间', align:'center',templet:function (d) {
                    return getDate(d.created)
                }},
        ]]
    });

})