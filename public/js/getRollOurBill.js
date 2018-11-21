layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getRollOurBill,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        where:{
            userId:localStorage.userId
        },
        cols : [[
            {type:'checkbox'},
            {field: 'ybbBillId', title: '账单ID',  align:'center'},
            {field: 'userId', title: '用户ID',  align:'center'},
            {field: 'ybbId', title: '链盟宝ID', align:'center'},
            {field: 'ybbBillCode', title: '账单号',  align:'center',},
            {field: 'type', title: '类型', align:'center',templet:function (d) {
                    if (d.type ==1)
                    {
                        return '转入';
                    }else if(d.type ==2)
                    {
                        return '转出';
                    }
                }},
            {field: 'money', title: '积分', align:'center'},
            {field: 'created', title: '创建时间', align:'center',templet:function (d) {
                    return getDate(d.created)
                }},
        ]]
    });

    laydate.render({
        elem: '#startTime', //指定元素
        type: 'datetime'
    });
    laydate.render({
        elem: '#endTime', //指定元素
        type: 'datetime'
    });

    //提交搜索
    form.on('submit(searchForm)', function(data){

        var where = {};
        where.userId = localStorage.userId;

        if (data.field.startTime != '')
        {
            where.startTime = new Date(data.field.startTime).getTime();
        }
        if (data.field.endTime != '')
        {
            where.endTime = new Date(data.field.endTime).getTime();
        }

        if (data.field.sort != ''){
            where.sort = data.field.sort;
        }

        if (data.field.order != ''){
            where.order = data.field.order;
        }
        //开始查询
        table.reload("userListTable",{

            where:where
        })
        return false;
    });


})