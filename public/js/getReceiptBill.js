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
        url : config.host + config.getReceiptBill,
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
            {field: 'receiptId', title: '收款ID',  align:'center'},
            {field: 'receiptNumber', title: '账号',  align:'center'},
            {field: 'receiptPayNotifyId', title: '交易号',  align:'center'},
            {field: 'receiptPayType', title: '收款类型',  align:'center',templet:function (d) {
                    switch (d.receiptPayType)
                    {
                        case 0:
                            return 'LMP';
                            break;
                        case 1:
                            return '留币';
                            break;
                    }
                }},
            {field: 'coinId', title: '币种',  align:'center',templet:function (d) {
                    var str;
                    $.each(CoinObject,function (i,v) {
                        if (v.coinId == d.coinId)
                        {
                            str = v.coinName;
                            return true;
                        }
                    })
                    return str;
                }},
            {field: 'receiptPayState', title: '状态',  align:'center',templet:function (d) {
                    switch (d.receiptPayState)
                    {
                        case -1:
                            return '未处理';
                            break;
                        case 1:
                            return '交易中';
                            break;
                        case 2:
                            return '交易完成';
                            break;
                        case 3:
                            return '交易过期';
                            break;
                    }
                }},
            {field: 'receiptPrice', title: '代币价格',  align:'center'},
            {field: 'receiptAmount', title: '代币数量',  align:'center'},
            {field: 'receiptRealityAmount', title: '实付数量',  align:'center',},
            {field: 'receiptOrderExpirationTime', title: '过期', align:'center',templet:function (d) {
                    if (d.receiptOrderExpirationTime == -1)
                    {
                        return '未过期';
                    }else{
                        return getDate(d.receiptOrderExpirationTime);
                    }
                }},
            {field: 'receiptCreateTime', title: '创建时间', align:'center',templet:function (d) {
                    return getDate(d.receiptCreateTime);
                }},
        ]]
    });
    
    //点击编辑
    $('#edit_btn').click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data;

        if (data.length <=0 || data.length >1)
        {
            layer.msg('请选中一条数据');
            return false;
        }
		if(data[0].receiptPayState != 3){
			layer.msg('请选中过期数据');
            return false;
		}
        showEditR(data[0])
    })
    
    //显示编辑页
    function showEditR(data)
    {
        //显示数据
        initDataR(data);
        index = layui.layer.open({
            title : "修改",
            type : 1,
            content : $('#edit_template'),
            area: ['500px', '380px'],
        })
    }
	
	function initDataR(data)
    {
        console.log(data);
        $('#edit_template input[name=userId]').val(data.userId);
        $('#edit_template input[name=receiptId]').val(data.receiptId);
        $('#edit_template input[name=receiptPayNotifyId]').val(data.receiptPayNotifyId);
        $('#edit_template input[name=coinId]').val(data.coinId);
        $('#edit_template input[name=receiptPrice]').val(data.receiptPrice);
        $('#edit_template input[name=receiptAmount]').val(data.receiptAmount);
        $('#edit_template select[name=receiptPayState]').val(data.receiptPayState);
    	form.render();
    }
    
    //提交修改
    form.on('submit(updateReceipt)', function(data){
    	if(data.field.receiptPayNotifyId == null || data.field.receiptPayNotifyId == ""){
    		layer.msg('交易号不能为空');
    		return false;
    	}
        $.ajax({
            url:config.host + config.transaction,
            type:'POST',
            data:{"userId":data.field.userId,"receiptId":data.field.receiptId,"txId":data.field.receiptPayNotifyId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                alertS(result.memssage);
                if (result.code == 0)
                {
                    tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });

    laydate.render({
        elem: '#startTime', //指定元素
        type: 'datetime'
    });
    laydate.render({
        elem: '#endTime', //指定元素
        type: 'datetime'
    });

    //列表操作
    table.on('tool(userList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            showEdit(data);
        }
    });

    //显示编辑页
    function showEdit(data)
    {
        //显示数据
        initData(data);
        index = layui.layer.open({
            title : "修改",
            type : 1,
            content : $('#add_template'),
            area: ['500px', '480px'],
        })
    }

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
        if (data.field.receiptNumber != '')
        {
            where.receiptNumber = data.field.receiptNumber;
        }
        if (data.field.receiptPayNotifyId != '')
        {
            where.receiptPayNotifyId = data.field.receiptPayNotifyId;
        }
        if (data.field.receiptPayState != '')
        {
            where.receiptPayState = data.field.receiptPayState;
        }
        if (data.field.coinId != '')
        {
            where.coinId = data.field.coinId;
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