var numAl = /^[0-9a-zA_Z]+$/; //允许数字和英文
var re = /^[1-9]+\d*$/; //允许数字
var equiTypecount = 1; //定义装备判断数字位置
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

				} else if(search == "/mybag.html") {
					mui.alert(data, function() {
						location.reload();
					});

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
					vm.myWeapon = myobj.getData(myWeapon, vm.myData.weaponUse);
					vm.myCloth = myobj.getData(myEqui, vm.myData.clothUse);
					vm.myAmulet = myobj.getData(myAmulet, vm.myData.amuletUse);
					console.log(vm.myData);

				} else if(search == "/mybag.html") {
					console.log(vm.myData);
					localStorage.equi = vm.myData.equiCode;
					localStorage.medicine = vm.myData.medicineCode;
					localStorage.material = vm.myData.materialCode;
					vm.equi = vm.myData.equiCode.split(",");
					vm.medicine = vm.myData.medicineCode.split(",");
					vm.material = vm.myData.materialCode.split(",");
					vm.equi = myobj.bagEqui(vm.equi);
					vm.medicine = myobj.bagData(mymedicine, vm.medicine, "medicine");
					vm.material = myobj.bagData(mymaterial, vm.material);
				}

			}
		})
	},
	//数据代码类型转换数据
	getData: function(dataBase, obj) {
		var data = null;
		for(var i = 0; i < dataBase.length; i++) {
			if(obj == dataBase[i].type) {
				return data = dataBase[i];
			}
		}
	},
	//背包非装备信息变化
	bagData: function(dataBase, obj, val) {
		var data = [];
		var str = "";
		for(i in obj) {
			var mydata = {};
			mydata.name = 'mat'
			mydata.code = obj[i];
			if(val == "medicine") {
				mydata.type = "HP";
				mydata.name = 'med'
			}
			str = obj[i].split("#");
			mydata.num = str[0];
			mydata.goodsInfo = myobj.getData(dataBase, str[1]);
			data.push(mydata)
		}
		return data;
	},
	//背包信息中的装备栏
	bagEqui: function(obj) {
		var data = [];
		var strF = "";
		var strL = "";
		for(i in obj) {
			var mydata = {};
			mydata.name = 'equi'
			strF = obj[i].substr(0, 2);
			strL = obj[i].substr(2);
			mydata.useState = strF[0];
			mydata.code = obj[i];
			if(strF[equiTypecount] == 0) {
				mydata.goodsInfo = myobj.getData(myWeapon, strL);
				mydata.type = "ATK"
			} else if(strF[equiTypecount] == 1) {
				mydata.type = "DEF"
				mydata.goodsInfo = myobj.getData(myEqui, strL);
			} else if(strF[equiTypecount] == 2) {
				mydata.type = "HP"
				mydata.goodsInfo = myobj.getData(myAmulet, strL);
			}
			data.push(mydata);
		}
		return data;
	},
	changeBag: function() {
		$(".bagClass li").on("click", function() {
			console.log($(this).index());
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".bagDetail>li").eq($(this).index()).addClass("cur").siblings("li").removeClass("cur");
		})
	},
	//装备查看详细
	equiUseinfo: function() {
		$(".myEqui p").on("click", function() {
			if($(this).attr("data-sea") == "0") {
				$(this).attr("data-sea", 1);
				$(this).siblings("ul").show();
			} else {
				$(this).attr("data-sea", 0);
				$(this).siblings("ul").hide();
			}

		})
	},
	//背包使用显示框
	equiListClick: function(obj, ev) {
		var oev = ev || event;
		oev.cancelBubble = true;
		localStorage.mydata = $(obj).attr("data-mydata");
		$('.clickBox').css({
			top: oev.clientY,
			left: oev.clientX,
			display: "block"
		});
	},
	stopClickEqui: function(ev) {
		var oev = ev || event;
		oev.cancelBubble = true;
	},
	clickBoxhide: function() {
		$(document).on("click", function() {
			$('.clickBox').hide();
		});
	},
	//查看详情
	clickBox_detail: function() {

		var mydata = JSON.parse(localStorage.mydata);
		var str = ""
		mydata.goodsInfo.addAttr ? str = '物品：' + mydata.goodsInfo.name + '\n' + mydata.type + ':+' + mydata.goodsInfo.addAttr + '\n阐述：' + mydata.goodsInfo.detail :
			str = '物品：' + mydata.goodsInfo.name + '\n阐述：' + mydata.goodsInfo.detail;
		mui.alert(str);
		$('.mui-popup-text').addClass("alertLeft");
	},
	//物品的使用
	clickBox_use: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.useState) {
			if(mydata.useState == 1) {
				return mui.alert("该物品使用中")
			} else {
				myobj.changeEqui(mydata);
			}
		}
	},
	//装备切换
	changeEqui: function(equiData) {
		var postData = {};
		var strL = "";
		strL = equiData.code.substr(2);
		if(equiData.code[equiTypecount] == 0) {
			postData.code = myobj.searchEqui(0, equiData.code);
			postData.weaponUse = strL;
			postData.equiClass = 'weapon'
		} else if(equiData.code[equiTypecount] == 1) {
			postData.code = myobj.searchEqui(1, equiData.code);
			postData.clothUse = strL;
			postData.equiClass = 'cloth'
		} else if(equiData.code[equiTypecount] == 2) {
			postData.code = myobj.searchEqui(2, equiData.code);
			postData.amuletUse = strL;
			postData.equiClass = 'amulet'
		}
		postData.typeCode = "equiCode";
		postData.myacco = localStorage.acco;
		myobj.postajax('/useEqui', postData);
		console.log(postData)
	},
	//查询装备类型并转化
	searchEqui: function(val, code) {
		var myCode = localStorage.equi.split(",");
		var str = "";
		for(i in myCode) {
			if(myCode[i][equiTypecount] == val && myCode[i][0] == 1) {
				myCode[i] = '0' + myCode[i].substr(1);
			}
			if(myCode[i] == code) {
				myCode[i] = '1' + myCode[i].substr(1);
			}
			str += ',' + myCode[i];
		}
		return str.substr(1);
	},
	//物品出售
	clickBox_sale: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.goodsInfo.getMoney) {
			if(mydata.useState == 1) {
				return mui.alert("装备使用中");
			} else if(mydata.name == 'equi') {
				var myCode = localStorage.equi;
				mui.confirm('是否确定出售？', function(e) {
					if(e.index == 1) {
						myobj.saleCode(myCode);
					} else {
						return mui.alert('出售失败')
					}
				})
			} else if(mydata.name == 'mat' || mydata.name == 'med') {
				var myCode = "";
				mydata.name == 'mat' ? myCode = localStorage.material : myCode = localStorage.medicine;
				console.log(myCode)
				var num = parseInt(mydata.num);
				mui.prompt('请输入丢弃数量', '请输入数量', function(e) {
					if(e.index == 0) {
						return mui.alert('出售失败')
					} else if(!re.test(e.value)) {
						return mui.alert('请输入正确正整数数量')
					} else if(e.value > num) {
						return mui.alert('请确定你有没有这么多物品在进行出售');
					} else if(e.index == 1) {
						myobj.saleCode(myCode, e.value);
					}
				})

			}
			//			myobj.saleCode(myCode);
		} else {
			return mui.alert("该物品无法出售");
		}
	},
	//生成物品代码串
	saleCode: function(code, val) {
		var mydata = JSON.parse(localStorage.mydata);
		var data = code.split(",");
		var codeString = "";
		for(i in data) {
			var str = data[i].split("#");
			if(mydata.code == data[i]) {
				str[0] -= val;
				str = str[0] + '#' + str[1];
				console.log(str)
				if(str[0] == 0) {
					str = "";
				}
				codeString += ',' + str;
			} else {
				codeString += ',' + data[i];
			}
		}
		codeString = codeString.substr(1);
		var postData = {};
		postData.myacco = localStorage.acco;
		postData.money = localStorage.acco;
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
		myWeapon: {},
		myCloth: {},
		myAmulet: {},
		equi: [],
		medicine: [],
		material: []
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