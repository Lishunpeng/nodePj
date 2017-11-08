var numAl = /^[0-9a-zA_Z]+$/;
var search = window.location.pathname;

var myFun = function() {}
myFun.prototype = {
	//post 提交ajax
	postajax: function(path, mydata) {
		mui.ajax({
			type: "post",
			url: path,
			data: mydata,
			success: function(data) {
				if(search == "/login.html") {
					return mui.alert(data, function() {
						window.location.href = "/index.html";
					});
				}
				mui.alert(data);

			}
		});
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
	el: '#login,#firstLogin',
	data: {
		opassword: "",
		opasswordag: "",
		acco: ""
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
				myobj.postajax("/firstlogin", data);
			}

		},

		//getAjaxVue
		getAjax: function(path) {
			mui.ajax({
				type: "get",
				url: path,
				success: function(data) {
					console.log(data);
				}
			})
		},
	},
});