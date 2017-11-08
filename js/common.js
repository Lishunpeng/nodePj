var numAl = /^[0-9a-zA_Z]+$/;

var myFun = function() {}
myFun.prototype = {
	//post 提交ajax
	postajax: function(path, mydata) {
		mui.ajax({
			type: "post",
			url: path,
			data: mydata,
			success: function(data) {
				mui.alert(data);
			}
		});
	}
}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin',
	data: {
		opassword:"",
		opasswordag:"",
		acco:""
	},
	methods: {
		//登录页面
		loginSmb: function(obj) {
			console.log(this.opassword);
			console.log(this.opasswordag);
			if(!this.opassword || !this.acco) {
				return mui.toast("账号和密码不为空")
			}
			else if (!numAl.test(this.acco)) {
				return	mui.toast("账号请用字母加数字");
			}
			else if(obj == 0) {
				if(!this.opasswordag) {
				return	mui.toast("账号和密码不为空")
				}else if(this.opasswordag != this.opassword){
					return	mui.toast("两次密码不正确");
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
	},
});