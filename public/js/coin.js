var index,tableIns;
layui.use(['form','layer','table'],function(){
	var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    var coinType = {1:'平台币',2:'交易货币'};
    var coinStateCode = {1:'启用',2:'禁用'}
	//coin列表
    tableIns = table.render({
        elem: '#coinList',
        url : config.host + config.getAllCoins,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "coinList",
        where:{
            userId:localStorage.getItem("userId"),
        },
        cols : [[
            {type:'checkbox'},
            {field: 'coinId', title: 'ID',  align:'center',width:100},
            {field: 'coinCnfName', title: '中文全名',  align:'center',},
            {field: 'coinCnsName', title: '中文简称', align:'center',},
            {field: 'coinEnfName', title: '英文全名', align:'center',},
            {field: 'coinEnsName', title: '英文简称', align:'center',},
            {field: 'coinLogo', title: 'logo', align:'center',templet:function(d){
            	return '<img src="' + d.coinLogo +'" width="20%"/>';
            }},
            {field: 'coinType', title: '币种类型', align:'center',templet:function(d){
            	return coinType[d.coinType];
            }},
            {field: 'coinStateCode', title: '币种状态', align:'center',templet:function(d){
            	return coinStateCode[d.coinStateCode];
            }},
            {field: 'coinCreateTime', title: '创建时间', align:'center',templet:function (d) {
                console.log(d.coinCreateTime)
                return timestampToTime(d.coinCreateTime);
            }},
        ]]
    });

    var active = {
        add: function(){ //添加
            initForm();
            addNews();
        }
        ,edit: function(){ //编辑
            var checkStatus = table.checkStatus('coinList')
                ,data = checkStatus.data;
            HandleData(data,1);
        }
        ,disable: function(){ //禁用
            var checkStatus = table.checkStatus('coinList')
                ,data = checkStatus.data;
            HandleData(data,2);
        },
        enable: function(){ //启用
            var checkStatus = table.checkStatus('coinList')
                ,data = checkStatus.data;
            HandleData(data,3);
        }
    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    function HandleData(data,type)
    {
        if (data.length >1 || data.length<=0)
        {
            layer.msg('请选中一条数据');
            return false;
        }

        if (type == 1){
            //编辑
            initEditForm(data[0])
            addNews();
        }else if (type == 2)
        {
            updateStatus(localStorage.getItem("userId"),data[0].coinId,2)  //禁用
        }else if (type ==3)
        {
            updateStatus(localStorage.getItem("userId"),data[0].coinId,1)  //启用
        }
    }

    //coin模糊查询
	$(".search_btn").on("click",function(){
        var where = {};
        where.search = $('.layui-input').val();
        where.userId = localStorage.getItem("userId");
        table.reload("coinList",{
            where:where
        })
    });

    function addNews(){
         index = layui.layer.open({
            title : "用户操作",
            type : 1,
            content : $('#add_template'),
            area: ['680px', '800px'],
        })
       layui.layer.full(index);
	        $(window).on("resize",function(){
	            layui.layer.full(index);
        })
    }
    
    //coin提交表单
    form.on('submit(subForm)', function(data){



        $('#userid').val(localStorage.getItem("userId"));
        if (isUpdate === true){
            send(config.updateCoinInfo);
        }else{
            //编辑时才判断是否上传图片
            if (data.field.logoImage == ''){
                layer.msg('LOGO图片不能为空')
                return false;
            }
            send(config.addCoin);
        }
        return false;
    });

    var isUpdate = false;

    //初始化编辑表单
    function initEditForm(data)
    {
        isUpdate = true;
        $('.coinId').show();
        $('#add_template input[name=coinCnfName]').attr('disabled',true);
        $('#add_template input[name=coinCnsName]').attr('disabled',true);
        $('#add_template input[name=coinEnfName]').attr('disabled',true);
        $('#add_template input[name=coinEnsName]').attr('disabled',true);
        $('#add_template select[name=coinType]').attr('disabled',true);
        $('#add_template input[name=logoImage]').attr('disabled',true);
        $('#add_template .b2bFees1').hide();
        $('#add_template .b2bFees2').hide();
        $('#add_template .reset').hide();

        $('#add_template input[name=coinId]').val(data.coinId);
        $('#add_template input[name=coinCnfName]').val(data.coinCnfName);
        $('#add_template input[name=coinCnsName]').val(data.coinCnsName);
        $('#add_template input[name=coinEnfName]').val(data.coinEnfName);
        $('#add_template input[name=coinEnsName]').val(data.coinEnsName);
        $('#add_template select[name=coinType]').val(data.coinType);
        $('#add_template input[name=logoImage]').val(data.logoImage);
        $('#add_template input[name=coinZb]').val(data.coinZb);
        $('#add_template input[name=coinUrl]').val(data.coinUrl);

        $('#add_template input[name=b2bFees1]').val('0');  //编辑时设置默认值，防止为空
        $('#add_template input[name=b2bFees2]').val('0');  //编辑时设置默认值，防止为空
        $('#add_template input[name=coinStateCode][value='+data.coinStateCode+']').prop("checked", "checked");
        form.render();
    }
    //初始化表单
    function initForm()
    {
        isUpdate = false;
        $('.coinId').hide();
        $('#add_template input[name=coinCnfName]').attr('disabled',false);
        $('#add_template input[name=coinCnsName]').attr('disabled',false);
        $('#add_template input[name=coinEnfName]').attr('disabled',false);
        $('#add_template input[name=coinEnsName]').attr('disabled',false);
        $('#add_template select[name=coinType]').attr('disabled',false);
        $('#add_template input[name=logoImage]').attr('disabled',false);
        $('#add_template .b2bFees1').show();
        $('#add_template .b2bFees2').show();
        $('#add_template .reset').show();
        $('#add_template form')[0].reset();

    }




    
    //coin修改币种状态
    function updateStatus(userId,coinId,status) {
        $.ajax({
            url:config.host + config.updateCoinStatu,
            type:'POST',
            data:{userId:userId,coinId:coinId,coinStateCode:status},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                alertS(result.message)
                if (result.code == 0)
                {
                    tableIns.reload();
                }
            }
        })
    }
    
    //coinFees列表
    var tableIns1 = table.render({
        elem: '#coinFeesList',
        url : config.host + config.getAllCoinFees,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "coinFeesList",
        where:{
            userId:localStorage.getItem("userId"),
        },
        cols : [[
            {type:'checkbox'},
            {field: 'areaId', title: 'ID',  align:'center',width:100},
            {field: 'settlementCoin', title: '结算代币',  align:'center',},
            {field: 'transactionCoin', title: '交易代币', align:'center',},
            {field: 'b2bFees', title: '费率', align:'center',},
            {field: 'created', title: '创建时间', align:'center',templet:function (d) {
                console.log(d.created)
                return timestampToTime(d.created);
            }},
        ]]
    });
    
    //编辑coinFees信息
    function coinFess(data) {
       console.log(data)
       $('.areaId').show();
       $('#add1_template input[name=areaId]').val(data.areaId);
       $('#add1_template input[name=settlementCoin]').val(data.settlementCoin);
       $('#add1_template input[name=transactionCoin]').val(data.transactionCoin);
       $('#add1_template input[name=b2bFees]').val(data.b2bFees);
       form.render();
       isUpdate= true;
    }
    
    $('.edit_btn').click(function () {
        var checkStatus = table.checkStatus('coinFeesList'),
            data = checkStatus.data;

        if (data.length <=0 || data.length >1)
        {
            layer.msg('请选中一条数据');
            return false;
        }

        coinFess(data[0]);
        addNewsTemplate(data[0]);
    })
    
    
    //coinFees列表操作
    table.on('tool(coinFeesList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            coinFess(data);
            addNewsTemplate(data);
        }
    });
    
    function addNewsTemplate(edit){
         index = layui.layer.open({
            title : "用户操作",
            type : 1,
            content : $('#add1_template'),
            area: ['500px', '380px'],
            success : function(layero, index){
                if(edit){

                }else{
                    $('.userId').hide();
                }
            }
        })
    }
    
    //coinFees提交表单
    form.on('submit(subForm1)', function(data){
        var url = config.host + config.updateCoinFees;
        $.ajax({
            url:url,
            type:'POST',
            data:{userId:localStorage.getItem("userId"), areaId:data.field.areaId, coinFees:data.field.b2bFees},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                alertS(result.message)
                if (result.code == 0)
                {
                	tableIns1.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });
})

function send(url) {
    $('#abc').attr('action',config.host + url);  //设置POST地址
    $('#abc').ajaxSubmit({
        beforeSend:function (xhr) {
            xhr.withCredentials = true;
        },
        success:function (result) {
            layer.msg(result.message);
            if (result.code == 0)
            {
                layui.layer.close(index);
                tableIns.reload();
            }else{
                alertS(result.message)
            }
        }
    })
}

