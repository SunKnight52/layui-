/**
 * Created by Administrator on 2018/7/10.
 */

var config = {
    host:'http://192.168.1.119:8000',         //服务器地址
    login:'/ydb-admin/sso/login',                       //登录接口
    logout:'/ydb-admin/sso/logout',                   //退出接口
    menu: '/ydb-admin/manage/index',                    //后台主菜单接口
    userlist:'/ydb-admin/manage/user/list',             //用户列表
    userRole:'/ydb-admin/manage/user/role',             //用户角色ID
    userCreate:'/ydb-admin/manage/user/create',         //创建用户
    userUpdate:'/ydb-admin/manage/user/update',         //修改用户
    userDelete:'/ydb-admin/manage/user/delete',         //删除用户
    role: '/ydb-admin/manage/role/list',                //角色列表接口
    rolelist: '/ydb-admin/manage/permission/role',      //权限列表接口
    roleCreate: '/ydb-admin/manage/role/create',        //新增角色
    roleUpdate: '/ydb-admin/manage/role/update',        //修改角色
    roleDelete: '/ydb-admin/manage/role/delete',        //删除角色
    author:'/ydb-admin/manage/permission/list',         //权限菜单接口
    uplevel:'/ydb-admin/manage/permission/upper',       //上级节点
    authorCreate:'/ydb-admin/manage/permission/create',  //新增权限菜单接口
    authorDel:'/ydb-admin/manage/permission/delete',     //删除权限菜单接口
    authorUpdate:'/ydb-admin/manage/permission/update',  //修改权限菜单接口
    hasChild:'/ydb-admin/manage/permission/hasChild',    //判断是否有子节点
    membmer:'/ydb-admin/manage/member/list',             //会员列表
    memberView:'/ydb-admin/manage/member/view',          //查看指定会员信息
    //memberCreate:'/ydb-admin/manage/member/create',      //添加会员
    memberUpdate:'/ydb-admin/manage/member/update',      //更新会员
    memberStatus:'/ydb-admin/manage/member/status',      //修改会员状态
    memberInfo:'/ydb-admin/manage/member/user',          //获取会员信息
    memberCheck:'/ydb-admin/manage/member/check',          //审核会员信息
    memberAffirm:'/ydb-admin/manage/member/affirm',        //审核会员确定
    updateMember:'/ydb-admin/manage/member/updateMember',  //修改会员绑定信息
    memberInviter:'/ydb-admin/manage/user/member',       //获取推荐人
    //upgradeStatus:'/ydb-admin/manage/member/upgradeStatus', //会员是否可升级
	//memberUpgrade:'/ydb-admin/manage/member/upgrade',        //会员升级

    memberImg:'http://192.168.0.113:8073/SCC-POS',


    //代理模块
    getAllCoin:'/ydb-admin/coin/allCoin',                               //获取所有币种
    //银行
    getAllBank:'/ydb-admin/bank/getAllBank',                       //获取所有银行
    addBank:'/ydb-admin/bank/addBank',                              //添加银行
    getUserBank:'/ydb-admin/bank/getUserBank',                      //获取绑定信息
    getAllMakeMoney:'/ydb-admin/bank/getAllMakeMoney',              //获取所有申请提现记录
    getTransfer:'/ydb-admin/bank/getTransfer',                      //获取转账记录
    addMakeMoneyBill:'/ydb-admin/bank/addMakeMoneyBill',            //添加转账记录
    getBankReminder:'/ydb-admin/bank/getBankReminder',              //获取充值的温馨提示
    updateBankReminder:'/ydb-admin/bank/updateBankReminder',        //修改温馨提示
    ydbadminBankList:'/ydb-admin/bank/ydb-adminBankList',                  //获取银行卡信息
    updateydbadminBank:'/ydb-admin/bank/updateydb-adminBank',              //修改银行卡信息
    createydbadminBank:'/ydb-admin/bank/createydb-adminBank',              //新增银行卡信息
    getWithdrawSetting:'/ydb-admin/bank/getWithdrawSetting',        //获取提现配置
    withdrawSetting:'/ydb-admin/bank/withdrawSetting',				//修改或创建提现配置
    //钱包
    getWallet:'/ydb-admin/wallet/getWallet',                        //钱包列表
    updateWallet:'/ydb-admin/wallet/updateWallet',                  //修改钱包
    getReceiptBill:'/ydb-admin/wallet/getReceiptBill',            //获取收款账单
    getBuySellBill:'/ydb-admin/wallet/getBuySellBill',              //获取买卖币账单
    getPutCoinBill:'/ydb-admin/wallet/getPutCoinBill',              //获取提币账单
    transaction:'/ydb-admin/wallet/transaction',
    getBounsInfo:'/ydb-admin/wallet/getBounsInfo',
    getUserBouns:'/ydb-admin/wallet/getUserBouns',
    //链盟宝
    getYbbSetting:'/ydb-admin/yubibao/getYbbSetting',               //获取链盟宝设置
    updateYbbSetting:'/ydb-admin/yubibao/updateYbbSetting',         //修改链盟宝设置
    getRollOurBill:'/ydb-admin/yubibao/getRollOurBill',             //获取转入转出账单

    //币种
    getAllCoins:'/ydb-admin/coin/getAllCoin',			 //查询币种信息
    addCoin:'/ydb-admin/coin/addCoin',					//添加币种
    updateCoinInfo:'/ydb-admin/coin/updateCoinInfo',	 //修改币种
    updateCoinStatu:'/ydb-admin/coin/updateCoinStatu',		//修改币种状态
    getAllCoinFees:'/ydb-admin/coin/getAllCoinFees',		//获取币种费率
    updateCoinFees:'/ydb-admin/coin/updateCoinFees',			//修改币种费率

    //充值
    rechargeList:'/ydb-admin/manage/recharge/list',             //获取充值列表
    bankcard:'/ydb-admin/manage/recharge/bankcard',             //银行列表
    getUserList:'/ydb-admin/manage/user/user',                  //获取用户列表
    rechargeAffirm:'/ydb-admin/manage/recharge/affirm',         //提交审核
    //upgradeDirector:'/ydb-admin/agent/upgradeDirector',         //升级总监
    lifeList:'/ydb-admin/manage/life/list',                    //生活充值
    //手续费及分红管理
    viewFeesList: '/ydb-admin/agent/viewFeesList',              //获取手续费费率流水
    getFeesRun: '/ydb-admin/agent/getFeesRun',              //获取手续费费费例
    updateFeesRun: '/ydb-admin/agent/updateFeesRun',              //修改手续费费费例
    viewYLBounsList: '/ydb-admin/agent/viewYLBounsList',              //获取分红实例
    createYLBouns: '/ydb-admin/agent/createYLBouns',              //创建分红实例
    updateYLBouns: '/ydb-admin/agent/updateYLBouns',              //修改分红实例
    oneKeyYLBouns: '/ydb-admin/agent/oneKeyYLBouns',              //一键分红
    viewYLBounsBill: '/ydb-admin/agent/viewYLBounsBill',              //一键分红
};

function timestampToTime(timestamp) {
    var date = new Date(timestamp);

    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}

function getDate(tm){
    var tt=new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "         ")
    return tt;
}

function alertS(message) {
    layer.alert(message, {
        closeBtn: 0
        ,title:'提示'
        ,icon:5
        ,anim: 4 //动画类型
    });
}

