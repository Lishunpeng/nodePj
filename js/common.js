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
				} else if(search == "/adventTG.html") {
					location.reload();
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
					console.log(vm.myData)
				} else if(search == "/mybag.html") {
					console.log(vm.myData);
					vm.equiData = myobj.getData(myEqui, vm.myData.equiCode,'equi');
					vm.petData = myobj.getData(monster, vm.myData.petCode,'pet');
					vm.matData = myobj.getData(mymaterial, vm.myData.matCode,'mat');
					console.log(vm.equiData, 'vm.equiData');
					console.log(vm.petData, 'vm.petData');
					console.log(vm.matData, 'vm.matData');
				} else if(search == "/gameRole.html" || search == "/adventTG.html") {
					/*vm.equiData = myobj.bagEqui(vm.myData.EquiCode, 'equi');
					console.log(vm.equiData)
					for(i in vm.equiData) {
						if(vm.equiData[i].useState == '1') {
							if(vm.equiData[i].goodsInfo.judey == 'wea') {
								vm.useWea = vm.equiData[i].goodsInfo;
								vm.myData.ATK = parseInt(vm.useWea.addAttr) + parseInt(vm.myData.ATK);
							} else if(vm.equiData[i].goodsInfo.judey == 'clo') {
								vm.useClo = vm.equiData[i].goodsInfo;
								vm.myData.DEF = parseInt(vm.useClo.addAttr) + parseInt(vm.myData.DEF);
							} else if(vm.equiData[i].goodsInfo.judey == 'amu') {
								vm.useAmu = vm.equiData[i].goodsInfo;
								vm.myData.HP = parseInt(vm.useAmu.addAttr) + parseInt(vm.myData.HP);
							}
						}
					}*/
				}

			}
		})
	},
	//数据代码类型转换数据
	getData: function(dataBase,obj,val) {
		var data = [];
		for(i in obj) {
			for(j in dataBase) {
				if(obj[i].code == dataBase[j].code) {
					if (val=='mat') {
						dataBase[j].num = obj[i].num;
					}else if(val=='equi'){
						dataBase[j].inten = obj[i].inten;
						dataBase[j].useState = obj[i].useState;
					}else if(val=='pet'){
						dataBase[j].level = obj[i].level;
					}
					dataBase[j].type = obj[i].type;
					dataBase[j]._id = obj[i]._id;
					data.push(dataBase[j]);
				}
			}
		}
		return data;
	},
	/*
	//背包非装备信息变化
	bagData: function(dataBase, obj, val) {

		var data = [];
		var str = "";
		obj = obj.split(',');
		for(i in obj) {
			var mydata = {};
			mydata.code = obj[i];
			mydata.name = val;
			if(val == 'mat') {
				str = obj[i].split("#");
				mydata.num = str[0];
				obj[i] = str[1]
			}
			mydata.goodsInfo = myobj.getData(dataBase, obj[i]);
			data.push(mydata)
		}
		return data;
	},
	//背包信息中的装备栏及宠物
	bagEqui: function(obj, val) {
		obj = obj.split(',');
		console.log(obj)
		var data = [];
		var strF = "";
		var strL = "";
		for(i in obj) {
			var mydata = {};
			mydata.name = val
			strF = obj[i].substr(0, 1);
			strL = obj[i].substr(1).split('&');
			mydata.useState = strF;
			mydata.code = obj[i];
			val == 'equi' ? mydata.goodsInfo = myobj.getData(myEqui, strL[0]) : mydata.goodsInfo = myobj.getData(monster, strL[0]);
			mydata.intensify = strL[1];
			data.push(mydata);
		}
		console.log(data)
		return data;
	},
	*/
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
		$(".roleBorder p").on("click", function() {
			console.log()
			var data = JSON.parse($(this).attr('data-data'))
			console.log(data)
			var str = '<span class=' + data.myclass + '>' + data.name + '</span><br>' +
				data.belone + ':+' + data.addAttr + '<br>' +
				'详情:' + data.detail;
			mui.alert(str, '装备信息');
			$('.mui-popup').addClass('mui-popup-left')
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
		mydata.addAttr ? str = '物品：<span class=' + mydata.myclass + '>' + mydata.name + '</span>\n' + mydata.belone + ':+' + mydata.addAttr + '\n阐述：' + mydata.detail :
			str = '物品：<span class=' + mydata.myclass + '>' + mydata.name + '</span>\n阐述：' + mydata.detail;
		mui.alert(str);
		$('.mui-popup-text').addClass("mui-popup-left");
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
		} else {
			return mui.alert("该物品无法使用");
		}
	},
	//装备切换
	changeEqui: function(data) {
		var postData = {};
		console.log(data)
//		postData.code = myobj.searchEqui(data.code);
		postData.myacco = localStorage.acco;
		postData.type = data.type;
		postData._id = data._id;
		console.log(postData)
//		myobj.postajax('/useEqui', postData);
	},
	//查询装备类型并转化
	/*searchEqui: function(code) {
		var myCode = localStorage.equCode.split(",");
		var str = "";
		for(i in myCode) {
			if(myCode[i][equiTypecount] == code[equiTypecount] && myCode[i][0] == 1) {
				myCode[i] = '0' + myCode[i].substr(1);
			}
			if(myCode[i] == code) {
				myCode[i] = '1' + myCode[i].substr(1);
			}
			str += ',' + myCode[i];
		}
		return str.substr(1);
	},*/
	//物品出售
	clickBox_sale: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.goodsInfo.getMoney) {
			if(mydata.useState == 1) {
				return mui.alert("装备使用中");
			} else if(mydata.name == 'equi') {
				var myCode = localStorage.equCode;
				mui.confirm('是否确定出售？', function(e) {
					if(e.index == 1) {
						myobj.saleCode(myCode, 1, mydata.name);
					} else {
						return mui.alert('出售失败')
					}
				})
			} else if(mydata.name == 'mat') {
				var myCode = localStorage.matCode;
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
	//冒险关卡选择渲染
	getAdvendata: function() {
		vm.tgData = tollGate;
		console.log(vm.tgData)
	},
	//关卡跳转
	adventLink: function(obj, path) {
		window.location.href = path + "#" + obj + "";
	},
	//冒险章节选择渲染
	getAdvenCont: function() {
		$('body').css('background', 'url(' + tollGate[hash].imgPath + ')');
		vm.tgData = tollGate[hash].tg;
		console.log(vm.tgData)
	},
	fightBoard: function(val) {
		val = val.split(',');
		var lastVal = val.pop();
		var rdConut = Math.ceil(Math.random() * 100);
		if(rdConut <= 50) {
			vm.monster = myobj.getData(monster, lastVal);
		} else {
			var rd = Math.ceil(Math.random() * val.length);
			vm.monster = myobj.getData(monster, val[rd - 1]);
		}
		$('.fightBoard').fadeIn(300);
	},

	//捕捉
	catchMon: function() {
		vm.monster.HP = parseInt(vm.monster.HP);
		console.log(vm.monster.HP)
	},
	//攻击
	attack: function() {
		$('.monData .imgbox').remove('span');
		$('.myData .imgbox').remove('span');
		//敌方信息
		vm.monster.ATK = parseInt(vm.monster.ATK);
		vm.monster.DEF = parseInt(vm.monster.DEF);
		vm.monster.HP = parseInt(vm.monster.HP);
		//我放信息
		vm.myData.ATK = parseInt(vm.myData.ATK);
		vm.myData.DEF = parseInt(vm.myData.DEF);
		vm.myData.HP = parseInt(vm.myData.HP);
		if(vm.myData.ATK < vm.monster.DEF) {
			mui.alert('你打不动', function() {
				location.reload();
			});
		} else {
			var eneLosehp = vm.myData.ATK - vm.monster.DEF;
			vm.monster.HP -= eneLosehp;
			var myLosehp = vm.monster.ATK - vm.myData.DEF;
			vm.myData.HP -= myLosehp;
			myobj.adventInfo(vm.myData.HP, vm.monster.HP, myLosehp, eneLosehp);
		}
		console.log(vm.monster)
	},
	//冒险模式显示信息
	adventInfo: function(myhp, enenyhp, mylose, enlose) {
		console.log(myhp, enenyhp)
		if(myhp <= 0) {
			myhp = 0;
			mui.alert('你死了！', function() {
				location.reload();
			})
		} else if(enenyhp <= 0) {
			$('.a_attack').attr('disabled', 'disabled');
			$(".winnerBox").slideDown(300);
			vm.monster.HP = 0;
			vm.addMoney += parseInt(vm.monster.dropMoney);
			for(var i = 0; i < parseInt(vm.monster.dropGoods); i++) {
				var myEqui = null;
				var ramDom = Math.ceil(Math.random() * vm.monster.drop.length);
				console.log();
				var myDrop = myobj.oddsCount(vm.monster.drop[ramDom - 1].odds);
				console.log(myDrop)
				if(myDrop) {
					myEqui = myobj.chgetData(vm.monster.drop[ramDom - 1].type, vm.monster.drop[ramDom - 1].code);
					vm.myDrop.push(myEqui);
				}
			}
			console.log(vm.myDrop, vm.addMoney)
		} else {

			$('.monData .imgbox').prepend("<span class='loseHp'>-" + enenyhp + "</span> ");
			$('.myData .imgbox').prepend("<span class='loseHp'>-" + mylose + "</span> ");
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
			case 'equ':
				code = code.substr(1);
				data = myobj.getData(myEqui, code);
				break;
			case 'mat':
				data = myobj.getData(mymaterial, code);
				break;
		}
		return data;
	},
	//保存
	saveData: function() {
		var postData = {};
		var isBaghas = false;
		postData.equiCode = vm.myData.EquiCode;
		postData.materialCode = vm.myData.materialCode;
		console.log(vm.myData)
		if(vm.myDrop.length) {
			for(i in vm.myDrop) {
				if(vm.myDrop[i].judey == 'mat') {
					var matCode = vm.myData.materialCode.split(',');
					postData.materialCode = "";
					for(j in matCode) {
						var str = matCode[j].split('#');
						if(vm.myDrop[i].type == str[1]) {
							isBaghas = true;
							str[0]++;
						}
						matCode[j] = ',' + str[0] + '#' + str[1];
						postData.materialCode += matCode[j];
					}
					if(!isBaghas) {
						postData.materialCode = ',' + vm.myData.materialCode + ',1#' + vm.myDrop[i].type;
					}
					vm.myData.materialCode = postData.materialCode.substr(1);
					postData.materialCode = vm.myData.materialCode;
				} else {
					postData.equiCode += ',0' + vm.myDrop[i].type;
				}
			}

		}
		postData.money = parseInt(vm.myData.money) + parseInt(vm.addMoney);
		postData.myacco = vm.myData.myacco;
		myobj.postajax("/saveData", postData);
	}
	/*
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
	},*/

}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin,#info,#bagData,#advenContent,#bagInfo,#choosePass,#advenTG',
	data: {
		addMoney: 0, //获取的金币
		myDrop: [], //掉落物品
		allPlace: 30, //定义总数
		myPlace: 0, //我当前位置
		isMonster: true, //是否怪
		advent: [],
		opassword: "",
		opasswordag: "",
		acco: "",
		name: "",
		monster: {}, //怪物对象
		myData: [],
		equiData: [], //背包装备数组
		matData: [], //背包材料数据数组
		petData: [], //背包宠物数组
		useWea: {}, //使用武器对象
		useClo: {}, //使用衣服对象
		useAmu: {}, //使用护符对象
		myCount: 0, //计算步数
		tgData: [],
		matDrop: [], //掉落材料
		equDrop: [] //装备掉落
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