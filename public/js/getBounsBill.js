layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: config.host + config.getBounsBill,
        cellMinWidth: 95,
        page: true,
        height: "full-341",
        limit: 10,
        limits: [10, 15, 20, 25, 30],
        id: "userListTable",
        where: {
            userId: localStorage.userId
        },
        cols: [[
            { field: 'id', title: '排序', align: 'center'},
            { field: 'userId', title: '用户ID', align: 'center'},
            { field: 'totalLm', title: '总金额', align: 'center'},
            { field: 'totalFictitiousLm', title: '可分总金额', align: 'center'},
            { field: 'amount', title: '可分金额', align: 'center', },
            { field: 'amountActual', title: '实际分得金额', align: 'center' },
            {field: 'created', title: '创建时间', align:'center',templet:function (d) {
                    return timestampToTime(d.created-0);
            }},
        ]]
    });



    //提交搜索
    form.on('submit(searchForm)', function (data) {
        var where = {};
        where.userId = localStorage.userId;
        if (data.field.userId == '') {
          
        }else {
            where.id = data.field.userId;

        }
        //开始查询
        var tableIns2 = table.render({
            elem: '#userList',
            url: config.host + config.getBounsBill,
            cellMinWidth: 95,
            page: true,
            height: "full-341",
            limit: 10,
            limits: [10, 15, 20, 25, 30],
            id: "userListTable",
            where:where
            ,
            cols: [[
                { field: 'id', title: '排序', align: 'center'},
                { field: 'userId', title: '用户ID', align: 'center'},
                { field: 'totalLm', title: '总金额', align: 'center'},
                { field: 'totalFictitiousLm', title: '可分总金额', align: 'center'},
                { field: 'amount', title: '可分金额', align: 'center', },
                { field: 'amountActual', title: '实际分得金额', align: 'center' },
                {field: 'created', title: '创建时间', align:'center',templet:function (d) {
                        return timestampToTime(d.created-0);
                }},
            ]]
        });




        $(".searchUserInviter").val("")
        return false;
    });
   


})