layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    var Grade = {'-1':'公司',0:'群众',1:'会员',2:'创客',3:'合伙人',4:'市场总监',5:'高级总监',6:'特级总监'};
    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getAgent,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        where:{
            userId:localStorage.userId,
        },
        cols : [[
            {field: 'agentId', title: 'ID',  align:'center'},
            {field: 'userId', title: '用户ID',  align:'center',templet:function (d) {
                if (d.userId ==0)
                {
                    return '购机';
                }else{
                    return d.userId;
                }
            }},
            {field: 'oldGrade', title: '原等级', align:'center',templet:function (d) {
                    return Grade[d.oldGrade];
                }},
            {field: 'upGrade', title: '上升等级', align:'center',templet:function (d) {
                    return Grade[d.upGrade];
                }},
            {field: 'upGradeCost', title: '费用', align:'center'},
            {field: 'registerInviter', title: '推荐人', align:'center',templet:function (d) {
                    if (d.registerInviter == -1)
                    {
                        return '公司';
                    }else{
                        return d.registerInviter;
                    }
                }},
            {field: 'status', title: '状态', align:'center',templet:function (d) {
                    if (d.status == 1)
                    {
                        return '已处理';
                    }else{
                        return '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="look">烧伤人员列表</a>';
                    }
                }},
            {field: 'auditorId', title: '审核人ID', align:'center'},
            {field: 'created', title: '创建时间', align:'center',templet:function (d) {
                    return getDate(d.created);
                }},
            {field: 'updated', title: '审核时间', align:'center',templet:function (d) {
                    if(d.updated != null){
                        return getDate(d.updated);
                    }else{
                        return '';
                    }

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

        if (data.field.status != '')
        {
            where.status = data.field.status;
        }

        if (data.field.orderByClause != '')
        {
            where.orderByClause = data.field.orderByClause;
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

    //列表操作
    table.on('tool(userList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'look'){ //查看烧伤人员列表
            getBurn(data.agentId);
        }
    });
    
    //获取烧伤人员
    function getBurn(agentId) {
        var GetData = {userId:localStorage.userId,agentId:agentId};
        $.ajax({
            url:config.host+config.getBurnMember,
            type:'GET',
            data:GetData,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {

                if (result.code == 0)
                {
                    var tr = '';
                    $.each(result.data,function (i,v) {
                        tr += '<tr><td>'+v.userId+'</td><td>'+v.name+'</td><td>'+v.account+'</td></tr>';
                    })
                    $('#look tbody').empty().append(tr);

                    var index = layui.layer.open({
                        title : "查看烧伤人员",
                        type : 1,
                        content : $('#look'),
                        area: ['900px', '680px'],
                    });
                }else{
                    alertS(result.message)
                }
            }
        })
    }
})