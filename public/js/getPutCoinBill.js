layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    var CoinObject;
    //初始化币种
    function initCoin()
    {
        $.ajax({
            url:config.host + config.getAllCoin,
            type:'GET',
            async:false,
            data:{userId:localStorage.userId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            success:function (result) {
                if (result.code == 0)
                {
                    CoinObject = result.data;
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

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getPutCoinBill,
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
            {field: 'withdrawNumber', title: '账单',  align:'center'},
            {field: 'withdrawType', title: '类型',  align:'center',templet:function (d) {
                    if (d.withdrawType == 1)
                    {
                        return '提币';
                    }else{
                        return '提现';
                    }
                }},
            {field: 'Coin_ENS_Name', title: '币种', align:'center'},
            {field: 'withdrawCostPrice', title: '行情价', align:'center'},
            {field: 'withdrawCostAmount', title: '提取数量',},
            {field: 'withdrawAcquireAmount', title: '提取金额',},
            {field: 'withdrawFeeRate', title: '费率',},
            {title:'withdrawCreateTime',title:'时间',align:'center',templet:function (d) {
                    return getDate(d.withdrawCreateTime);
                }}
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




    function initData(data)
    {
        $('#add_template input[name=userId]').val(localStorage.userId);
        $('#add_template input[name=runId]').val(data.runId);
        $('#add_template input[name=oneRun]').val(data.oneRun);
        $('#add_template input[name=twoRun]').val(data.twoRun);
        $('#add_template input[name=threeRun]').val(data.threeRun);

        if (data.oneRun == 0)
        {
            $('#add_template input[name=oneRun]').attr('disabled',true)
        }

        if (data.twoRun == 0)
        {
            $('#add_template input[name=twoRun]').attr('disabled',true)
        }

        if (data.threeRun == 0)
        {
            $('#add_template input[name=threeRun]').attr('disabled',true)
        }

    }

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
        if (data.field.whoId != '')
        {
            where.whoId = data.field.whoId;
        }

        if (data.field.coinId != '')
        {
            where.coinId = data.field.coinId;
        }

        if (data.field.billNumber != '')
        {
            where.billNumber = data.field.billNumber;
        }

        if (data.field.billType != '')
        {
            where.billType = data.field.billType;
        }

        if (data.field.sort != '')
        {
            where.sort = data.field.sort;
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