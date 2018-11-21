layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getTransfer,
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
            {field: 'accountsId', title: '打款账户',  align:'center'},
            {field: 'withdrawId', title: '提现号', align:'center'},
            {field: 'transferFrId', title: '转账人', align:'center'},
            {field: 'transferToId', title: '转账对象', align:'center'},
            {field: 'transferState', title: '状态', align:'center',templet:function (d) {
                    if (d.transferState == 1)
                    {
                        return  '待审核';
                    }else if (d.transferState ==2 )
                    {
                        return '通过';
                    }else if (d.transferState ==3 )
                    {
                        return '拒绝';
                    }
                }},
            {field: 'transferCreateTime', title: '时间', align:'center',templet:function (d) {
                    return getDate(d.transferCreateTime)
                }},
        ]]
    });

    //查询
    form.on('submit(searchForm)', function(data){
        var where = {};
        if (data.field.transferFrId != '')
        {
            where.transferFrId = data.field.transferFrId;
        }
        if (data.field.transferToId != '')
        {
            where.transferToId = data.field.transferToId;
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

    //提交转账记录
    form.on('submit(addForm)',function (data) {
        $.ajax({
            url:config.host + config.addMakeMoneyBill,
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
                    layui.layer.close(index);
                }
            }
        });
        return false;
    })
    function addNews(){
         index = layui.layer.open({
            title : "添加转账记录",
            type : 1,
            content : $('#add_template'),
            area: ['450px', '450px'],
        })
    }
    $(".add_btn").click(function(){
        $('#userId').val(localStorage.userId)
        addNews();
    })
})