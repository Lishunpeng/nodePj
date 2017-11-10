var numAl = /^[0-9a-zA_Z]+$/;
var search = window.location.pathname;
var hash = window.location.hash.replace("#", "");
console.log(hash)
var myFun = function() {}
myFun.prototype = {
	//post 提交ajax
	postajax: function(path, mydata) {
		mui.ajax({
			type: "post",
			url: path,
			data: mydata,
			success: function(data) {
				console.log(data)
				if(search == "/login.html") {
					if(data == "注册成功") {
						return mui.alert(data, function() {
							window.location.href = "/index.html";
						});
					}
					return mui.alert(data);
				} else if(search == "/index.html" || search == "/") {
					var data = JSON.parse(data)
					if(data.msg == "登录成功") {
						return mui.alert(data.msg, function() {
							window.location.href = "/GameTest.html#" + data.name;
						});
					} else {
						return mui.alert(data.msg);
					}

				}

			}
		});
	},
	//get 提交ajax
	getajax: function(path) {
		console.log(path);
		mui.ajax({
			type: "get",
			url: path,
			success: function(data) {
				vm.myData = JSON.parse(data);
				vm.myInfo = vm.myData.myinfo;
				vm.myEqui = vm.myData.myequi;
				myobj.getData(myEqui,vm.myEqui.equiType,'equi');
				myobj.getData(myWeapon,vm.myEqui.weaponType,'weapon');
				myobj.getData(myAmulet,vm.myEqui.amuletType,'amulet');
				console.log(vm.myCloth)
				console.log(vm.myWeapon)
				console.log(vm.myAmulet)
			}
		})
	},
	//装备类型转换
	getData: function(dataBase, obj,newName) {
		for(var i = 0; i < dataBase.length; i++) {
			if(obj == dataBase[i].type) {
				if (newName=='equi') {
					return	vm.myCloth = dataBase[i];
				} else if(newName=='weapon'){
					return vm.myWeapon = dataBase[i];
				}else if(newName=='amulet'){
					return vm.myAmulet = dataBase[i];
				}
				
			}
		}
	},
	
	//背包信息变化
	changeBag: function() {
		$(".bagClass li").on("click", function() {
			$(this).addClass("cur").siblings().removeClass("cur");
		})
	},
	//装备查看详细
	searchEqui:function(){
		$(".myEqui p").on("click",function(){
			if ($(this).attr("data-sea") == "0") {
				$(this).attr("data-sea",1);
				$(this).siblings("ul").show();
			}else{
				$(this).attr("data-sea",0);
				$(this).siblings("ul").hide();
			}
			
		})
	}
}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin,#info',
	data: {
		opassword: "",
		opasswordag: "",
		acco: "",
		name: "",
		myData: [],
		myInfo: [],
		myEqui: [],
		myCloth: [],
		myWeapon: [],
		myAmulet: []
	},
	methods: {
		//登录页面
		loginSmb: function(obj) {
			if(!this.opassword || !this.acco) {
				return mui.toast("账号和密码不为空")
			} else if(!numAl.test(this.acco)) {
				return mui.toast("账号请用字母加数字");
			} else if(obj == 0) {
				if(!this.opasswordag) {
					return mui.toast("账号和密码不为空")
				} else if(this.opasswordag != this.opassword) {
					return mui.toast("两次密码不正确");
				}
			}
			var data = {
				myacco: vm.acco,
				mypassword: vm.opassword
			}
			console.log(data)
			if(obj == 1) {
				myobj.postajax("/mylogin", data);
			} else {
				data.name = this.name;
				console.log(data)
				myobj.postajax("/firstlogin", data);
			}

		},
	},
});