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
        url : config.host + config.getBuySellBill,
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
            {field: 'userId', title: '用户ID',  align:'center'},
            {field: 'tkcId', title: '交易代币',  align:'center',templet:function (d) {
                    var str;
                    $.each(CoinObject,function (i,v) {
                        if (v.coinId == d.tkcId)
                        {
                            str = v.coinName;
                            return true;
                        }
                    })
                    return str;
                }},
            {field: 'stcId', title: '结算代币',  align:'center',templet:function (d) {
                    var str;
                    $.each(CoinObject,function (i,v) {
                        if (v.coinId == d.stcId)
                        {
                            str = v.coinName;
                            return true;
                        }
                    })
                    return str;
                }},
            {field: 'billNumber', title: '账单ID', align:'center'},
            {field: 'billType', title: '类型', align:'center',templet:function (d) {
                    if (d.billType == 1)
                    {
                        return '买单';
                    }else if (d.billType == -1){
                        return '卖单';
                    }
                }},
            {field: 'billUnitPrice', title: '行情价'},
            {field: 'billTotalVolume', title: '获得数量'},
            {field: 'billAvailableVal', title: '买卖数量'},
            {field: 'billBuyerFeeRate', title: '手续费率'},
            {field: 'billCreateTime', title: '创建时间',templet:function (d) {
                    return getDate(d.billCreateTime);
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