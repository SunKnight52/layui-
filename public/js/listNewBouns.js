layui.use(['form', 'layer', 'table', 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    laydate = layui.laydate;
    var thatOne = ['启用', '禁用', '废弃', '完成'];
    var ischeck = ['否', '是']
    var nub = window.localStorage.userId;
    var data1 = {
        'userId': nub,
        'page': 1,
        'limit': 10000
    }
    var bouns = ['总金额分配费率', '会员分红费率', '合伙人分红费率']
    var bouns1 = ['修改总金额分配费率', '修改会员分红费率', '修改合伙人分红费率']
    var index2,index3
    //请求列表数据
    var tableIns, list;
    //请求列表数据

    function getList() {
        console.log(2)
        $.ajax({
            url: config.host + config.listNewBouns,
            type: 'GET',
            data: data1,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                list = result.data.list;
                let gon = result.data.gong;
                let chu = result.data.chuang;
                let hui = result.data.hui;
                let he = result.data.he;
                $(".mennumber").text("会员" + hui + "人/创客" + chu + "人/合伙人" + he + "人/共" + gon + "人");
                console.log(list)
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
                        { field: 'id', title: 'ID', align: 'center' },
                        { field: 'month', title: '月份', align: 'center' },
                        { field: 'totalLm', title: '总金额', align: 'center' },
                        { field: 'oneTotal', title: '会员金额', align: 'center' },
                        { field: 'threeTotal', title: '合伙人金额', align: 'center' },
                        { field: 'number', title: '虚拟人数', align: 'center' },
                        {
                            field: 'status', title: '状态', align: 'center', templet: function (d) {
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
                        }
                    ]]
                });
            }
        });
    }


    //加载列表
    getList();
    console.log(1)

    var active = {
        add: function () { //添加

            showAdd()
        },
        edit: function () {
            //修改
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
    var one = [
        "会员分红费率  :  ",
        "合伙人分红费率  :  ",
        "总费率  :  ",
        "创建时间  :  "
    ]
    var two = [
        "非活跃分红费率  :  ",
        "活跃分红费率增  :  ",
        "总费率  :  ",
        "创建时间  :  "
    ]
    var three = [
        "非活跃费率  :  ",
        "推会活跃费率增  :  ",
        "推合活跃费率增  :  ",
        "总费率  :  ",
        "创建时间  :  "
    ]
    var bounslist = {}
    function modify(e) {
         index2 = layui.layer.open({
            title: bouns[e - 1],
            type: 1,
            content: $('#bouns_template'),
            area: ['500px', '500px'],
        })
        $.ajax({
            url: config.host + config.getNewRate,
            type: 'GET',
            data: { userId: localStorage.userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                let da = "";
                bounslist = result.data[e - 1]
                switch (e) {
                    case "1":
                        console.log(1)
                        da = da + "<p>" + one[0] + result.data[e - 1].one + "</p>";
                        da = da + "<p>" + one[1] + result.data[e - 1].three + "</p>";
                        da = da + "<p>" + one[2] + result.data[e - 1].total + "</p>";
                        let nub = timestampToTime(result.data[e - 1].created - 0)
                        da = da + "<p>" + one[3] + nub + "</p>";
                        $("#bouns_template .bouns").html(da);
                        break;
                    case "2":
                        console.log(2)

                        da = da + "<p>" + two[0] + result.data[e - 1].one + "</p>";
                        da = da + "<p>" + two[1] + result.data[e - 1].two + "</p>";
                        da = da + "<p>" + two[2] + result.data[e - 1].total + "</p>";
                        let nub1 = timestampToTime(result.data[e - 1].created - 0)
                        da = da + "<p>" + two[3] + nub1 + "</p>";
                        console.log(da)
                        console.log($("#bouns_template .bouns"))
                        $("#bouns_template .bouns").html(da);
                        break;
                    case "3":
                        console.log(3)

                        da = da + "<p>" + three[0] + result.data[e - 1].one + "</p>";
                        da = da + "<p>" + three[1] + result.data[e - 1].two + "</p>";
                        da = da + "<p>" + three[2] + result.data[e - 1].three + "</p>";
                        da = da + "<p>" + three[3] + result.data[e - 1].total + "</p>";
                        let nub2 = timestampToTime(result.data[e - 1].created - 0)
                        da = da + "<p>" + three[4] + nub2 + "</p>";
                        $("#bouns_template .bouns").html(da);
                        break;
                }

            }
        });
    }


    function updateNewRate(e) {
        console.log(e)
        $("#updateNewRate_template input[name=id]").val(e.id);
        switch (e.type) {
            case 1:
                $("#updateNewRate_template input[name=one]").val(e.one);
                $("#updateNewRate_template input[name=two]").val(e.two);
                $("#updateNewRate_template span[name=one]").text(one[0]);
                $("#updateNewRate_template input[name=two]").parent().parent().css("display", "none")
                $("#updateNewRate_template input[name=one]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=three]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=three]").val(e.three);
                $("#updateNewRate_template span[name=three]").text(one[1]);
                break;
            case 2:
                $("#updateNewRate_template input[name=one]").val(e.one);
                $("#updateNewRate_template span[name=one]").text(two[0]);
                $("#updateNewRate_template input[name=three]").val(e.three);
                $("#updateNewRate_template input[name=two]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=one]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=three]").parent().parent().css("display", "none")
                $("#updateNewRate_template input[name=two]").val(e.two);
                $("#updateNewRate_template span[name=two]").text(two[1]);
                break;
            case 3:
                $("#updateNewRate_template input[name=one]").val(e.one);
                $("#updateNewRate_template span[name=one]").text(three[0]);
                $("#updateNewRate_template input[name=two]").val(e.two);
                $("#updateNewRate_template input[name=two]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=one]").parent().parent().css("display", "block")
                $("#updateNewRate_template input[name=three]").parent().parent().css("display", "block")
                $("#updateNewRate_template span[name=two]").text(three[1]);
                $("#updateNewRate_template input[name=three]").val(e.three);
                $("#updateNewRate_template span[name=three]").text(three[2]);
                break;
        }




         index3 = layui.layer.open({
            title: bouns1[e.type - 1],
            type: 1,
            content: $('#updateNewRate_template'),
            area: ['500px', '500px'],
        })
    }



















    $(".sure").on("click", function () {
        layui.layer.close(index2);
    })
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
    $('.modify').on('click', function () {
        let a = $(this).attr("name");

        modify(a)
    });
    $('.up').on('click', function () {


        updateNewRate(bounslist)
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
    }
    //显示创建页
    function showAdd(data) {


        index = layui.layer.open({
            title: "创建",
            type: 1,
            content: $('#add_template'),
            area: ['500px', '400px'],
        })

    }

    function initData(data) {

        $('#updated_template input[name=id]').val(data.id);
        $('#updated_template input[name=totalLM]').val(data.totalLm);
        $('#updated_template input[name=number]').val(data.number);
        $('#updated_template #updatedstatus').val(data.status);
        $('#updated_template .layui-unselect').val(thatOne[data.status - 1])
    }

    //提交新增表单
    form.on('submit(addFees)', function (data) {
        data.field.userId = localStorage.userId;
        console.log(data.field)
        $.ajax({
            url: config.host + config.createNewBouns,
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
        data.field.userId = localStorage.userId;
        $.ajax({
            url: config.host + config.updateNewBouns,
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
    laydate.render({
        elem: '#date',
        type: 'month'
    });
    form.on('submit(oneKeyFees)', function (data) {
        data.field.userId = localStorage.userId;
        let a = data.field.time;
        data.field.time = new Date(a).getTime();
        $.ajax({
            url: config.host + config.oneKeyNewBouns,
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
     form.on('submit(updateNewRate)', function (data) {
        data.field.userId = localStorage.userId;
          
        $.ajax({
            url: config.host + config.updateNewRate,
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
                    layui.layer.close(index2);
                    layui.layer.close(index3);

                }
            }
        });
        return false;
    });
})