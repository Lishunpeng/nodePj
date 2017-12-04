var numAl = /^[0-9a-zA_Z]+$/; //允许数字和英文
var re = /^[1-9]+\d*$/; //允许数字
var equiTypecount = 1; //定义装备判断数字位置
var search = window.location.pathname;
var hash = window.location.hash.replace("#", "");
var myFun = function() {}
myFun.prototype = {
	/*//返回首页
	back: function() {
		mui.confirm('是否退出冒险并自动保存', function(e) {
			if(e.index) {
				myobj.saveData();
				return
				//				return window.location.href = "GameTest.html"
			}
			return mui.alert('请继续冒险')
		})
	},*/
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
					}) : mui.alert(data.msg, function() {
						location.reload();
					});
				} else if(search == "/adventTG.html") {
					if(path == '/catchPet') {
						mui.alert(data.msg, function() {
							data.bool != 0 ? location.reload() : $('.a_catch').attr('disabled', false);
						})
					} else {
						location.reload();
					}

				}else if(search == "/shop.html"){
					mui.alert('花费了：' + localStorage.getMoney, data.msg, function() {
						location.reload();
					})
				}else if(search == "/intenEqui.html"){
					console.log(data)
					mui.alert(data.msg, function() {location.reload();})
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
				console.log(vm.myData)
				if(search == "/GameTest.html" || search == "/beginAdven.html") {
					console.log(vm.myData)
				} else if(search == "/mybag.html" || search == "/intenEqui.html") {
					vm.equiData = myobj.getData(myEqui, vm.myData.equiCode);
					vm.petData = myobj.getData(myPet, vm.myData.petCode);
					vm.matData = myobj.getData(mymaterial, vm.myData.matCode);
					if(search == "/intenEqui.html") {
						vm.myData.intenNum = myobj.getOneData(vm.myData.matCode,'06');
						console.log(vm.myData.intenNum);
					}
				} else if(search == "/gameRole.html" || search == "/adventTG.html") {
					vm.equiData = myobj.getData(myEqui, vm.myData.equi);
					vm.petData = myobj.getData(myPet, vm.myData.pet);
					vm.myData.petATK = vm.petData[0].goods.addAttr;
					vm.myData.petName = vm.petData[0].goods.name;
					vm.myData.petimgPath = vm.petData[0].goods.imgPath;
					//计算总属性
					if(search == "/adventTG.html") {
						vm.myData.ballNum = myobj.getOneData(vm.myData.mat,'05');
						console.log(vm.myData)
					}

					for(i in vm.equiData) {
						if(vm.equiData[i].type == 'wea') {
							vm.myData.ATK = parseInt(vm.equiData[i].goods.addAttr) + parseInt(vm.myData.ATK);
						} else if(vm.equiData[i].type == 'clo') {
							vm.myData.DEF = parseInt(vm.equiData[i].goods.addAttr) + parseInt(vm.myData.DEF);
						} else if(vm.equiData[i].type == 'amu') {
							vm.myData.HP = parseInt(vm.equiData[i].goods.addAttr) + parseInt(vm.myData.HP);
						}
					}
				}

			}
		})
	},
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	//数据代码类型转换数据
	getData: function(dataBase, obj) {
		var data = [];
		if(myobj.isArray(obj)) {
			for(i in obj) {
				for(j in dataBase) {
					if(obj[i].code == dataBase[j].code) {
						var myData = {}
						myData = obj[i];
						myData.goods = dataBase[j];
						data.push(myData);
					}
				}
			}
			console.log(data)
			return data;
		} else {
			for(i in dataBase) {
				if(obj == dataBase[i].code) {
					return dataBase[i];
				}
			}
		}

	},
	//数据代码分离出单个值
	getOneData: function(obj,code) {
		for(i in obj) {
			if (obj[i].code == code) {
				return obj[i].num;
			}
		}
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
	equiUseinfo: function(obj) {
		var data = JSON.parse($(obj).attr('data-data'));
		var str1 = "";
		data.type == 'pet' ? str1 = '<br>宠物等级：' + data.level : str1 = '<br>强化等级：' + data.inten + '<br>' + data.goods.belone + ':+' + data.goods.addAttr + '<br>';
		var str = '<span class=' + data.goods.myclass + '>' + data.goods.name + '</span><br>' +
			'详情:' + data.goods.detail;
		mui.alert(str + str1, '提示信息');
		$('.mui-popup').addClass('mui-popup-left');
	},
	//背包使用显示框
	equiListClick: function(obj, ev) {
		var oev = ev || event;
		oev.cancelBubble = true;
		localStorage.mydata = $(obj).attr("data-mydata");
		var mydata = JSON.parse(localStorage.mydata);
		mydata.type == 'pet' ? vm.isPet = true : vm.isPet = false;
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

		var str1 = "";
		if(mydata.type != 'mat') {
			mydata.type == 'pet' ? str1 = '<br>宠物等级：' + mydata.level : str1 = '<br>强化等级：' + mydata.inten;
		}

		var str = ""
		mydata.goods.addAttr ? str = '物品：<span class=' + mydata.goods.myclass + '>' + mydata.goods.name + '</span>\n' + mydata.goods.belone + ':+' + mydata.goods.addAttr + '\n阐述：' + mydata.goods.detail :
			str = '物品：<span class=' + mydata.goods.myclass + '>' + mydata.goods.name + '</span>\n阐述：' + mydata.goods.detail;
		mui.alert(str + str1);
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
		myobj.postajax('/useEqui', postData);
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
	//强化
	clickBox_intentPut:function(){
		var mydata = JSON.parse(localStorage.mydata);
		if (mydata.useState ==1) {
			return mui.alert('装备使用中');
		}else{
			$('.intenBox .equi').css('backgroundImage','url('+mydata.goods.imgPath+')');
			$('.intenBox .intensify').text('+'+mydata.inten);
		}
	},
	//物品出售
	clickBox_sale: function() {
		console.log(vm.myData)
		var isRemove = 1;
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.goods.getMoney) {
			if(mydata.useState == 1) {
				return mui.alert("物品使用中");
			} else if(mydata.type != 'mat') {
				mui.confirm('是否确定出售？', function(e) {
					if(e.index == 1) {
						myobj.saleCode(mydata._id, 1, mydata.type, isRemove);
					} else {
						return mui.alert('出售失败')
					}
				})
			} else {
				var num = parseInt(mydata.num);
				mui.prompt('请输入丢弃数量', '请输入数量', function(e) {
					if(e.index == 0) {
						return mui.alert('出售失败')
					} else if(!re.test(e.value)) {
						return mui.alert('请输入正确正整数数量')
					} else if(e.value > num) {
						return mui.alert('请确定你有没有这么多物品在进行出售');
					} else if(e.index == 1) {
						e.value == num ? isRemove = 1 : isRemove = 0;
						num -= e.value;
						myobj.saleCode(mydata._id, e.value, mydata.type, isRemove, num);
					}
				})

			}
		} else {
			return mui.alert("该物品无法出售");
		}
	},
	//生成物品代码串
	saleCode: function(_id, val, type, isRemove, num) {
		var mydata = JSON.parse(localStorage.mydata);
		var postData = {};
		postData.type = type;
		postData._id = _id;
		postData.myacco = localStorage.acco;
		postData.num = num;
		postData.isRemove = isRemove;
		localStorage.getMoney = mydata.goods.getMoney * val;
		postData.money = parseInt(vm.myData.money) + parseInt(mydata.goods.getMoney * val);
		console.log(postData);
		myobj.postajax('/saleGoods', postData)
	},
	clickBox_putDown: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.useState == 1) {
			return mui.alert("宠物使用中");
		} else {
			mui.confirm('是否确定放生？', function(e) {
				if(e.index == 1) {
					var postData = {};
					postData._id = mydata._id;
					postData.myacco = localStorage.acco;
					myobj.postajax('/putdonwPet', postData);
				} else {
					return mui.alert('放生失败')
				}
			});
		}
	},
	//购买物品
	clickBox_butIt:function(){
		var mydata = JSON.parse(localStorage.mydata);
		if (mydata.type == 'mat') {
			mui.prompt('请输入你购买的数量',function(e){
				if(e.index == 0) {
						return mui.alert('购买失败！');
					} else if(!re.test(e.value)) {
						return mui.alert('请输入正确正整数数量')
					} else if(e.index == 1) {
						myobj.butPost(e.value);
					}
			});
		}else{
			mui.confirm('是否确定购买？', function(e) {
				if(e.index == 1) {
					myobj.butPost(1);
				} else {
					return mui.alert('购买失败！');
				}
			});
		}
	},
	//生成购买的数据
	butPost:function(num){
		var postData = {};
		var mydata = JSON.parse(localStorage.mydata);
		localStorage.getMoney = parseInt(mydata.useMoney)*num;
		postData.money = parseInt(vm.myData.money) - parseInt(localStorage.getMoney);
		if (postData.money<0) {
			return	mui.alert('请确定你有没有那么多钱');
		}
		postData.myacco = localStorage.acco;
		postData.code = mydata.code;
		postData.num = num;
		postData.type = mydata.type;
		postData.inten = mydata.inten;
		console.log(postData)
		myobj.postajax('/showBut', postData);
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
		if(rdConut <= 3) {
			vm.monster = myobj.getData(monster, lastVal);
		} else {
			var rd = Math.ceil(Math.random() * val.length);
			vm.monster = myobj.getData(monster, val[rd - 1]);
			localStorage.monHp = vm.monster.HP
			console.log(val[rd - 1])
		}
		$('.fightBoard').fadeIn(300);
	},

	//捕捉
	catchMon: function(obj) {
//		$(obj).attr('disabled', 'disabled');
		console.log(vm.myData.ballNum);
		if(parseInt(vm.myData.ballNum)>0 && vm.myData.ballNum!=undefined){
			vm.monster.ATK = parseInt(vm.monster.ATK);
			vm.monster.HP = parseInt(vm.monster.HP);
			vm.myData.DEF = parseInt(vm.myData.DEF);
			var myLosehp = vm.monster.ATK - vm.myData.DEF;
			vm.myData.HP -= myLosehp;
			myobj.adventInfo(vm.myData.HP,vm.monster.HP,myLosehp,0,0);
			var isCatch = 0;
			vm.myData.ballNum--;
			vm.monster.HP = parseInt(vm.monster.HP);
		var allHp = parseInt(localStorage.monHp);
		var str = vm.monster.canCatch.split('#');
		vm.monster.HP >= (allHp / 2) ? isCatch = myobj.oddsCount(str[0]) : isCatch = myobj.oddsCount(str[1]);
		isCatch ? isCatch = 1 : isCatch = 0;
		var postData = {
			myacco: localStorage.acco,
			num:vm.myData.ballNum,
			code: vm.monster.code,
			isCatch: isCatch
		};
		console.log(postData)
		myobj.postajax('/catchPet', postData);
		}else{
			mui.alert('你没有多余的精灵球');
		}
		
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
		vm.myData.petATK = parseInt(vm.myData.petATK);
		vm.myData.HP = parseInt(vm.myData.HP);
		if(vm.myData.ATK < vm.monster.DEF) {
			mui.alert('你打不动', function() {
				location.reload();
			});
		} else {
			var myAttack = vm.myData.ATK - vm.monster.DEF;
			var petAttack = vm.myData.petATK - vm.monster.DEF;
			petAttack > 0 ? petAttack = petAttack : petAttack = 0;
			vm.monster.HP -= myAttack + petAttack;
			var myLosehp = vm.monster.ATK - vm.myData.DEF;
			vm.myData.HP -= myLosehp;
			myobj.adventInfo(vm.myData.HP, vm.monster.HP, myLosehp, myAttack, petAttack);
		}
		console.log(vm.monster)
	},
	//冒险模式显示信息
	adventInfo: function(myhp, enenyhp, mylose, myAttack, petAttack) {
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
				var myDrop = myobj.oddsCount(vm.monster.drop[ramDom - 1].odds);
				if(myDrop) {
					myEqui = myobj.chgetData(vm.monster.drop[ramDom - 1].type, vm.monster.drop[ramDom - 1].code);
					vm.myDrop.push(myEqui);
				}
			}
			console.log(vm.myDrop, vm.addMoney)
		} else {

			$('.monData .imgbox').prepend("<span class='loseHp myattack'>-" + myAttack + "</span> ");
			$('.monData .imgbox').prepend("<span class='loseHp petattack'>-" + petAttack + "</span> ");
			$('.myData .imgbox:first').prepend("<span class='loseHp'>-" + mylose + "</span> ");
		}
	},
	//概率计算
	oddsCount: function(val) {
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
		judey == 'mat' ? data = myobj.getData(mymaterial, code) : data = myobj.getData(myEqui, code);
		return data;
	},
	//保存
	saveData: function() {
		var postData = {};
		var dropData = [];
		console.log(vm.myDrop)
		console.log(vm.myData)
		if(vm.myDrop.length) {
			for(i in vm.myDrop) {
				var bagHas = false;
				if(vm.myDrop[i].type == 'mat') {
					for(j in vm.myData.mat) {
						if(vm.myData.mat[j].code == vm.myDrop[i].code) {
							vm.myData.mat[j].num++;
							dropData.push(vm.myData.mat[j]);
							bagHas = true;
						}
					}
					if(!bagHas) {
						var data = {
							code: vm.myDrop[i].code,
							num: 1,
							type: vm.myDrop[i].type,
							myacco: vm.myData.myacco
						}
						dropData.push(data);
					}
				} else {
					var data = {
						inten: 0,
						useState: '0',
						code: vm.myDrop[i].code,
						type: vm.myDrop[i].type,
						myacco: vm.myData.myacco
					}
					dropData.push(data);
				}
			}
		}
		postData.money = parseInt(vm.myData.money) + parseInt(vm.addMoney);
		postData.myacco = vm.myData.myacco;
		postData.dropData = JSON.stringify(dropData);
		myobj.postajax("/saveData", postData);
	},
	
	//商品页面初始化
	shopBegin:function(){
		vm.matData = myobj.getData(mymaterial,myShop.matShop);
		vm.equiData = myobj.getData(myEqui,myShop.equiShop);
	},
	//强化
	intenEqui:function(obj){
		if ($('.intenBox .intensify').text()=="") {
			return mui.alert('请放置装备强化');
		}
		var mydata = JSON.parse(localStorage.mydata);
		if (mydata.inten == 10) {
			return mui.alert('该物品强化等级已经最高级！');
		}
		var data =	myobj.getData(intenData,mydata.inten);
		console.log(vm.myData);
		if (parseInt(vm.myData.intenNum)<data.needMat||vm.myData.intenNum == undefined ) {
			return mui.alert('请确认你有没有这么多强化材料！');
		}
		if ($(obj).attr('data-bool') == 0) {
			return;
		}
		var postData = {};
		postData._id = mydata._id;
		postData.myacco = localStorage.acco;
		
		var judey = myobj.oddsCount(data.odds);
		if (judey) {
			postData.intenState = 1;
			postData.inten = parseInt(mydata.inten)+1;
		}else{
			var judey = myobj.oddsCount(data.failOdds);
			if (judey) {
				postData.intenState = -1;
				postData.equiDown = data.failDown;
				postData.inten = parseInt(mydata.inten) - parseInt(data.failDown);
			}else{
				postData.intenState = 0;
				postData.inten = parseInt(mydata.inten);
			}
		}
		console.log(postData);
		myobj.postajax('/intenEqui',postData);
		$(obj).attr('data-bool',0);
	}
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
		isPet: true, //是否宠物
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
		usePet: {}, //使用宠物对象
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