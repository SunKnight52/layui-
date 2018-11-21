layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    var thatOne = ['启用', '冻结', '废弃', '完成'];
    var ischeck = ['否', '是']
    var nub = window.localStorage.userId;
    var data1 = {
        'userId': nub,
        'page': 1,
        'limit': 10000
    }

    var tableIns, list;
    //请求列表数据

    function getList() {
        $.ajax({
            url: config.host + config.listBouns,
            type: 'GET',
            data: data1,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                list = result.data.tokenBounsSettings
                console.log(list)
                $("#nub1").text(result.data.activation + "人")
                tableIns = table.render({
                    elem: '#listBouns',
                    // url : config.host + config.listBouns,
                    data: list,
                    cellMinWidth: 95,
                    page: true,
                    height: "full-125",
                    limit: 20,
                    limits: [10, 15, 20, 25, 30],
                    id: "listBounsTable",
                    where: {
                        userId: localStorage.userId
                    },
                    cols: [[
                        { type: 'checkbox' },
                        { field: 'id', title: '分红ID', align: 'center' },
                        { field: 'month', title: '月份', align: 'center' },
                        { field: 'bounsLm', title: '持机分红', align: 'center' },
                        { field: 'bounsDistributable', title: '可分红', align: 'center' },
                        { field: 'bounsFictitiousNumber', title: '虚拟激活人数', align: 'center' },
                        {field: 'isCheck', title: '检测推销', align: 'center', templet: function (d) {
                                console.log(d)
                                return ischeck[d.isCheck - 1]
                            }
                        },
                        {
                            field: 'status', title: '状态', align: 'center', templet: function (d) {
                                console.log(d)
                                return thatOne[d.status - 1]
                            }
                        },
                        { field: 'auditorId', title: '审核人ID', align: 'center' },
                        {
                            field: 'created', title: '创建时间', align: 'center', templet: function (d) {
                                return timestampToTime(d.created - 0)
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
                        },
                    ]]
                });
            }
        });
    }


    //加载列表
    getList();





    var active = {
        add: function () { //添加

            showAdd()
        },
        edit: function () {
            //新增
            var checkStatus = table.checkStatus('listBounsTable')
                , data = checkStatus.data;
            if (data.length > 1 || data.length <= 0) {
                alertS('请选中一条数据');
                return false;
            }
            showEdit(data[0]);
        },
        auto: function () {
            oneAdd()
        }

    };

    //点击操作
    $('#btn_list .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $('#updated_list .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    $('#auto_list .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //列表操作
    table.on('tool(listBouns)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            showEdit(data);
        }
        // }else if(layEvent === 'add'){
        //     showAdd(data)
        // }
    });

    //显示编辑页
    function showEdit(data) {
        //判断是否订单完成
        console.log(data)
        if (data.status == 4) {
            alertS("本月分红已完成")
            return false
        } else {
            //显示数据
            initData(data);
            index = layui.layer.open({
                title: "修改",
                type: 1,
                content: $('#updated_template'),
                area: ['500px', '550px'],
            })
        }

        //  layui.layer.full(index);
        //     $(window).on("resize",function(){
        //         layui.layer.full(index);
        // })
    }
    //显示创建页
    function showAdd(data) {


        index = layui.layer.open({
            title: "创建",
            type: 1,
            content: $('#add_template'),
            area: ['500px', '500px'],
        })

    }

    function initData(data) {
        $('#updated_template input[name=userId]').val(localStorage.userId);
        $('#updated_template input[name=id]').val(data.id);
        $('#updated_template input[name=bounsLm]').val(data.bounsLm);
        $('#updated_template #updatedstatus1').val(data.isCheck);
        $('#updated_template input[name=bounsDistributable]').val(data.bounsDistributable);
        $('#updated_template input[name=bounsFictitiousNumber]').val(data.bounsFictitiousNumber);
        $('#updated_template #updatedstatus').val(data.status);
        $('#updated_template .layui-unselect').val(thatOne[data.status - 1])
        $('#updated_template .sad input').val(ischeck[data.status - 1])
    }

    //提交新增表单
    form.on('submit(addFees)', function (data) {
        data.field.userId = localStorage.userId;
        console.log(data.field)
        $.ajax({
            url: config.host + config.createBouns,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                // if (result.code == 0)
                // {
                getList();
                // tableIns.reload();
                layui.layer.close(index);
                // }else if(result.code==1){

                // }
            }
        });
        return false;
    });
    //提交修改表单
    form.on('submit(updateFees)', function (data) {

        $.ajax({
            url: config.host + config.updateBouns,
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
                    getList();
                    // tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });
    //一键分红
    function oneAdd(data) {
        index = layui.layer.open({
            title: "创建",
            type: 1,
            content: $('#oneKey_template'),
            area: ['500px', '500px'],
        })

    }
    form.on('submit(oneKeyFees)', function (data) {
        data.field.userId = localStorage.userId;
        console.log(data.field)
        $.ajax({
            url: config.host + config.oneKeyBouns,
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
                    getList();
                    // tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });
})