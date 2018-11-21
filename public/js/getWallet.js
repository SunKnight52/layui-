layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    var thatOne = ['<span class="layui-badge">手续费</span>','<span class="layui-badge layui-bg-orange">会</span>','<span class="layui-badge layui-bg-green">创</span>'
        ,'<span class="layui-badge layui-bg-cyan">合</span>','<span class="layui-badge-rim">市</span>','<span class="layui-badge layui-bg-blue">高</span>','<span class="layui-badge layui-bg-gray">特</span>'];
    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.getWallet,
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
            {field: 'accountsId', title: '钱包ID',  align:'center'},
            {field: 'userId', title: '用户ID',  align:'center'},
            {field: 'userName', title: '姓名', align:'center'},
            {field: 'coinEnsName', title: '币种',  align:'center',},
            {field: 'tkAvailableValue', title: '可用余额', align:'center'},
            {field: 'tkFrozenValue', title: '提现额度', align:'center'},
            {field: 'walletAddresss', title: '地址', align:'center'},
            {field: 'create', title: '创建时间', align:'center',templet:function (d) {
                    return getDate(d.create)
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

        showEdit(data[0])
    })

    //显示编辑页
    function showEdit(data)
    {
        //显示数据
        initData(data);
        index = layui.layer.open({
            title : "修改",
            type : 1,
            content : $('#add_template'),
            area: ['500px', '380px'],
        })
    }

    //提交编辑
    form.on('submit(updateForm)', function(data){

        $.ajax({
            url:config.host + config.updateWallet,
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


    function initData(data)
    {
        console.log(data);
        $('#add_template input[name=userId]').val(localStorage.userId);
        $('#add_template input[name=accountsId]').val(data.accountsId);
        $('#add_template input[name=tkAvailableValue]').val(data.tkAvailableValue);
        $('#add_template input[name=tkFrozenValue]').val(data.tkFrozenValue);
    }

    //提交搜索
    form.on('submit(searchForm)', function(data){

        var where = {};
        where.userId = localStorage.userId;
        if (data.field.whoId != ''){
            where.whoId = data.field.whoId;
        }

        if (data.field.sort != ''){
            where.sort = data.field.sort;
        }

        if (data.field.order != ''){
            where.order = data.field.order;
        }
        //开始查询
        table.reload("userListTable",{

            where:where
        })
        return false;
    });


})