layui.use(['form', 'layer', 'table', 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;
    console.log(1)
    //列表
    var tableIns = table.render({
        id:"coinId",
        elem: '#userList',
        url: config.host + config.viewFeesList,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 20,
        limits: [10, 15, 20, 25, 30],
        id: "userListTable",
        where: {
            userId: localStorage.userId
        },
        cols: [[
            // { type: 'checkbox' },
            { field: 'billId', title: '序号', align: 'center',width:80 },
            {
                field: 'userId', title: '用户ID', align: 'center', templet: function (d) {
                    if (d.userId == 1) {
                        return "公司"
                    } else {
                        return d.userId
                    }
                }
            },
            { field: 'coinId', title: '币种ID', align: 'center'},
            { field: 'coinName', title: '币种英文简称', align: 'center', width: 120 },
            { field: 'billCode', title: '流水号', align: 'center', minWidth:"180" },
            {
                field: 'status', title: '类型', align: 'center', width: 120,templet: function (d) {
                    switch (d.status) {
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
                }
            },
            { field: 'feesScale', title: '费率', align: 'center', },
            { field: 'feesNumber', title: '手续费', align: 'center' },
            { field: 'consumerFees', title: '总手续费', align: 'center' },
            { field: 'consumerId', title: '消费者', align: 'center' },

            {
                field: 'created', title: '创建时间', align: 'center', minWidth: "180",templet: function (d) {
                    return timestampToTime(d.created);
                }
            },
        ]],
        done: function () {
            $("[data-field='coinId']").css('display', 'none');
        }
    });

    laydate.render({
        elem: '#startTime', //指定元素
        type: 'datetime'
    });
    laydate.render({
        elem: '#endTime', //指定元素
        type: 'datetime'
    });


    var index
    $(".add_btn").on("click", function () {
        getFeesRun();
         index = layui.layer.open({
            title: "手续费费例",
            type: 1,
            content: $('#add_template'),
            area: ['450px', '400px'],
        })
    })
    $("#add_template .sure").on("click", function () {
        layui.layer.close(index);
    })
    //提交修改
    form.on('submit(subForm)', function (data) {
        data.field.userId = localStorage.userId;
        delete data.field.created;
        console.log(data.field)
        $.ajax({
            url: config.host + config.updateFeesRun,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {

                if (result.code == 0) {
                    alertS(result.message)
                    tableIns.reload();
                    layui.layer.close(index);
                } else {
                    alertS(result.message)
                }
            }
        });
        return false;
    });
    //获取手续费费例
    function getFeesRun() {
        $.ajax({
            url: config.host + config.getFeesRun,
            type: 'GET',
            data: { userId: localStorage.userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            success: function (result) {
                if (result.code == 0) {
                    $('#add_template input[name=id]').val(result.data.runId);
                    $('#add_template input[name=oneRun]').val(result.data.oneRun);
                    $('#add_template input[name=twoRun]').val(result.data.twoRun);
                    let time = timestampToTime(result.data.created-0)
                    $('#add_template input[name=created]').val(time);
                } else {
                    alertS(result.message)
                }
            }
        })
    }

    //初始化币种
    function initCoin() {
        $.ajax({
            url: config.host + config.getAllCoin,
            type: 'GET',
            data: { userId: localStorage.userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            success: function (result) {
                if (result.code == 0) {
                    var option = '<option value="">全部</option>';
                    $.each(result.data, function (i, v) {
                        option += '<option value="' + v.coinId + '">' + v.coinName + '</option>'
                    })
                    $('#coinId').empty().append(option);
                    form.render('select');
                } else {
                    alertS(result.message)
                }
            }
        })
    }
    initCoin();



    //提交表单
    form.on('submit(searchForm)', function (data) {
        console.log(2)
        var where = {};
        if (data.field.startTime != '') {
            where.startTime = new Date(data.field.startTime).getTime();
        }
        if (data.field.endTime != '') {
            where.endTime = new Date(data.field.endTime).getTime();
        }
        if (data.field.billCode != '') {
            where.billCode = data.field.billCode;
        }
        if (data.field.status != '') {
            where.status = data.field.status;
        }
        if (data.field.coinId != '') {
            where.coinId = data.field.coinId;
        }
        if (data.field.orderByClause != '') {
            where.orderByClause = data.field.orderByClause;
        }
        if (data.field.order != '') {
            where.order = data.field.order;
        }
        where.userId = localStorage.userId;
        console.log(where)
        $('.layui-form input[name=startTime]').val("");
        $('.layui-form input[name=endTime]').val("");
        $('.layui-form input[name=billCode]').val("");

        table.reload("userListTable", {
            where: where
        });
      

        return false;
    });
})