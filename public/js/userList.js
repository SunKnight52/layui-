layui.config({
    base: '/public/js/'    //此处写的相对路径, 实际以项目中的路径为准
}).extend({
    formSelects: 'formSelects-v4'
});
layui.use(['form','layer','table','formSelects'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        formSelects = layui.formSelects;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.userlist,
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
            {field: 'username', title: '登录名称',  align:'center'},
            {field: 'realname', title: '真实姓名', align:'center',},
            {field: 'phone', title: '电话', align:'center',},
            {field: 'email', title: '邮箱', align:'center',},
            {field: 'sex', title: '性别', align:'center',templet:function (d) {
                if (d.sex ==1)
                {
                    return '男';
                }else{
                    return '女';
                }
            }},
            {field: 'locked', title: '是否锁定', align:'center',templet:function (d) {
                if (d.locked == 0)
                {
                    return '<span style="color: #5FB878">正常</span>';
                }else{
                    return '<span style="color: #FF5722;">锁定</span>';
                }
            }},
        ]]
    });


    //获取用户角色ID
    function getRoleId(userId) {
        $.ajax({
            url:config.host + config.userRole,
            type:'GET',
            data:{userId:userId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {

                console.log(result)
                if (result.code ==0)
                {
                    var arr = [];
                    if (userId == 0)
                    {
                        $.each(result.data.upmsRoles,function (i,v) {
                            arr.push({name:v.title,value:v.roleId});
                        });
                        formSelects.data('roleIds', 'local', {
                            arr: arr
                        });
                    }else{
                        $.each(result.data.upmsUserRoles,function (i,v) {
                            arr.push(v.roleId);
                        });
                        formSelects.value('roleIds', arr);
                    }
                }else{
                    layer.msg(result.message);
                }
            }
        })
    }
    getRoleId(0);






    //提交表单
    form.on('submit(subForm)', function(data){

        if (isUpdate === false)
        {
            var url = config.host + config.userCreate;
        }else{
            var url = config.host + config.userUpdate;
        }
        data.field.roleIds = data.field.roleIds.split(',')

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
                layer.msg(result.message);
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
    function addNews(edit){
        $('#add_template form')[0].reset();
         index = layui.layer.open({
            title : "用户操作",
            type : 1,
            content : $('#add_template'),
            area: ['500px', '600px'],
            success : function(layero, index){
                //var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    $('#add_template input[name=userId]').val(edit.userId);
                    $('#add_template input[name=username]').val(edit.username);
                    $('#add_template input[name=password]').val(edit.password);
                    $('#add_template input[name=realname]').val(edit.realname);
                    $('#add_template input[name=phone]').val(edit.phone);
                    $('#add_template input[name=email]').val(edit.email);
                    $('#add_template input[name=sex][value='+edit.sex+']').prop("checked", "checked");
                    $('#add_template input[name=locked][value='+edit.locked+']').prop("checked", "checked");
                    isUpdate = true;
                    form.render();
                }
            }
        })
    }


    var active = {
        add: function(){
            //新增
            addNews();
        },
        edit:function () {
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            if (data.length>1 || data.length<=0){
                alertS('请选中一条数据');
                return false;
            }
            getRoleId(data[0].userId)
            addNews(data[0]);
        },
        search:function () {
            var where = {};
            where.search = $('.searchVal').val();
            table.reload("userListTable",{
                where:where
            })
        },
        allDel:function () {
            var checkStatus = table.checkStatus('userListTable'),
                data = checkStatus.data,
                ids = [];
            if(data.length > 0) {
                for (var i in data) {
                    ids.push(data[i].userId);
                }
                ids = ids.join('-');
                layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                    $.ajax({
                        url:config.host + config.userDelete,
                        type:'POST',
                        data:{ids:ids,userId:localStorage.userId},
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
                })
            }else{
                alertS("请选择需要删除的数据");
            }
        }

    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

})