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
					return	mui.alert(data);
				}else if(search == "/index.html" || search == "/"){
					var data = JSON.parse(data)
					if (data.msg == "登录成功") {
						return	mui.alert(data.msg,function(){window.location.href = "/GameTest.html#"+data.name;});
					}else{
						return	mui.alert(data.msg);
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
				console.log(myWeapon);
				
				vm.myData = JSON.parse(data);
				vm.myInfo = vm.myData.myinfo;
				vm.myEqui = vm.myData.myequi;
				for (var i = 0 ; i< myEqui.length;i++) {
					if (vm.myEqui.equiType == myEqui[i].equiType) {
						vm.myCloth = myEqui[i];
					}
				}
				for (var i = 0 ; i< myWeapon.length;i++) {
					if (vm.myEqui.equiType == myWeapon[i].weaponType) {
						vm.myWeapon = myWeapon[i];
					}
				}
				console.log(vm.myCloth);
			}
		})
	},
	//信息页面的头部变化
	changeHead: function() {
		$(".header li").on("click", function() {
			$(this).addClass("cur").siblings().removeClass("cur");
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
		myInfo:[],
		myEqui:[],
		myCloth:[],
		myWeapon:[]
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