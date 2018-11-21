layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: config.host + config.adminBankList,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 20,
        limits: [10, 15, 20, 25, 30],
        id: "userListTable",
        where: {
            userId: localStorage.userId
        },
        cols: [[
            { type: 'checkbox' },
            { field: 'id', title: '银行卡ID', align: 'center'},
            { field: 'realName', title: '真实姓名', align: 'center', },
            { field: 'bankCardNumber', title: '银行卡号', align: 'center' },
            { field: 'bankBranchName', title: '开户行支行名', align: 'center' },
            { field: 'bankLocation', title: '开户行所在地', align: 'center' }

            // {field: 'create', title: '创建时间', align:'center',templet:function (d) {
            //         return getDate(d.create)
            //     }},
        ]]
    });

    //点击编辑
    $('#edit_btn').click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data;

        if (data.length <= 0 || data.length > 1) {
            layer.msg('请选中一条数据');
            return false;
        }

        showEdit(data[0])
    })

    //显示编辑页
    function showEdit(data) {
        //显示数据
        initData(data);
        index = layui.layer.open({
            title: "修改",
            type: 1,
            content: $('#add_template'),
            area: ['650px', '520px'],
        })
    }

    //提交编辑
    form.on('submit(updateForm)', function (data) {
       data.field.userId=localStorage.userId
        $.ajax({
            url: config.host + config.updateAdminBank,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    });


    function initData(data) {
        console.log(data);
        $('#add_template input[name=id]').val(data.id);
        $('#add_template input[name=realName]').val(data.realName);
        $('#add_template input[name=bankLocation]').val(data.bankLocation);
        $('#add_template input[name=bankBranchName]').val(data.bankBranchName);
        $('#add_template input[name=bankCardNumber]').val(data.bankCardNumber);


    }

    //提交搜索
    form.on('submit(searchForm)', function (data) {
        var where = {};
        where.userId = localStorage.userId;
        if (data.field.realName != '') {
            where.realName = data.field.realName;
        }

        if (data.field.bankCardNumber != '') {
            where.bankCardNumber = data.field.bankCardNumber;
        }
        //开始查询
        table.reload("userListTable", {

            where: where
        })
        $(".searchUserInviter").val("")
        return false;
    });
    //新增银行
     form.on('submit(addBank)', function(data){
        data.field.userId=localStorage.userId;
        $.ajax({
            url:config.host + config.createAdminBank,
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
                    layui.layer.close(index1);
                }
            }
        });
        return false;
    });

    function addBank(edit){
         index1 = layui.layer.open({
            title : "添加银行卡",
            type : 1,
            content : $('#add_template1'),
            area: ['650px', '520px'],
        })
        
    }
    $(".add_btn").click(function(){
        addBank();
    })

})