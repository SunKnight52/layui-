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
        url : config.host + config.getFees,
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
            {field: 'runId', title: '费率ID',  align:'center'},
            {field: 'oneRun', title: '一级费率',  align:'center'},
            {field: 'twoRun', title: '二级费率',  align:'center',},
            {field: 'threeRun', title: '三级费率', align:'center'},
            {field: 'type', title: '类型', align:'center'},
            {field: 'thatOne', title: '太阳系统', templet:function (d) {
                    var str = '';
                    var number = d.thatOne.toString();
                    for (var i=0;i<number.length;i++)
                    {
                        if (i == 0 && number.substr(i,1) == 5){
                            str += '<span class="layui-badge layui-bg-blue">监</span>'
                        }else{
                            str += thatOne[number.substr(i,1)];
                        }
                    }
                    return str;
                }},
        ]]
    });

    var active = {
        edit: function(){
            //新增
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            if (data.length>1 || data.length<=0){
                alertS('请选中一条数据');
                return false;
            }
            showEdit(data[0]);
        }

    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
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
        }else{
            $('#add_template input[name=oneRun]').attr('disabled',false)
        }

        if (data.twoRun == 0)
        {
            $('#add_template input[name=twoRun]').attr('disabled',true)
        }else{
            $('#add_template input[name=twoRun]').attr('disabled',false)
        }

        if (data.threeRun == 0)
        {
            $('#add_template input[name=threeRun]').attr('disabled',true)
        }else{
            $('#add_template input[name=threeRun]').attr('disabled',false)
        }

    }

    //提交表单
    form.on('submit(updateFees)', function(data){

        $.ajax({
            url:config.host + config.updateFees,
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