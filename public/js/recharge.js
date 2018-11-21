layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    var status = {'-1':'订单',1:'交易中',2:'交易完成',3:'交易失败'};

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.rechargeList,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        cols : [[
            {type:'checkbox'},
            {field: 'memberUserId', title: '用户',  align:'center'},
            {field: 'rechargeNumber', title: '账单编号',  align:'center'},
            {field: 'rechargeAmount', title: '预充金额',  align:'center'},
            {field: 'rechargeCreateTime', title: '账单生成时间', align:'center',templet:function (d) {
                        return getDate(d.rechargeCreateTime)
                }},
            {field: 'rechargePayState', title: '订单状态', align:'center',templet:function (d) {
                    return status[d.rechargePayState];
                }},
            {field: 'rechargeRealityAmount', title: '实充金额', align:'center',},
            {field: 'auditName', title: '审核人', align:'center',},
            {field: 'auditTime', title: '审核时间', align:'center',templet:function (d) {
                    if(d.auditTime != undefined){
                        return getDate(d.auditTime);
                    }else{
                        return ''
                    }
                }},
            {field: 'bankCardNumber', title: '收款卡号', align:'center'},
            {field: 'remark', title: '收款备注', align:'center'},

        ]]
    });

    //实例时间
    laydate.render({
        elem: '#rechargeStartTime', //指定元素
        type:'datetime'
    });
    laydate.render({
        elem: '#rechargeEndTime', //指定元素
        type:'datetime'
    });
    laydate.render({
        elem: '#auditStartTime', //指定元素
        type:'datetime'
    });
    laydate.render({
        elem: '#auditEndTime', //指定元素
        type:'datetime'
    });

    //获取会员
    function getInviter() {
        $.ajax({
            url:config.host + config.memberInviter,
            type:'GET',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {

                if (result.code ==0)
                {
                    var option = '<option value="">全部</option>';
                    $.each(result.data,function (i,v) {
                        if(v.userRealName != null && v.userId != null){
                            option += '<option value="'+v.userId+'">'+v.userRealName+'</option>'
                        }
                    })
                    $('#userId').append(option)
                    form.render();
                }else{
                    alertS(result.message)
                }
            }
        })
    }
    //获取用户
    function getUser() {
        $.ajax({
            url:config.host + config.getUserList,
            type:'GET',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code ==0)
                {
                    var option = '<option value="">全部</option>';
                    $.each(result.data,function (i,v) {
                        if(v.username != null && v.userId != null){
                            option += '<option value="'+v.userId+'">'+v.realname+'</option>'
                        }
                    })
                    $('#auditorId').append(option)
                    form.render();
                }else{
                    alertS(result.message)
                }
            }
        })
    }
    //获取银行卡
    function getCard()
    {
        $.ajax({
            url:config.host + config.bankcard,
            type:'GET',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code ==0)
                {
                    var option = '<option value="">全部</option>';
                    $.each(result.data,function (i,v) {
                        option += '<option value="'+v.id+'">'+v.bankCardNumber+ '('+v.bankBranchName +')</option>'
                    })
                    $('#bankCardId').append(option)
                    form.render();
                }else{
                    alertS(result.message)
                }
            }
        })
    }
    //初始化
    getInviter();
    getUser();
    getCard();


    var active = {
        search:function(){
            //查询
            search();
        },
        audit: function(){
            //审核
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            HandleData(data,1);
        }
    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    function search()
    {
        var where = {};
        if ($('#userId').val() != ''){
            where.userId = $('#userId').val();     //会员
        }

        if ($('#auditorId').val() != ''){
            where.auditorId = $('#auditorId').val();     //用户
        }

        if ($('#bankCardId').val() != ''){
            where.bankCardId = $('#bankCardId').val();     //银行卡
        }

        if ($('#remark').val() != ''){
            where.remark = $('#remark').val();              //备注
        }

        if ($('#status').val() != ''){
            where.status = $('#status').val();              //状态
        }

        if ($('#rechargeStartTime').val() != ''){
            where.rechargeStartTime = new Date($('#rechargeStartTime').val()).getTime();  //账单生成时间
        }

        if ($('#rechargeEndTime').val() != ''){
            where.rechargeEndTime = new Date($('#rechargeEndTime').val()).getTime();  //账单结束时间
        }

        if ($('#auditStartTime').val() != ''){
            where.auditStartTime = new Date($('#auditStartTime').val()).getTime();  //审核开始时间
        }

        if ($('#auditEndTime').val() != ''){
            where.auditEndTime = new Date($('#auditEndTime').val()).getTime();  //审核结束时间
        }

        //开始查询
        table.reload("userListTable",{
            where:where
        })
    }

    function HandleData(data,type) {
        if (data.length>1 || data.length <=0)
        {
            layer.msg('请选中一条数据');
            return false;
        }
        if (data[0].rechargePayState != 1)
        {
            layer.msg('订单状态不允许审核');
            return false;
        }
        $('#add_template input[name=rechargeId]').val(data[0].rechargeId);
        $('#add_template input[name=auditUserId]').val(localStorage.userId);
        $('#add_template input[name=memberUserId]').val(data[0].memberUserId);
        $('#add_template input[name=rechargeAmount]').val(data[0].rechargeRealityAmount);
        form.render();
        index = layui.layer.open({
            title : "审核",
            type : 1,
            content : $('#add_template'),
            area: ['450px', '300px'],
        })
    }

    //提交审核
    form.on('submit(subForm)', function(data){
        $.ajax({
            url:config.host + config.rechargeAffirm,
            type:'POST',
            data:data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {

                if (result.code == 0)
                {
                    tableIns.reload();
                    layui.layer.close(index);
                }else{
                    alertS(result.message)
                }
            }
        });
        return false;
    });

})