layui.use(['form', 'layer', 'table', 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        laydate = layui.laydate;
    var stat = ["启用", "废弃", "完成"]
    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: config.host + config.viewYLBounsBill,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 10,
        limits: [10, 15, 20, 25, 30],
        id: "userListTable",
        where: {
            userId: localStorage.userId
        },
        cols: [[
            // { type: 'checkbox' },
            { field: 'id', title: '序号', align: 'center' },
            { field: 'userId', title: '用户ID', align: 'center' },
            { field: 'month', title: '月份', align: 'center' },
            { field: 'amount', title: '分红金额', align: 'center', },
            { field: 'totalLm', title: '总金额', align: 'center' },
            {
                field: 'created', title: '创建时间', align: 'center', templet: function (d) {
                    if (d.created) {
                        return timestampToTime(d.created - 0)
                    } else {
                        return ""
                    }
                }
            }
        ]]
    });
    //实例时间
    laydate.render({
        elem: '.searchStartTime', //指定元素
        type: 'month'
    });


    function initData(data) {
        console.log(data);
        $('#add_template input[name=id]').val(data.id);
        $('#add_template input[name=bounsLm]').val(data.bounsLm);
        $('#add_template select[name=status]').val(data.status);
        $('#add_template select[name=status]').next().find("input").val(stat[data.status - 1])
    }

    //提交搜索
    form.on('submit(searchForm)', function (data) {
        var where = {};
        where.userId = localStorage.userId-0;
        if (data.field.id != '') {
            where.id = data.field.id;
        }

        if (data.field.time != '') {
            where.time = new Date(data.field.time).getTime();
        }
        console.log(where)
        //开始查询
        table.reload("userListTable", {

            where: where
        })
        $(".searchUserInviter").val("")
        $(".searchStartTime").val("")

        return false;
    });

})