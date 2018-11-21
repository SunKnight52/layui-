layui.use(['form','layer','table'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.author,
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 20,
        limits : [10,15,20,25,30],
        id : "userListTable",
        where:{
            status:0,
        },
        cols : [[
            {type:'checkbox'},
            {field: 'name', title: '菜单名称',  align:'center'},
            {field: 'type', title: '类型', align:'center',templet:function (d) {
                if (d.type ==1)
                {
                    return '目录';
                }else if (d.type == 2)
                {
                    return '菜单';
                }else if (d.type == 3)
                {
                    return '按钮';
                }
            }},
            {field: 'permissionValue', title: '菜单值', align:'center'},
            {field: 'uri', title: '路径', align:'center'},
            {field: 'orders', title: '显示顺序', align:'center',templet:function (d) {
                if (d.orders > 1000000000000)
                {
                    return timestampToTime(d.orders);
                }else{
                    return d.orders
                }
            }},
            {field: 'icon', title: '图标', align:'center'},
            {field: 'status', title: '状态',width:100, align:'center',templet:function (d) {
                if (d.status == 1)
                {
                    return '<span style="color: #5FB878">正常</span>';
                }else{
                    return '<span style="color: #FF5722;">锁定</span>';
                }
            }},
        ]]
    });


    //监听添加类型
    form.on('radio(type)', function(data){
        if (data.value == 1)
        {
            $('#uplevel select[name=pid]').empty();
            $('#uplevel').hide();
            $('#uri input[name=uri]').empty()
            $('#uri').hide();
            $('#permissionValue input[name=permissionValue]').empty()
            $('#permissionValue').hide();
        }else if (data.value == 2)
        {
            getType([2],$('#uplevel select[name=pid]'));

        }else if (data.value == 3)
        {
            getType([3],$('#uplevel select[name=pid]'));

        }
    });
    //获取上级节点
    function getType(type,object) {

        $.ajax({
            url:config.host + config.uplevel,
            type:'GET',
            data:{type:type},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0)
                {
                    $('#uplevel').show();
                    $('#permissionValue').show();
                    $('#uri').show();
                    object.empty();
                    var html = '';
                    $.each(result.data,function (i,v) {
                        html += "<option value='"+v.permissionId+"'>"+v.name+"</option>"
                    })
                    object.append(html);
                    form.render(); //更新全部
                }
            }
        })
    }

    //监听筛选类型
    form.on('select(stype)', function(data) {
        if (data.value == 2)
        {
            getType([2],$('.sPid'));
        }else if (data.value == 3)
        {
            getType([3],$('.sPid'));
        }else{
            $('.sPid').empty();
            form.render();
        }
    });
    //提交表单
    form.on('submit(subForm)', function(data){
        if (data.field.pid == '') data.field.pid = 0;
        if (isUpdate === false)
        {
            var url = config.host + config.authorCreate;
        }else{
            var url = config.host + config.authorUpdate;
        }
        $.ajax({
            url:url,
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

    var index,isUpdate = false;

    //添加
    function addNews(){
         index = layui.layer.open({
            title : "菜单",
            type : 1,
            content : $('#add_template'),
            area: ['450px', '600px'],
        })
    }


    var active = {
        search:function(){
            //查询
            search();
        },
        addMenu: function(){
            //新增
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            HandleData(data,0);
        }
        ,edit: function(){ //编辑
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            HandleData(data,1);
        }
        ,delRows: function(){
            //批量删除
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            HandleData(data,2);
        },
        del: function(){
            //单条删除
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            HandleData(data,3);
        }
    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    function HandleData(data,type) {
        if (type == 0){         //新增
            initForm();
            addNews();
        }
        if (type == 1){         //编辑
            if (data.length >1 || data.length<=0){
                layer.msg('请选一条数据');
                return false;
            }
            initEditForm(data[0]);
            addNews();
        }else if (type == 2){   //批量删除
            var ids = [];
            if(data.length > 0) {
                for (var i in data) {
                    ids.push(data[i].permissionId);
                }
                ids = ids.join('-');
                layer.confirm('确定删除选中的菜单？', {icon: 3, title: '提示信息'}, function (index) {
                    $.ajax({
                        url:config.host + config.authorDel,
                        type:'POST',
                        data:{ids:ids},
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
                                layer.close(index);
                            }
                        }
                    });
                })
            }else{
                layer.msg("请选择需要删除的菜单");
            }
        }else if (type == 3){   //单条删除
            if (data.length >1 || data.length<=0){
                layer.msg('请选一条数据');
                return false;
            }
            layer.confirm('确定删除此菜单？',{icon:3, title:'提示信息'},function(index){
                $.ajax({
                    url:config.host + config.hasChild,
                    type:'GET',
                    data:{permissionId:data[0].permissionId},
                    xhrFields: {
                        withCredentials: true // 携带跨域cookie
                    },
                    beforeSend:function () {
                    },
                    success:function (result) {
                        if (result.code == 0)
                        {
                            delChild(data.permissionId)
                        }else if (result.code == 5000)
                        {
                            alertS(result.message)
                        }
                    }
                });
            });
        }
    }

    function search()
    {
        var where = {};
        if ($('.sName').val() != ''){
            where.name = $('.sName').val();
        }
        if ($('.sPid').val() != ''){
            where.pid = $('.sPid').val();
        }

        if ($('.sType').val() != '') {
            where.type = $('.sType').val();
        }

        if ($('.sStatus').val() != '') {
            where.status = $('.sStatus').val();
        }

        table.reload("userListTable",{
            where:where
        })
    }

    function initForm() {
        $('#add_template form')[0].reset();
        $('#uplevel select[name=pid]').empty();
        $('#uplevel').hide();
        $('#uri input[name=uri]').empty()
        $('#uri').hide();
        $('#permissionValue input[name=permissionValue]').empty()
        $('#permissionValue').hide();
        isUpdate = false;
    }
    
    function initEditForm(edit) {
        $('#add_template input[name=name]').val(edit.name);
        $('#add_template input[name=icon]').val(edit.icon);
        $('#add_template input[name=permissionValue]').val(edit.permissionValue);
        $('#add_template input[name=uri]').val(edit.uri);
        $('#add_template input[name=permissionId]').val(edit.permissionId);
        $('#add_template input[name=orders]').val(edit.orders);
        $('#add_template input[name=status][value='+edit.status+']').prop("checked", "checked");
        $('#add_template input[name=type][value='+edit.type+']').prop("checked", "checked");
        if (edit.type == 2)
        {
            getType([2],$('#uplevel select[name=pid]'));
        }else if (edit.type ==3){
            getType([3],$('#uplevel select[name=pid]'));
        }else if (edit.type == 1)
        {
            $('#uplevel select[name=pid]').empty();
            $('#uplevel').hide();
            $('#uri input[name=uri]').empty()
            $('#uri').hide();
            $('#permissionValue input[name=permissionValue]').empty()
            $('#permissionValue').hide();
        }
        isUpdate = true;
        form.render();
    }


    //删除节点
    function delChild(permissionId) {
        $.ajax({
            url:config.host + config.authorDel,
            type:'POST',
            data:{ids:permissionId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0)
                {
                    tableIns.reload();
                    layer.close(index);
                }else{
                    alertS(result.message)
                }
            }
        });
    }
})