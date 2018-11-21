layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.companyFeesRunBills,
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
            {field: 'userId', title: '用户',  align:'center'},
            {field: 'coinName', title: '币种', align:'center',},
            {field: 'billCode', title: '账单号', align:'center'},
            {field: 'status', title: '类型', align:'center',templet:function (d) {
                    switch (d.status)
                    {
                        case 1:
                            return '<span class="layui-badge">买币</span>';
                            break;
                        case 2:
                            return '<span class="layui-badge layui-bg-orange">卖币</span>';
                            break;
                        case 3:
                            return '<span class="layui-badge layui-bg-green">提币</span>';
                            break;
                        case 4:
                            return '<span class="layui-badge layui-bg-cyan">提现</span>';
                            break;
                    }
                }},
            {field: 'feesScale', title: '分润比例', align:'center',},
            {field: 'feesNumber', title: '分润积分', align:'center'},
            {field: 'consumerId', title: '消费者', align:'center'},
            {field: 'consumerFees', title: '总分润积分', align:'center'},
            {field: 'created', title: '时间', align:'center',templet:function (d) {
                    return timestampToTime(d.created);
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

    //初始化币种
    function initCoin()
    {
        $.ajax({
            url:config.host + config.getAllCoin,
            type:'GET',
            data:{userId:localStorage.userId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            success:function (result) {
                if (result.code == 0)
                {
                    var option = '<option value="">全部</option>';
                    $.each(result.data,function (i,v) {
                        option += '<option value="'+v.coinId+'">'+v.coinName+'</option>'
                    })
                    $('#coinId').empty().append(option);
                    form.render('select');
                }else{
                    alertS(result.message)
                }
            }
        })
    }
    initCoin();


    //提交表单
    form.on('submit(searchForm)', function(data){
        var where = {};
        if (data.field.startTime != '')
        {
            where.startTime = new Date(data.field.startTime).getTime();
        }
        if (data.field.endTime != '')
        {
            where.endTime = new Date(data.field.endTime).getTime();
        }
        if (data.field.billCode != '')
        {
            where.billCode = data.field.billCode;
        }
        if (data.field.status != '')
        {
            where.status = data.field.status;
        }
        if (data.field.coinId != '')
        {
            where.coinId = data.field.coinId;
        }
        if (data.field.orderByClause != '')
        {
            where.orderByClause = data.field.orderByClause;
        }
        if (data.field.order != '')
        {
            where.order = data.field.order;
        }
        where.userId = localStorage.userId;
        table.reload("userListTable",{
            where:where
        });

        return false;
    });
})