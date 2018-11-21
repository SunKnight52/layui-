layui.use(['form', 'layer', 'table', 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        table = layui.table;

    var userLevel = { 1: '会员', 2: '创客', 3: '合伙人', 4: '市场总监', 5: '高级总监', 6: '特级总监' };

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: config.host + config.membmer,
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limit: 20,
        limits: [10, 15, 20, 25, 30],
        id: "userListTable",

        cols: [[
            { type: 'checkbox' },
            { field: 'userId', title: 'ID', align: 'center', width: 100, },
            {
                field: 'userRealName', title: '用户名', align: 'center', templet: function (d) {
                    if (d.userRealName !== null) {
                        return '<a style="cursor: pointer" lay-event="look">' + d.userRealName + '</a>';
                    } else {
                        return ''
                    }
                }
            },
            { field: 'userAccount', title: '账户', align: 'center', },
            { field: 'userPosId', title: '机器号', align: 'center', },
            {
                field: 'userLevel', title: '账户等级', align: 'center', templet: function (d) {
                    return userLevel[d.userLevel];
                }
            },
            {
                field: 'userVerifierStatus', title: '认证状态', align: 'center', templet: function (d) {
                    switch (d.userVerifierStatus) {
                        case -1:
                            return '<span class="layui-badge layui-bg-blue">未上传</span>';
                            break;
                        case 1:
                            return '<span class="layui-badge layui-bg-blue">待审核</span>';
                            break;
                        case 2:
                            return '<span class="layui-badge layui-bg-blue">已认证</span>';
                            break;
                        case 3:
                            return '<span class="layui-badge layui-bg-blue">已拒绝</span>'
                            break;
                        default:
                            return '';
                            break;
                    }
                }
            },
            { field: 'userInviterRealName', title: '推荐人', align: 'center', },
            { field: 'userInviterAccount', title: '推荐人账号', align: 'center', },
            { field: 'userVerifierName', title: '审核人', align: 'center', },
            {
                field: 'userVerifierTime', title: '审核时间', align: 'center', templet: function (d) {
                    if (d.userVerifierTime != null) {
                        return timestampToTime(d.userVerifierTime - 0)  //timestampToTime参数必须是nub类型
                    } else {
                        return ''
                    }
                }
            },
            {
                field: 'userRegisterTime', title: '注册时间', align: 'center', templet: function (d) {
                    if (d.userRegisterTime != '') {
                        return timestampToTime(d.userRegisterTime - 0)  //timestampToTime参数必须是nub类型
                    } else {
                        return ''
                    }
                }
            },
            {
                field: 'userStatus', title: '状态', align: 'center', width: 100, templet: function (d) {
                    if (d.userStatus == 1) {
                        return '<span class="layui-badge layui-bg-blue">正常</span>'
                    } else if (d.userStatus == -1) {
                        return '<span class="layui-badge layui-bg-black">冻结</span>'
                    } else if (d.userStatus == -2) {
                        return '<span class="layui-badge layui-bg-gray">禁用</span>'
                    } else {
                        return '';
                    }
                }
            },
            // {title: '操作', width:300, templet:'#newsListBar',fixed:"right",align:"center"}
        ]]
    });

    //实例时间
    laydate.render({
        elem: '.searchStartTime', //指定元素
        type: 'datetime'
    });
    laydate.render({
        elem: '.searchEndTime', //指定元素
        type: 'datetime'
    });

    //获取推荐人
    function getInviter() {
        $.ajax({
            url: config.host + config.memberInviter,
            type: 'GET',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {

                if (result.code == 0) {
                    var option = '';
                    $.each(result.data, function (i, v) {
                        // if(v.userRealName != null && v.userId != null){
                        option += '<option value="' + v.userId + '">' + v.userId + ' (' + v.userRealName + ')' + '</option>'
                        //}
                    })
                    $('.userRegisterInviter select[name=userRegisterInviter]').empty().append(option)
                } else {
                    alertS(result.message);
                }
            }
        })
    }
    //初始化
    getInviter();

    //监听等级选择,添加用户时
    form.on('select(userLevel)', function (data) {

        if (data.value == 1) {
            $('.userPosId').hide();
            $('.accountNumber').hide();
            $('.userRegisterInviter').show();

        } else {
            $('.userRegisterInviter').hide();
            $('.userPosId').show();
            $('.accountNumber').show();
        }
    });
    //监听修改等级选择 
    form.on('radio(uptype)', function (data) {

        if (data.value == 1) {
            $('.Model').hide().find('input').removeAttr("lay-verify").val("");
            $('.Invitation').hide().find('input').removeAttr("lay-verify").val("");
            $('.username').hide().find('input').removeAttr("lay-verify").val("");
            $('.account').show().find('input').attr("lay-verify", "required")

        } else if (data.value == 2) {
            $('.Model').hide().find('input').removeAttr("lay-verify").val("");
            $('.account').hide().find('input').removeAttr("lay-verify").val("");
            $('.username').hide().find('input').removeAttr("lay-verify").val("");
            $('.Invitation').show().find('input').attr("lay-verify", "required");
        } else if (data.value == 3) {
            $('.account').hide().find('input').removeAttr("lay-verify").val("");
            $('.username').hide().find('input').removeAttr("lay-verify").val("");
            $('.Invitation').hide().find('input').removeAttr("lay-verify").val("");
            $('.Model').show().find('input').attr("lay-verify", "required");
        } else {
            $('.account').hide().find('input').removeAttr("lay-verify").val("");
            $('.username').show().find('input').attr("lay-verify", "required");
            $('.Invitation').hide().find('input').removeAttr("lay-verify").val("");
            $('.Model').hide().find('input').removeAttr("lay-verify").val("");
        }

    });
    //监听现金选择,升级时
    form.on('select(charge)', function (data) {

        if (data.value == 1) {
            $('#upgradeAgentAmount').attr('disabled', false);

        } else {
            $('#upgradeAgentAmount').attr('disabled', true);
            $('#upgradeAgentAmount').val('');
        }
    });

    //搜索
    $(".search_btn").on("click", function () {
        var where = {};
        if ($('.searchUser').val() != '') {
            where.userAccount = $('.searchUser').val();     //用户账号
        }

        if ($('.searchUserId').val() != '') {
            where.userId = $('.searchUserId').val();        //用户ID
        }

        if ($('.searchStartTime').val() != '') {
            startTime = new Date($('.searchStartTime').val());
            where.userRegisterBeginTime = startTime.getTime();  //开始时间
        }

        if ($('.searchEndTime').val() != '') {
            endTime = new Date($('.searchEndTime').val());
            where.userRegisterEndTime = endTime.getTime();      //结束时间
        }

        if ($('.searchUserStatus').val() != '') {
            where.userStatus = $('.searchUserStatus').val();            //用户状态
        }

        if ($('.searchVerifier').val() != '') {
            where.userVerifierStatus = $('.searchVerifier').val();      //实名认证
        }

        if ($('.searchUserInviter').val() != '') {
            where.inviterAccount = $('.searchUserInviter').val();       //推荐人
        }
        if ($('.searchUserPosId').val() != '') {
        	alert($('.searchUserPosId').val())
        	where.userPosId = $('.searchUserPosId').val();
        }
        //开始查询
        table.reload("userListTable", {

            where: where
        })

    });

    //升级
    $('.level_btn').click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data;

        if (data.length <= 0 || data.length > 1) {
            layer.msg('请选中一条数据');
            return false;
        }
        if (data[0].userLevel >= 3) {
            layer.msg('该账户等级不能升级');
            return false;
        }

        //调用接口 判断用户是否能升级
        $.ajax({
            url: config.host + config.upgradeStatus,
            type: 'POST',
            data: { userId: data[0].userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {

                if (result.code == 0) {
                    //初始化等级
                    if (data[0].userLevel == 1) {
                        var option = '<option value="2">创客</option><option value="3">合伙人</option>'
                        $('.upuserLevel').empty().append(option);
                    } else if (data[0].userLevel == 2) {
                        var option = '<option value="3">合伙人</option>'
                        $('.upuserLevel').empty().append(option);
                    }
                    $('#upgradeAgentAmount').val('')
                    $('.uptj').val(data[0].userInviterRealName);
                    $('.upUserid').val(data[0].userId)
                    form.render('select');
                    index = layui.layer.open({
                        title: '升级',
                        type: 1,
                        content: $('#userLevel'),
                        area: ['500px', '480px'],
                    })
                } else {
                    layer.msg(result.data + result.message);
                }
            }
        })
    })

    //升级表单提交
    form.on('submit(upLevel)', function (data) {
        $.ajax({
            url: config.host + config.memberUpgrade,
            type: 'POST',
            data: data.field,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                layer.msg(result.message);
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index);
                }
            }
        });
        return false;
    })

    //提交表单
    form.on('submit(subForm)', function (data) {

        if (isUpdate === false) {
            var url = config.host + config.memberCreate;
        } else {
            var url = config.host + config.memberUpdate;
        }
        // data.field.roleIds = data.field.roleIds.split(',')
        if (data.field.userLevel == 1) {
            var postData = {
                userLevel: data.field.userLevel,
                userRegisterInviter: data.field.userRegisterInviter,
                upgradeAgentAmount: data.field.upgradeAgentAmount
            };
        } else {
            if (data.field.userPosId == '') {
                layer.msg('机身号必填');
                return false;
            }
            if (data.field.accountNumber == '') {
                layer.msg('账号必填');
                return false;
            }
            var postData = {
                userLevel: data.field.userLevel,
                userPosId: data.field.userPosId,
                accountNumber: data.field.accountNumber,
                upgradeAgentAmount: data.field.upgradeAgentAmount
            };
        }

        $.ajax({
            url: url,
            type: 'POST',
            data: postData,
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
    //修改
    var index1;
    $('.modify').click(function () {
        setStatus('modify');
    })
    //提交修改表单
    form.on('submit(updata1)', function (data) {
        var con1, con2;
        if (data.field.type == 1) {
            if (data.field.account == data.field.againaccount) {
                con1 = data.field.account;
                con2 = data.field.againaccount;
            }
            else {
                alertS("账户号码不一致")
                return false;
            }
        } else if (data.field.type == 2) {
            if (data.field.Invitation == data.field.againInvitation) {
                con1 = data.field.Invitation;
                con2 = data.field.againInvitation;
            }
            else {
                alertS("邀请码不一致")
                return false;
            }
        } else if (data.field.type == 3) {
            if (data.field.Model == data.field.againModel) {
                con1 = data.field.Model;
                con2 = data.field.againModel;
            }
            else {
                alertS("机型号不一致")
                return false;
            }
        } else if (data.field.type == 4) {
            if (data.field.username == data.field.againusername) {
                con1 = data.field.username;
                con2 = data.field.againusername;
            }
            else {
                alertS("姓名不一致")
                return false;
            }
        }
        var dataList = {
            userId: data.field.userId,
            type: data.field.type,
            updateContent1: con1,
            updateContent2: con2
        }
        updata(dataList)

        return false;
    })

    //修改提交
    function updata(data) {
        $.ajax({
            url: config.host + config.updateMember,
            type: 'POST',
            data: data,
            // async : false,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                    layui.layer.close(index1);
                    $('.Model').find("input").val("");
                    $('.Invitation').find("input").val("");
                    $('.username').find("input").val("");
                    $('.account').find("input").val("");
                }
            }

        });
    }

    var index, isUpdate = false;
    //添加
    function addNews(edit) {
        $('#add_template form')[0].reset();
        index = layui.layer.open({
            title: "用户操作",
            type: 1,
            content: $('#add_template'),
            area: ['500px', '680px'],
            success: function (layero, index) {
                //var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    // console.log(edit)
                    // $('.userId').show();
                    // $('#add_template input[name=userId]').val(edit.userId);
                    // $('#add_template input[name=userRealName]').val(edit.userRealName);
                    // $('#add_template input[name=userPosId]').val(edit.userPosId);
                    // $('#add_template input[name=userCellPhone]').val(edit.userCellPhone);
                    // $('#add_template input[name=userEmail]').val(edit.userEmail);
                    // $('#add_template input[name=userRegisterInviter]').val(edit.userRegisterInviter);
                    // $('#add_template input[name=upgradeAgentAmount]').val(edit.upgradeAgentAmount);
                    //
                    // $('#add_template input[name=userLevel]').val(edit.userLevel);
                    //
                    // $('#add_template input[name=userStatus][value='+edit.userStatus+']').prop("checked", "checked");
                    // isUpdate = true;
                    // form.render();

                } else {
                    $('.userId').hide();
                }
            }
        })
    }
    //编辑会员信息
    function user(userId) {
        $.ajax({
            url: config.host + config.memberInfo,
            type: 'GET',
            data: { userId: userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                if (result.code == 0) {
                    $('.userId').show();
                    $('#add_template input[name=userId]').val(result.data.userId);
                    $('#add_template input[name=userRealName]').val(result.data.userRealName);
                    $('#add_template input[name=userPosId]').val(result.data.userPosId);
                    $('#add_template input[name=userCellPhone]').val(result.data.userCellPhone);
                    $('#add_template input[name=userEmail]').val(result.data.userEmail);
                    $('#add_template input[name=userInviterRealName]').val(result.data.userInviterRealName);
                    $('#add_template input[name=userRegisterInviter]').val(result.data.userRegisterInviter);
                    $('#add_template input[name=upgradeAgentAmount]').val(result.data.upgradeAgentAmount);
                    $('#add_template select[name=userLevel]').val(result.data.userLevel);
                    $('#add_template input[name=userStatus][value=' + result.data.userStatus + ']').prop("checked", "checked");
                    form.render();
                    isUpdate = true;
                } else {
                    alertS(result.message)
                }
            }
        });
    }

    $(".add_btn").click(function () {
        $('.userPosId').hide();
        $('.accountNumber').hide();
        $('.userRegisterInviter').show();
        addNews();
    })

    //禁用
    $('.dis').click(function () {
        setStatus('dis');
    })
    //冻结
    $('.frozen').click(function () {
        setStatus('frozen');
    })
    //启用
    $('.enable').click(function () {
        setStatus('enable');
    })
    //审核
    $('.affirm').click(function () {
        setStatus('affirm');
    })

    //通用设置状态和审核
    function setStatus(type) {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data;
        if (data.length <= 0 || data.length > 1) {
            layer.msg('请选中一条数据');
            return false;
        }

        switch (type) {
            case 'dis':
                updateStatus(data[0].userId, -2);
                break;
            case 'frozen':
                updateStatus(data[0].userId, -1);
                break;
            case 'enable':
                updateStatus(data[0].userId, 1);
                break;
            case 'modify':
                index1 = layui.layer.open({
                    title: "修改",
                    type: 1,
                    content: $("#updata_template"),
                    area: ['600px', '600px'],
                });

                $("#updata_template input[name=userId]").val(data[0].userId);
                $("#updata_template input[name=userRealName]").val(data[0].userRealName);
                $("#updata_template input[name=userAccount]").val(data[0].userAccount);
                $("#updata_template input[name=userInviterRealName]").val(data[0].userInviterRealName);
                break;
            case 'affirm':
                var index = layui.layer.open({
                    title: "用户审核",
                    type: 2,
                    content: '/manage/member/list/rz.html?userId=' + data[0].userId,
                    area: ['1000px', '680px'],
                })
                break;
        }
    }

    //批量删除
    $(".del_btn").click(function () {
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            ids = [];
        if (data.length > 0) {
            for (var i in data) {
                ids.push(data[i].userId);
            }
            ids = ids.join('-');
            layer.confirm('确定删除选中的用户？', { icon: 3, title: '提示信息' }, function (index) {
                $.ajax({
                    url: config.host + config.userDelete,
                    type: 'POST',
                    data: { ids: ids, userId: localStorage.userId },
                    xhrFields: {
                        withCredentials: true // 携带跨域cookie
                    },
                    beforeSend: function () {
                    },
                    success: function (result) {
                        if (result.code == 0) {
                            tableIns.reload();
                            layer.close(index);
                        } else {
                            alertS(result.message)
                        }
                    }
                });
            })
        } else {
            layer.msg("请选择需要删除的菜单");
        }
    })


    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'look') { //编辑
            userLook(data.userId)
        }
    });

    //修改会员状态
    function updateStatus(userId, status) {
        $.ajax({
            url: config.host + config.memberStatus,
            type: 'POST',
            data: { userId: userId, userStatus: status },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                alertS(result.message)
                if (result.code == 0) {
                    tableIns.reload();
                }
            }
        })
    }

    //查看会员信息
    function getView() {
        index = layer.open({
            title: "用户查看",
            type: 1,
            content: $('#userLook'),
            area: ['600px', '650px'],

        })
    }
    //信息详情
    function userLook(userId) {
        var html = '';
        var lookObj = $('#userLook');
        $.ajax({
            url: config.host + config.memberView,
            type: 'GET',
            data: { userId: userId },
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend: function () {
            },
            success: function (result) {
                console.log(result)
                if (result.code == 0) {
                    result.data.BTC == undefined ? result.data.BTC = 0 : result.data.BTC;
                    result.data.ETH == undefined ? result.data.ETH = 0 : result.data.ETH;
                    result.data.LAC == undefined ? result.data.LAC = 0 : result.data.LAC;
                    result.data.LMP == undefined ? result.data.LMP = 0 : result.data.LMP;
                    html += '<div class="userinfo">' +
                        '<p>用户名：' + result.data.userRealName + '  用户ID：' + result.data.userId + '</p>' +
                        '<p>账号：' + result.data.userAccount + '</p>' +
                        '</div><div class="user-list">' +
                        '<p><span>手机：</span>' + result.data.userCellPhone + '</p>' +
                        '<p><span>邮箱：</span>' + result.data.userEMail + '</p>' +
                        '<p><span>身份证：</span>' + result.data.userIdentityCard + '</p>' +
                        '<p><span>推荐人：</span>' + result.data.userInviterRealName + '</p>' +
                        '<p><span>推荐账户：</span>' + result.data.userInviterAccount + '</p>' +
                        '<p><span>注册时间：</span>' + result.data.userRegisterTime + '</p>' +
                        '<p><span>账户余额BTC：</span>' + result.data.BTC + '</p>' +
                        '<p><span>账户余额ETH：</span>' + result.data.ETH + '</p>' +
                        '<p><span>账户余额LAC：</span>' + result.data.LAC + '</p>' +
                        '<p><span>账户余额LMP：</span>' + result.data.LMP + '</p>' +
                        '<p><span>分润余额：</span>' + result.data.balance + '</p>' +
                        '<p><span>总分润：</span>' + result.data.total + '</p>'
                    lookObj.empty().append(html)
                    getView();
                } else {
                    alertS(result.message)
                }
            }
        })
    }
    //修改



})