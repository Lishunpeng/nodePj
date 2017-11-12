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
							localStorage.acco = data.myacco;
							window.location.href = "/GameTest.html";
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
				if(search == "/GameTest.html") {
					vm.myInfo = vm.myData.myinfo;
					vm.myEqui = vm.myData.myequi;
					vm.myCloth = myobj.getData(myEqui, vm.myEqui.equiType);
					vm.myWeapon = myobj.getData(myWeapon, vm.myEqui.weaponType);
					vm.myAmulet = myobj.getData(myAmulet, vm.myEqui.amuletType);
				} else if(search == "/mybag.html") {

					vm.mymedicine = myobj.bagData(mymedicine, vm.myData.mymedicine,'medi');
					vm.mymaterial = myobj.bagData(mymaterial, vm.myData.mymaterial,'mate');
					vm.myEqui = myobj.bagEqui(vm.myData.myequi);
				}

			}
		})
	},
	//装备类型转换
	getData: function(dataBase, obj) {
		var data = null;
		for(var i = 0; i < dataBase.length; i++) {
			if(obj == dataBase[i].type) {
				return data = dataBase[i];
			}
		}
	},
	//背包信息变化
	bagData: function(dataBase, obj,val) {
		var data = [];
		console.log(obj);
		for(var i = 0; i < dataBase.length; i++) {
			for(var j = 0; j < obj.length; j++) {
				if(obj[j].type == dataBase[i].type) {

					if(val == "medi") {
						dataBase[i].equiType = "HP"
					}
					dataBase[i].num = obj[j].num;
					data.push(dataBase[i])
				}
			}
		}
		return data;
	},
	//背包信息中的装备栏
	bagEqui: function(obj) {
		var data = [];
		for(var i = 0; i < obj.length; i++) {
			if(obj[i].equiClass == "weapon") {
				for(var j = 0; j < myWeapon.length; j++) {
					if(obj[i].type == myWeapon[j].type) {
						myWeapon[j].equiClass = obj[i].equiClass;
						myWeapon[j].equiType = "ATK"
						myWeapon[j].useState = obj[i].useState;
						data.push(myWeapon[j]);
					}
				}
			} else if(obj[i].equiClass == "cloth") {
				for(var j = 0; j < myEqui.length; j++) {
					if(obj[i].type == myEqui[j].type) {
						myEqui[j].equiClass = obj[i].equiClass;
						myEqui[j].equiType = "DEF"
						myEqui[j].useState = obj[i].useState;
						data.push(myEqui[j]);
					}
				}
			} else if(obj[i].equiClass == "amulet") {
				for(var j = 0; j < myAmulet.length; j++) {
					if(obj[i].type == myAmulet[j].type) {
						myAmulet[j].equiClass = obj[i].equiClass;
						myAmulet[j].equiType = "HP"
						myAmulet[j].useState = obj[i].useState;
						data.push(myAmulet[j]);
					}
				}
			}
		}
		console.log(data)
		return data;
	},
	//EquiList点击显示框
	equiListClick: function(obj, ev) {
		console.log(obj)
		localStorage.myData = $(obj).attr("data-mydata");
		var oev = ev || event;
		oev.cancelBubble = true;
		$(".clickBox").css({
			top: oev.clientY,
			left: oev.clientX,
			display: "block"
		});
	},
	//阻止盒子点击消失
	stopClickEqui: function(ev) {
		var oev = ev || event;
		oev.cancelBubble = true;
	},
	//背包物品详情
	clickBox_detail: function() {
		var data = JSON.parse(localStorage.myData);
		if(data.equiType) {
			var str = data.equiType + '：+' + data.addAttr + '\n' + '阐述：' + data.detail;
		} else {
			var str = '阐述：' + data.detail;
		}
		mui.alert(str, "详情");
	},
	//物品使用功能
	clickBox_use: function() {
		var data = JSON.parse(localStorage.myData);
		myobj.clickBox_cgequi(data);
	},
	//装备切换功能
	clickBox_cgequi:function(data){
		if (data.useState) {
			return	mui.alert("装备使用中");
		}
		
		var equiData = {
			myacco:localStorage.acco,
			'equiClass':data.equiClass,
			type:data.type
		}
		myobj.postajax("/useEqui",equiData);
	},
	//隐藏clickBox框
	clickBoxhide: function() {
		$(window.document).on("click", function() {
			$(".clickBox").hide();
		});

	},
	changeBag: function() {
		$(".bagClass li").on("click", function() {
			console.log($(this).index());
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".bagDetail>li").eq($(this).index()).addClass("cur").siblings("li").removeClass("cur");
		})
	},
	//装备查看详细
	searchEqui: function() {
		$(".myEqui p").on("click", function() {
			if($(this).attr("data-sea") == "0") {
				$(this).attr("data-sea", 1);
				$(this).siblings("ul").show();
			} else {
				$(this).attr("data-sea", 0);
				$(this).siblings("ul").hide();
			}

		})
	}
}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin,#info,#bagData',
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
		myAmulet: [],
		mymedicine: [],
		mymaterial: []
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