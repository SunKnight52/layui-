var $,tab,dataStr,layer;
layui.config({
	base : "public/js/"
}).extend({
	"bodyTab" : "bodyTab"
})
layui.use(['bodyTab','form','element','layer','jquery'],function(){
	var form = layui.form,
		element = layui.element;
		$ = layui.$;
    	layer = parent.layer === undefined ? layui.layer : top.layer;
		tab = layui.bodyTab({
			openTabNum : "50",  //最大可打开窗口数量
			url : config.host + config.menu //获取菜单地址
		});

		if (localStorage.userId == undefined)
		{
			window.location.href = '/login';
		}
	function getData(){

		$.ajax({
			url:tab.tabConfig.url,
			type:'GET',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
            beforeSend:function () {

            },
            success:function (result) {
				console.log(result);
				if (result.code == 0)
				{
					//加载菜单
					dataStr = dataHand(result.data);
					tab.render();
				}else{
					window.location.href = '/login'
				}
            },
			error:function (e) {
                window.location.href = '/login'
            }
		})
	}
	//初始化菜单
	getData();

	//登出
	$('.signOut').click(function () {
		$.ajax({
			url:config.host+config.logout,
			type:'POST',
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
			success:function (result) {
				console.log(result)
				layer.msg("已登出");
				if(result.code==0){
					setTimeout(function(){
						window.location.href = '/login';
					},1000)
               
				}
				
				
            }
		})
    })
	//处理导航数据
	function dataHand(data) {
		if (data.length>0 && typeof data == "object")
		{
			var $tree =[] ;
			$.each(data,function (i,v) {
				if (v.type == 1 )
				{
					$tree.push({title:v.name,permissionId:v.permissionId,icon:'&#xe770;',spread:false,children:[]})
				}
            })
            $.each($tree,function (i,v) {
                $.each(data,function (ii,vv) {
					if (vv.type == 2 && v.permissionId == vv.pid)
					{
                       $tree[i]['children'].push({title:vv.name,href:vv.uri,permissionId:vv.permissionId,icon:'&#xe770;',spread:false,});

					}
                })
            })

			return $tree;
		}
    }
	//页面加载时判断左侧菜单是否显示
	//通过顶部菜单获取左侧菜单
	$(".topLevelMenus li,.mobileTopLevelMenus dd").click(function(){
		if($(this).parents(".mobileTopLevelMenus").length != "0"){
			$(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		}else{
			$(".mobileTopLevelMenus dd").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		}
		$(".layui-layout-admin").removeClass("showMenu");
		$("body").addClass("site-mobile");
		getData($(this).data("menu"));
		//渲染顶部窗口
		tab.tabMove();
	})

	//隐藏左侧导航
	$(".hideMenu").click(function(){
		if($(".topLevelMenus li.layui-this a").data("url")){
			layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
			return false;
		}
		$(".layui-layout-admin").toggleClass("showMenu");
		//渲染顶部窗口
		tab.tabMove();
	})



	//手机设备的简单适配
    $('.site-tree-mobile').on('click', function(){
		$('body').addClass('site-mobile');
	});
    $('.site-mobile-shade').on('click', function(){
		$('body').removeClass('site-mobile');
	});

	// 添加新窗口
	$("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
		//如果不存在子级
		if($(this).siblings().length == 0){
			addTab($(this));
			$('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})




})

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}



