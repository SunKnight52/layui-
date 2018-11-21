layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.companyAgentBills,
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
            {field: 'userId', title: '用户',  align:'center',templet:function (d) {
                if (d.userId == 1)
                {
                    return '公司';
                }else{
                    return d.userId;
                }
            }},
            {field: 'agentId', title: '代理列表ID',  align:'center'},
            {field: 'whoId', title: '消费者', align:'center',templet:function (d) {
                if(d.whoId == 0)
                {
                    return '购机';
                }else{
                    return d.whoId;
                }
            }},
            {field: 'runLmp', title: '分润积分', align:'center'},
            {field: 'runFees', title: '分润比例', align:'center'},
            {field: 'created', title: '时间', align:'center',templet:function (d) {
                console.log(d)    
                return timestampToTime(d.created)
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


    //搜索
    form.on('submit(searchForm)',function (data) {
        var where = {};
        where.userId = localStorage.userId;
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
        if (data.field.orderByClause != '')
        {
            where.orderByClause = data.field.orderByClause;
        }
        if (data.field.order != '')
        {
            where.order = data.field.order;
        }
        console.log(where)
        table.reload("userListTable",{

            where:where
        })
        return false;
    })


    //升级总监
    $('#levelUp').click(function () {
        // var checkStatus = table.checkStatus('userListTable'),
        //     data = checkStatus.data;
        //
        // if (data.length <=0 || data.length >1)
        // {
        //     layer.msg('请选中一条数据');
        //     return false;
        // }
        $('#add_template input[name=userId]').val(localStorage.userId);
        // $('#add_template input[name=whoId]').val(data[0].whoId);
        index = layui.layer.open({
            title : "升级总监",
            type : 1,
            content : $('#add_template'),
            area: ['500px', '380px'],
        })
    })

    //提交表单
    form.on('submit(subForm)', function(data){

        $.ajax({
            url:config.host + config.upgradeDirector,
            type:'POST',
            data:data.field,
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
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });

})