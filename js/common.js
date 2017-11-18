var numAl = /^[0-9a-zA_Z]+$/; //允许数字和英文
var re = /^[1-9]+\d*$/; //允许数字
var equiTypecount = 1; //定义装备判断数字位置
var search = window.location.pathname;
var hash = window.location.hash.replace("#", "");
var myFun = function() {}
myFun.prototype = {
	//返回首页
	back: function() {
		mui.confirm('是否退出冒险并自动保存', function(e) {
			if(e.index) {
				myobj.saveData();
				return
//				return window.location.href = "GameTest.html"
			}
			return mui.alert('请继续冒险')
		})
	},
	//post 提交ajax
	postajax: function(path, mydata) {
		mui.ajax({
			type: "post",
			url: path,
			data: mydata,
			success: function(data) {
				var data = JSON.parse(data)
				if(search == "/login.html") {
					if(data.msg == "注册成功") {
						return mui.alert(data.msg, function() {
							window.location.href = "/index.html";
						});
					}
					return mui.alert(data.msg);
				} else if(search == "/index.html" || search == "/") {

					if(data.msg == "登录成功") {
						return mui.alert(data.msg, function() {
							localStorage.acco = data.myacco;
							window.location.href = "/GameTest.html";
						});
					} else {
						return mui.alert(data.msg);
					}

				} else if(search == "/mybag.html") {
					path == '/saleGoods' ? mui.alert('获取：' + localStorage.getMoney, data.msg, function() {
						location.reload();
					}) : "";
					path == '/useEqui' ? mui.alert(data.msg, function() {
						location.reload();
					}) : "";
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
				if(search == "/GameTest.html" || search == "/beginAdven.html") {
					vm.myWeapon = myobj.getData(myWeapon, vm.myData.weaponUse);
					vm.myCloth = myobj.getData(myEqui, vm.myData.clothUse);
					vm.myAmulet = myobj.getData(myAmulet, vm.myData.amuletUse);
					if(search == "/beginAdven.html") {
						vm.adventInfo.myATK = parseInt(vm.myData.ATK) + parseInt(vm.myWeapon.addAttr);
						vm.adventInfo.myDEF = parseInt(vm.myData.DEF) + parseInt(vm.myCloth.addAttr);
						vm.adventInfo.myHP = parseInt(vm.myData.HP) + parseInt(vm.myAmulet.addAttr);
					}

				} else if(search == "/mybag.html") {
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
			localStorage.cur = $(this).index()
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
						myobj.saleCode(myCode, 1, mydata.name);
					} else {
						return mui.alert('出售失败')
					}
				})
			} else if(mydata.name == 'mat' || mydata.name == 'med') {
				var myCode = "";
				mydata.name == 'mat' ? myCode = localStorage.material : myCode = localStorage.medicine;
				var num = parseInt(mydata.num);
				mui.prompt('请输入丢弃数量', '请输入数量', function(e) {
					if(e.index == 0) {
						return mui.alert('出售失败')
					} else if(!re.test(e.value)) {
						return mui.alert('请输入正确正整数数量')
					} else if(e.value > num) {
						return mui.alert('请确定你有没有这么多物品在进行出售');
					} else if(e.index == 1) {
						myobj.saleCode(myCode, e.value, mydata.name);
					}
				})

			}
		} else {
			return mui.alert("该物品无法出售");
		}
	},
	//生成物品代码串
	saleCode: function(code, val, name) {
		var mydata = JSON.parse(localStorage.mydata);
		var postData = {};
		var data = code.split(",");
		var codeString = "";
		if(name == 'equi') {
			for(i in data) {
				if(mydata.code != data[i]) {
					codeString += ',' + data[i];
				}
			}
		} else {
			for(i in data) {
				var str = data[i].split("#");
				if(mydata.code == data[i]) {
					str[0] -= val;
					str = str[0] + '#' + str[1];
					console.log(str)
					if(str[0] != 0) {
						codeString += ',' + str;
					}

				} else {
					codeString += ',' + data[i];
				}
			}
		}
		codeString = codeString.substr(1);
		postData.name = name;
		postData.code = codeString;
		postData.myacco = localStorage.acco;
		localStorage.getMoney = mydata.goodsInfo.getMoney * val;
		postData.money = parseInt(vm.myData.money) + parseInt(mydata.goodsInfo.getMoney * val);
		console.log(postData)
		myobj.postajax('/saleGoods', postData)
	},
	//冒险模式随机产生怪物
	getMonster: function() {
		var mydata = {};
		if(hash == 0) {
			for(var i = 0; i < vm.allPlace; i++) {
				var myCount = Math.ceil(Math.random() * 2);
				if(myCount == 1) {
					var monsterCount = Math.ceil(Math.random() * easyMonster.length);
					mydata = easyMonster[monsterCount - 1];
					mydata.ismon = true;
				} else {
					var npcCount = Math.ceil(Math.random() * NPC.length);
					mydata = NPC[npcCount - 1];
					mydata.ismon = false;
				}
				vm.advent.push(mydata);
			}
			console.log(vm.advent);
		}
	},
	//移动
	moveGrid: function(obj) {

		$(obj).attr("disabled", 'disabled');
		$('.diceIcon').attr('src', 'dice.gif');
		$('.diceIcon').show();
		setTimeout(function() {
			vm.myCount = Math.ceil(Math.random() * 6);
			$('.diceIcon').attr('src', 'dice' + vm.myCount + '.png');
			//点击按钮是否开启
			$(obj).attr("disabled", false);
			vm.myPlace += vm.myCount;
			if(vm.myPlace >= vm.allPlace) {
				vm.myPlace = vm.allPlace;
				return mui.alert('闯关完成')
			}
			vm.adventData = vm.advent[vm.myPlace - 1]
			myobj.creatHtml(vm.adventData);
		}, 1000);
	},
	searchMap: function() {
		$('.advenBox').slideToggle(300);
	},
	//闯关页面的HTML
	creatHtml: function(obj) {
		$('.advenShow').empty();
		if(obj.ismon) {
			var str = '<div class="monsterInfo">你遇到了：<br/>名字：' +
				obj.name + '<br/>' +
				'攻击力：' + obj.ATK + '<br/>' +
				'血量：' + '<span class="monHP">' + obj.HP + '</span>' + '<br/>' +
				'防御力：' + obj.DEF + '<br/>' +
				'怪物详情：' + obj.detail + '<br/>' +
				'难度系数：' + obj.level + '<br/>' +
				'<ul class = "myOperation" >' +
				'<li onclick="myobj.attack()">攻击</li><li>使用药水</li><li onclick="myobj.attack()">一键攻击</li>' +
				'</ul><p class="fightInfo"></p></div>';
		} else {
			var str = '<div class="monsterInfo">你遇到了：' +
				obj.name + '<br/>' +
				'npc详情：' + obj.detail + '</div>'
		}
		$('.advenShow').append(str);
	},
	//一键攻击
	attack: function() {
		//敌方信息
		vm.adventData.ATK = parseInt(vm.adventData.ATK);
		vm.adventData.DEF = parseInt(vm.adventData.DEF);
		vm.adventData.HP = parseInt(vm.adventData.HP);
		//我放信息
		vm.adventInfo.myATK = parseInt(vm.adventInfo.myATK);
		vm.adventInfo.myDEF = parseInt(vm.adventInfo.myDEF);
		vm.adventInfo.myHP = parseInt(vm.adventInfo.myHP);
		if(vm.adventInfo.myATK < vm.adventData.DEF) {
			mui.alert('你打不过的，放弃吧。');
		} else {
			var eneLosehp = vm.adventInfo.myATK - vm.adventData.DEF;
			vm.adventData.HP -= eneLosehp;
			var myLosehp = vm.adventData.ATK - vm.adventInfo.myDEF;
			vm.adventInfo.myHP -= myLosehp;
			myobj.adventInfo(vm.adventInfo.myHP, vm.adventData.HP, myLosehp, eneLosehp);
		}
	},
	//冒险模式显示信息
	adventInfo: function(myhp, enenyhp, mylose, enlose) {
		if(myhp <= 0) {
			myhp = 0;
			mui.alert('你死了，闯关失败！', function() {
				window.location.href = "GameTest.html"
			})
		} else if(enenyhp <= 0) {
			enenyhp = 0;
			var str = ''
			vm.addMoney += parseInt(vm.adventData.dropMoney);
			$('.monHP').text(enenyhp);
			for(var i = 0; i < parseInt(vm.adventData.dropGoods); i++) {
				var myEqui = null;
				var ramDom = Math.ceil(Math.random() * vm.adventData.drop.length);
				console.log();
				var myDrop = myobj.oddsCount(vm.adventData.drop[ramDom - 1].odds);
				console.log(myDrop)
				if(myDrop) {
					myEqui = myobj.chgetData(vm.adventData.drop[ramDom - 1].type, vm.adventData.drop[ramDom - 1].code);
					vm.myDrop.push(myEqui);
				}
				console.log(myEqui)
				if(myEqui) {
					str += '<br>获得了：<span class=' + myEqui.myclass + '>' + myEqui.name + '</span>'
				}
			}
			$('.fightInfo').html('你杀死了' + vm.adventData.name + ',获得了' + vm.adventData.dropMoney + '元' + str)
			console.log(vm.myDrop,vm.addMoney)
		} else {
			$('.monHP').text(enenyhp);
			$('.nowHP').text('当前(' + myhp + ')');
			$('.fightInfo').html('你对' + vm.adventData.name + '发起了攻击<br>' + vm.adventData.name + '失去了(' + enlose + ')血量<br>你失去了(' + mylose + ')的血量')
		}
	},
	//概率计算
	oddsCount: function(val) {
		console.log(val)
		var ramDom = Math.ceil(Math.random() * 100);
		if(ramDom <= val) {
			return true;
		} else {
			return false;
		}
	},
	//数据代码判断加以转化
	chgetData: function(judey, code) {
		var data = {};
		switch(judey) {
			case 'wea':
				data = myobj.getData(myWeapon, code);
				break;
			case 'clo':
				data = myobj.getData(myEqui, code);
				break;
			case 'amu':
				data = myobj.getData(myAmulet, code);
				break;
			case 'mat':
				data = myobj.getData(mymaterial, code);
				break;
			case 'med':
				data = myobj.getData(mymedicine, code);
				break;
		}
		return data;
	},
	//保存
	saveData:function(){
		console.log(vm.myDrop);
		console.log(vm.addMoney);
	}

}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin,#info,#bagData,#advenContent',
	data: {
		addMoney: 0, //获取的金币
		myDrop: [], //掉落物品
		allPlace: 30, //定义总数
		myPlace: 0,
		isMonster: true,
		advent: [],
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
		material: [],
		myCount: 0,
		adventData: {},
		adventInfo: {},
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
	}
});