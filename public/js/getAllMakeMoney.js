layui.use(['form', 'layer', 'table'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		table = layui.table;

	//列表
	var tableIns = table.render({
		elem: '#userList',
		url: config.host + config.getAllMakeMoney,
		cellMinWidth: 95,
		page: true,
		height: "full-125",
		limit: 20,
		limits: [10, 15, 20, 25, 30],
		id: "userListTable",
		where: {
			userId: localStorage.userId,
		},
		cols: [
			[{
					field: 'withdrawId',
					title: '提现ID',
					align: 'center',
					sort: true
				},
				{
					field: 'userId',
					title: '用户ID',
					align: 'center',
					sort: true
				},
				{
					field: 'userName',
					title: '用户名',
					align: 'center'
				},
				{
					field: 'accountsName',
					title: '账户',
					align: 'center'
				},
				{
					field: 'money',
					title: '提现金额',
					align: 'center',
					sort: true
				},
				{
					field: 'status',
					title: '审核状态',
					align: 'center',
					width: 120,
					templet: function(d) {
						switch(d.status) {
							case 1:
								return '<span class="layui-badge">待审核</span>';
								break;
							case 2:
								return '<span class="layui-badge layui-bg-orange">通过</span>';
								break;
							case 3:
								return '<span class="layui-badge layui-bg-green">拒绝</span>';
								break;
						}
					}
				},
				{
					field: 'userBankList',
					title: '银行卡列表',
					align: 'center',
					templet: $('#bankList')
				},
				{
					field: 'accountsName',
					title: '账户',
					align: 'center'
				},
				{
					field: 'created',
					title: '时间',
					align: 'center',
					sort: true,
					templet: function(d) {
						return getDate(d.created);
					}
				},
			]
		]
	});

	//列表操作
	table.on('tool(userList)', function(obj) {
		var layEvent = obj.event,
			data = obj.data;

		if(layEvent === 'look') { //查看银行卡
			var index = layui.layer.open({
				title: "查看银行卡",
				type: 1,
				content: $('#look'),
				area: ['900px', '680px'],
				success: function(layero, index) {
					var tr = '';
					$.each(data.userBankList, function(i, v) {
						tr += '<tr><td>' + v.userAccount + '</td><td>' + v.bankName + '</td><td>' + v.bankCode + '</td><td>' + getDate(v.created) + '</td></tr>';
					})
					$('#look tbody').empty().append(tr);
				}
			});
		}
	});
})