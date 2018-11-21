var select;
layui.use(['form','layer','table'],function(zTreeData){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        table = layui.table,
        $ = jQuery = layui.$;
    //列表
    var tableIns = table.render({
        elem: '#userList',
        url : config.host + config.role,
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
            {field: 'name', title: '角色名称',  align:'center'},
            {field: 'title', title: '角色',  align:'center'},
            {field: 'description', title: '角色描述', align:'center',},
            {field: 'ctime', title: '创建时间', align:'center',templet:function (d) {
                return timestampToTime(d.ctime-0);
            }},
        ]]
    });

    var active = {
        add: function(){
            //新增
            addNews();
        },
        del:function () {
            var checkStatus = table.checkStatus('userListTable') //获取id表格中的选中框
                ,data = checkStatus.data;                        //获取选中框勾选的数量
            if (data.length>1 || data.length<=0){ 
                alertS('请选中一条数据');
                return false;
            }
            layer.confirm('确定删除此角色？',{icon:3, title:'提示信息'},function(index){
                $.ajax({
                    url:config.host + config.roleDelete,
                    type:'POST',
                    data:{ids:data[0].roleId},
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
            });
        },
        allDel:function () {
            var checkStatus = table.checkStatus('userListTable'),
                data = checkStatus.data,
                ids = [];
            if(data.length > 0) {
                for (var i in data) {
                    ids.push(data[i].roleId);
                }
                ids = ids.join('-');
                layer.confirm('确定删除选中的角色？', {icon: 3, title: '提示信息'}, function (index) {
                    $.ajax({
                        url:config.host + config.roleDelete,
                        type:'POST',
                        data:{ids:ids},
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
                alertS("请选择需要删除的菜单");
            }
        },
        edit:function () {
            var checkStatus = table.checkStatus('userListTable')
                ,data = checkStatus.data;
            if (data.length>1 || data.length<=0){
                alertS('请选中一条数据');
                return false;
            }
            setRole(data[0].roleId)
            addNews(data[0]);
        }

    };

    $('#btn_list .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    //提交表单
    form.on('submit(subForm)', function(data){

        data.field.permissionIds = select;
        console.log(data.field);
        if (isUpdate === false)
        {
            var url = config.host + config.roleCreate;
        }else{
            var url = config.host + config.roleUpdate;
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
            title : "添加",
            type : 1,
            content : $('#add_template'),
            area: ['450px', '550px'],
            success : function(layero, index){
                //var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    $('#add_template input[name=roleId]').val(edit.roleId);
                    $('#add_template input[name=name]').val(edit.name);
                    $('#add_template input[name=title]').val(edit.title);
                    $('#add_template input[name=description]').val(edit.description);
                    $('#add_template input[name=orders]').val(edit.orders);
                    isUpdate = true;
                    form.render();
                }
            }
        })
    }

    //设置树选中
    function setRole(roleId) {
        $.ajax({
            url:config.host + config.rolelist,
            type:'get',
            data:{roleId:roleId},
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {
            },
            success:function (result) {
                if (result.code == 0){
                    loadTree(result.data);
                    onCheck()
                }else{
                    alertS(result.message)
                }

            }
        });
    }

    setRole(0);

})

var zTreeObj;
function loadTree(zNodes) {

// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        check:{
            enable: true,
            chkboxType :{ "Y" : "ps", "N" : "s" },
        },
        callback:{
            beforeCheck:true,
            onCheck:onCheck
        }
    };
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}


function onCheck(e,treeId,treeNode){

    nodes=zTreeObj.getCheckedNodes(true),
        v=[];
    for(var i=0;i<nodes.length;i++){
        v.push(nodes[i].id)

    }
    select =  v
}

function setSelect(arr) {
    $.each(arr,function (i,v) {
        var node = zTreeObj.getNodeByParam("id",v);
        zTreeObj.checkNode(node,true)
    })
}

