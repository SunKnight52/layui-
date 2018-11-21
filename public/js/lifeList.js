layui.use(['form','layer','table','laydate'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;
    var lifeStatus=["充值中","已充值","充值失败"];
    var lifeType={
        100:"水",
        200:"电",
        300:"煤气",
        400:"手机",
        500:"汽油卡",
        600:"游戏"
    }
    //列表

    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.lifeList,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        // where:{
        //     userId:localStorage.userId
        // },
        cols : [[
            {field: 'orderNumber', title: '账单编号',  align:'center'},
            {field: 'userId', title: '会员ID',  align:'center',templet:function (d) {
                if (d.userId == 1)
                {
                    return '公司';
                }else{
                    return d.userId;
                }
            }},
            {field: 'account', title: '充值账号',  align:'center'},
            {field: 'amount', title: '充值数额', align:'center'},
            {field: 'type', title: '充值类型', align:'center',templet:function(d){
                    return lifeType[d.type]
            }},
            {field: 'status', title: '充值状态', align:'center',templet:function(d){
                return lifeStatus[d.status-1]
            }},
            {field: 'createTime', title: '创建时间', align:'center',templet:function (d) {
                    return timestampToTime(d.createTime-0)
                }},
            {field: 'notifyTime', title: '回调时间', align:'center',templet:function (d) {
                    return timestampToTime(d.notifyTime-0)
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


    //搜索
    form.on('submit(searchForm)',function (data) {
        var where = {};
        console.log(data.field)
        if(data.field.userId!=''){
            where.userId = data.field.userId;
        }
        if (data.field.startTime)
        {
            
            where.startTime = new Date(data.field.startTime).getTime();
        }
        if (data.field.endTime)
        {
            where.endTime = new Date(data.field.endTime).getTime();
        }
        if (data.field.type-0)
        {
            where.type = data.field.type;
        }
        if (data.field.status-0)
        {
            where.status = data.field.status;
        }
        if (data.field.orderNumber)
        {
            where.orderNumber = data.field.orderNumber;
        }
        table.init();
        console.log(where)
        table.reload("userListTable",
            {where:where}
        )
// if(data.field.startTime.)
        return false;
    })
    
})