layui.use(['form', 'layer', 'table', 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        laydate = layui.laydate;
    var stat = ["启用","废弃","完成"]
    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: config.host + config.viewYLBounsList,
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
            { type: 'checkbox' },
            { field: 'id', title: '序号', align: 'center' },
            { field: 'month', title: '月份', align: 'center', },
            { field: 'bounsLm', title: '总金额', align: 'center' },
            {
                field: 'status', title: '状态', align: 'center', templet: function (d) {
                    return '<span class="layui-badge layui-bg-blue">'+stat[d.status-1]+'</span>'
                }},
            { field: 'auditorId', title: '审核人ID', align: 'center' },

            {
                field: 'created', title: '创建时间', align:'center',templet:function (d) {
                    if (d.created) {
                        return timestampToTime(d.created - 0)
                    } else {
                        return ""
                    }
            }
            },
            {
                field: 'updated', title: '修改时间', align: 'center', templet: function (d) {
                    if (d.updated) {
                        return timestampToTime(d.updated - 0)
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
    laydate.render({
        elem: '.searchTime', //指定元素
        type: 'month'
    });
    //点击编辑
    $('#edit_btn').click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data;
       
        if (data.length <= 0 || data.length > 1) {
            layer.msg('请选中一条数据');
            return false;
        }
        if (data[0].status == 3) {
            layer.msg('分红已完成');
            return false;
        }
        if (data[0].status == 2) {
            layer.msg('分红已废弃');
            return false;
        }
        showEdit(data[0])
    })

    //显示编辑页
    function showEdit(data) {
        //显示数据
        initData(data);
        index = layui.layer.open({
            title: "修改",
            type: 1,
            content: $('#add_template'),
            area: ['650px', '520px'],
        })
    }

    //提交编辑
    form.on('submit(updateForm)', function (data) {
        data.field.userId = localStorage.userId
        $.ajax({
            url: config.host + config.updateYLBouns,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });


    function initData(data) {
        console.log(data);
        $('#add_template input[name=id]').val(data.id);
        $('#add_template input[name=bounsLm]').val(data.bounsLm);
        $('#add_template select[name=status]').val(data.status);
        $('#add_template select[name=status]').next().find("input").val(stat[data.status-1])
    }

    //提交搜索
    form.on('submit(searchForm)', function (data) {
        var where = {};
        where.userId = localStorage.userId;
        if (data.field.auditorId != '') {
            where.auditorId = data.field.auditorId;
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
    //新增分红
    form.on('submit(addBank)', function (data) {
        data.field.userId = localStorage.userId;
        $.ajax({
            url: config.host + config.createYLBouns,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index1);
                }
            }
        });
        return false;
    });
    //一键分红
    form.on('submit(addoneBank)', function (data) {
        data.field.userId = localStorage.userId;
        data.field.time = new Date(data.field.time).getTime();
        $.ajax({
            url: config.host + config.oneKeyYLBouns,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index2);
                }
            }
        });
        return false;
    });
    var index1, index2;
    function addBank(edit) {
        index1 = layui.layer.open({
            title: "创建分红",
            type: 1,
            content: $('#add_template1'),
            area: ['500px', '300px'],
        })

    }
    function addoneBank(edit) {
        index2 = layui.layer.open({
            title: "一键分红",
            type: 1,
            content: $('#add_template2'),
            area: ['500px', '300px'],
        })

    }
    $(".add_btn").click(function () {
        addBank();
    })
    $(".add_one").click(function () {
        addoneBank();
    })
})