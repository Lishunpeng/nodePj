var numAl = /^[0-9a-zA_Z]+$/; //允许数字和英文
var re = /^[1-9]+\d*$/; //允许数字
var equiTypecount = 1; //定义装备判断数字位置
var search = window.location.pathname;
var hash = window.location.hash.replace("#", "");
var myFun = function() {}
var mytimer = null;
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
	postajax: function(path, mydata, obj) {
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
					$('.clickBox').hide();
					console.log(data)
					if(path == "/putdonwPet") {
						for(i in vm.petData) {
							if(vm.petData[i]._id == data._id) {
								vm.petData.splice(i, 1);
							}
						}
						return mui.alert(data.msg);
					}

					if(path == '/saleGoods') {
						mui.alert('获取：' + localStorage.getMoney + '元', data.msg);
						vm.myData.money = data.money;
						$('.money_Box').text('金币：' + data.money);
						if(localStorage.cur == 0 || localStorage.cur == "0") {
							for(i in vm.equiData) {
								if(vm.equiData[i]._id == data._id) {
									vm.equiData.splice(i, 1);
								}
							}
						} else if(localStorage.cur == 1 || localStorage.cur == "1") {
							for(i in vm.matData) {
								if(vm.matData[i]._id == data._id) {
									if(data.isRemove == 1 || data.isRemove == "1") {
										vm.matData.splice(i, 1);
									} else {
										vm.matData[i].num = data.num;
									}
								}
							}
						}
						console.log(vm.myData)
					} else {
						mui.alert(data.msg);
						if(localStorage.cur == 0 || localStorage.cur == "0") {
							for(i in vm.myData.equiCode) {
								if(vm.myData.equiCode[i].type == data.type) {
									if(vm.myData.equiCode[i]._id == data._id) {
										vm.myData.equiCode[i].useState = "1";
										localStorage.mydata = JSON.stringify(vm.myData.equiCode[i]);
									} else {
										vm.myData.equiCode[i].useState = "0";
									}
								}
							}
						} else {
							for(i in vm.myData.petCode) {
								if(vm.myData.petCode[i].type == data.type) {
									if(vm.myData.petCode[i]._id == data._id) {
										vm.myData.petCode[i].useState = "1";
										localStorage.mydata = JSON.stringify(vm.myData.petCode[i]);
									} else {
										vm.myData.petCode[i].useState = "0";
									}
								}
							}
						}
					}
				} else if(search == "/adventTG.html") {
					if(path == '/catchPet') {
						mui.alert(data.msg, function() {
							data.bool != 0 ? location.reload() : $('.a_catch').attr('disabled', false);
						})
					} else {
						location.reload();
					}

				} else if(search == "/myFriend.html") {
					$(obj).attr('disabled', false);
					mui.alert(data.msg, function() {
						if(data.msg == '查找好友不存在' || data.msg == '您和该用户已是好友') {
							return;
						} else {
							myobj.getajax("/addFriend?myacco=" + localStorage.acco);
						}
					});
				} else if(search == "/shop.html") {
					console.log(data);
					vm.myData.money = parseInt(data.money);
					mui.alert('花费了：' + localStorage.getMoney + '元', data.msg)
				} else if(search == "/intenEqui.html" || search == "/petLevel.html") {
					console.log(data)
					if(localStorage.cur == 1 || localStorage.cur == "1") {
						return mui.alert(data.msg, function() {
							location.reload()
						});
					} else if(localStorage.cur == 2 || localStorage.cur == "2") {
						if(data.succState == 1 || data.succState == '1') {
							return mui.alert(data.msg + '<br>获得了<span class=' + data.myclass + '>' + data.name + '<br></span>', function() {
								location.reload()
							});
						} else {
							return mui.alert(data.msg, function() {
								location.reload()
							});
						}
					}
					if(data.type == "equi") {
						for(i in vm.myData.equiCode) {
							if(vm.myData.equiCode[i]._id == data._id) {
								vm.myData.equiCode[i].inten = parseInt(data.inten);
								localStorage.mydata = JSON.stringify(vm.myData.equiCode[i]);
							}
						}

						vm.myData.intenNum = data.num;
						vm.myData.needNum = intenData[mydata.inten].needMat;
						$('.inten_info').html('需要强化石' + vm.myData.needNum + '<span style="color: #EC971F;">(' + vm.myData.intenNum + ')</span>个').show();
						$('.intenBox .intensify').text('+' + data.inten);
					} else {
						for(i in vm.myData.petCode) {
							if(vm.myData.petCode[i]._id == data._id) {
								vm.myData.petCode[i].level = data.level;
								localStorage.mydata = JSON.stringify(vm.myData.petCode[i]);
							}
						}
						vm.myData.levelNum = data.num;
						vm.myData.needNum = levelData[mydata.level].needMat;
						$('.inten_info').html('需要强化石' + vm.myData.needNum + '<span style="color: #EC971F;">(' + vm.myData.levelNum + ')</span>个').show();
						$('.intenBox .intensify').text('+' + data.level);
					}
					mui.alert(data.msg, function() {
						$('.intenBtn').eq(0).attr('data-bool', 1);
					});
				} else if(search == '/adventure.html') {
					console.log(data)
					vm.myData.money = data.money;
					vm.myData.isStart = true;
					$(obj).val('屠杀中...');
					data.val = parseInt(data.val);
					var p = $('.chooseDiff li').eq(data.val).children('p');
					console.log(p)
					myobj.timeAuto(data.time, 0, 0, p);
					return mui.toast(data.msg);
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
				$('.loading').remove();
				path = path.split('?')[0];
				vm.myData = JSON.parse(data);
				console.log(vm.myData)
				if(search == "/GameTest.html" || search == "/beginAdven.html") {
					console.log(vm.myData)
				} else if(search == "/mybag.html" || search == "/intenEqui.html" || search == '/petLevel.html') {
					vm.equiData = myobj.getData(myEqui, vm.myData.equiCode);
					vm.petData = myobj.getData(myPet, vm.myData.petCode);
					vm.matData = myobj.getData(mymaterial, vm.myData.matCode);
					if(search == "/intenEqui.html") {
						vm.myData.intenNum = myobj.getOneData(vm.myData.matCode, '06');
					} else if(search == "/petLevel.html") {
						vm.myData.levelNum = myobj.getOneData(vm.myData.matCode, '07');
					}
				} else if(search == "/gameRole.html") {
					myobj.generateData();
				} else if(search == "/adventTG.html") {
					myobj.generateData();
					vm.myData.ballNum = myobj.getOneData(vm.myData.mat, '05');
				} else if(search == '/adventure.html') {
					myobj.generateData();
					if(vm.myData.time) {
						var data = vm.myData.time;
						var timestamp = Date.parse(new Date());
						var endTime = parseInt(data.endtime);
						var timeD = endTime - timestamp;
						if(timeD < 0) {
							return mui.alert('时间到');
						} else {
							vm.myData.isStart = true;
							var index = parseInt(data.val);
							var needTime = myobj.secondChange(timeD/1000);
							needTime = needTime.split(':');
							console.log(needTime)
							$('.adventBtn').attr('disabled','disabled').val('屠杀中...');
							var p = $('.chooseDiff li').eq(index).children('p');
							$('.chooseDiff li').eq(index).children('span').addClass('true');
							myobj.timeAuto(needTime[0],needTime[1],needTime[2],p);
						}
						console.log(true);
					} else {
						console.log(false);
					}
				} else if(search == '/myFriend.html') {
					if(vm.myData.msg) {
						vm.hasFriend = false;
					} else {
						vm.hasFriend = true;
					}
					//					console.log(data.msg);
				}

			}
		})
	},
	//生成总数据（ATK,DEF,HP,PET）
	generateData: function() {
		vm.equiData = myobj.getData(myEqui, vm.myData.equi);
		vm.petData = myobj.getData(myPet, vm.myData.pet);
		vm.myData.petATK = vm.petData[0].myAttr;
		vm.myData.petName = vm.petData[0].goods.name;
		vm.myData.petimgPath = vm.petData[0].goods.imgPath;
		for(i in vm.equiData) {
			if(vm.equiData[i].type == 'wea') {
				vm.myData.ATK = parseInt(vm.equiData[i].myAttr) + parseInt(vm.myData.ATK);
			} else if(vm.equiData[i].type == 'clo') {
				vm.myData.DEF = parseInt(vm.equiData[i].myAttr) + parseInt(vm.myData.DEF);
			} else if(vm.equiData[i].type == 'amu') {
				vm.myData.HP = parseInt(vm.equiData[i].myAttr) + parseInt(vm.myData.HP);
			}
		}
		vm.power = (parseInt(vm.myData.ATK) * 0.3 + parseInt(vm.myData.petATK) * 0.3 + parseInt(vm.myData.DEF) * 0.2 + parseInt(vm.myData.HP) * 0.02).toFixed(1);
	},
	isArray: function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	//数据代码类型转换数据
	getData: function(dataBase, obj) {
		var data = [];
		if(myobj.isArray(obj)) {
			for(i in obj) {
				if(obj[i].inten != undefined) {
					var myAttr = intenData[parseInt(obj[i].inten)].intenAttr * obj[i].addAttr;
					obj[i].myAttr = parseInt(myAttr);
				}
				if(obj[i].level != undefined) {
					var myAttr = levelData[parseInt(obj[i].level) - 1].levelAttr * obj[i].addAttr;
					obj[i].myAttr = parseInt(myAttr);
				}
				for(j in dataBase) {
					if(obj[i].code == dataBase[j].code) {
						var myData = {}
						myData = obj[i];
						myData.goods = dataBase[j];
						data.push(myData);
					}
				}
			}
			//			console.log(data)
			return data;
		} else {
			for(i in dataBase) {
				console.log(obj);
				if(obj == dataBase[i].code) {
					return dataBase[i];
				}
			}
		}

	},
	//数据代码分离出单个值
	getOneData: function(obj, code) {
		for(i in obj) {
			if(obj[i].code == code) {
				return obj[i].num;
			}
		}
	},
	//切换背包
	changeBag: function() {
		$(".bagClass li").on("click", function() {
			console.log($(this).index());
			localStorage.cur = $(this).index()
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".bagDetail>li").eq($(this).index()).addClass("cur").siblings("li").removeClass("cur");
		})
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
	//好友列表中显示框
	friendListClick: function(obj, ev) {
		var oev = ev || event;
		oev.cancelBubble = true;
		localStorage.friendAcco = $(obj).attr('data-acco');
		if($(obj).attr('data-mydata')) {
			localStorage.mydata = $(obj).attr('data-mydata')
		}
		$('.clickBox').css({
			top: oev.clientY,
			left: oev.clientX,
			display: "block"
		});
	},
	//查看好友信息
	searchFriend: function() {
		window.location.href = "gameRole.html#" + localStorage.friendAcco;
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
	clickBox_detail: function(obj) {
		var mydata = {};
		var str1 = "";
		var str = "";
		obj ? mydata = JSON.parse($(obj).attr('data-data')) : mydata = JSON.parse(localStorage.mydata);
		if(mydata.type != 'mat') {
			mydata.type == 'pet' ? str1 = '<br>宠物等级：' + mydata.level : str1 = '<br>强化等级：' + mydata.inten;
			if(mydata.type == 'wea' || mydata.type == 'pet') {
				mydata.belone = 'ATK';
			} else if(mydata.type == 'clo') {
				mydata.belone = 'DEF';
			} else if(mydata.type == 'amu') {
				mydata.belone = 'HP';
			}
		}
		mydata.myAttr ? str = '物品：<span class=' + mydata.goods.myclass + '>' + mydata.goods.name + '</span>\n' + mydata.belone + ':+' + mydata.myAttr + '<span style="color:#f0ad4e">(初始：' + mydata.addAttr + ')</span>' + '\n阐述：' + mydata.goods.detail :
			str = '物品：<span class=' + mydata.goods.myclass + '>' + mydata.goods.name + '</span>\n阐述：' + mydata.goods.detail;
		mui.alert(str + str1);
		$('.mui-popup-text').addClass("mui-popup-left");
	},
	//冒险模式查看信息
	clickBox_searInfo: function() {
		var mydata = JSON.parse(localStorage.mydata);
		console.log(mydata)
		var str = '挂机时间:<span style="color:#d69c33">' + mydata.time + '</span>小时\n' +
			'进攻次数:<span style="color:#d69c33">' + mydata.limit + '</span>次\n' +
			'条件（战斗力范围）:<span style="color:#d69c33">' + mydata.if_ATK + '</span>\n' +
			'所需金币:<span style="color:#d69c33">' + mydata.needMoney + '元</span>\n' +
			'奖励：<span style="color:#ff0000">' + mydata.detail
		mui.alert(str) + '</span>';
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
	clickBox_intentPut: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.useState == 1) {
			return mui.alert('物品使用中');
		} else {
			if(localStorage.cur == 0) {
				$('.intenBox .equi').css('backgroundImage', 'url(' + mydata.goods.imgPath + ')');
				console.log(search)
				if(search == "/intenEqui.html") {
					$('.intenBox .intensify').text('+' + mydata.inten);
					var data = intenData[mydata.inten];
					vm.myData.needNum = data.needMat;
					vm.myData.intenNum == undefined ? vm.myData.intenNum = 0 : "";
					$('.inten_info').html('需要强化石' + vm.myData.needNum + '<span style="color: #EC971F;">(' + vm.myData.intenNum + ')</span>个').show();
				} else {
					$('.intenBox .intensify').text('+' + mydata.level);
					var data = levelData[mydata.level - 1];
					vm.myData.needNum = data.needMat;
					vm.myData.levelNum == undefined ? vm.myData.levelNum = 0 : "";
					$('.inten_info').html('需要升级石' + vm.myData.needNum + '<span style="color: #EC971F;">(' + vm.myData.levelNum + ')</span>个').show();
				}

			} else if(localStorage.cur == 1) {
				mui.confirm('放置左边还是右边', '提示', ['左边', '右边'], function(e) {
					if(e.index) {
						console.log(mydata.level)
						$('.change_inten .equi').css('backgroundImage', 'url(' + mydata.goods.imgPath + ')');
						search == "/intenEqui.html" ? $('.change_inten .intensify').text('+' + mydata.inten) : $('.change_inten .intensify').text(mydata.level + '级');
						$('.change_inten .intensify').attr('data-data', localStorage.mydata);
					} else {
						$('.put_inten .equi').css('backgroundImage', 'url(' + mydata.goods.imgPath + ')');
						search == "/intenEqui.html" ? $('.put_inten .intensify').text('+' + mydata.inten) : $('.put_inten .intensify').text(mydata.level + '级');
						$('.put_inten .intensify').attr('data-data', localStorage.mydata);
					}
				})
			} else if(localStorage.cur == 2) {
				mui.confirm('放置左边还是右边', '提示', ['左边', '右边'], function(e) {
					if(!e.index) {
						$('.left_evo .equi').css('backgroundImage', 'url(' + mydata.goods.imgPath + ')');
						search == "/intenEqui.html" ? $('.left_evo .intensify').text('+' + mydata.inten) : $('.left_evo .intensify').text(mydata.level + '级');
						$('.left_evo .intensify').attr('data-data', localStorage.mydata);
					} else {
						$('.right_evo .equi').css('backgroundImage', 'url(' + mydata.goods.imgPath + ')');
						search == "/intenEqui.html" ? $('.right_evo .intensify').text('+' + mydata.inten) : $('.right_evo .intensify').text(mydata.level + '级');
						$('.right_evo .intensify').attr('data-data', localStorage.mydata);
					}
					if($('.left_evo .intensify').text() && $('.right_evo .intensify').text()) {
						var mydataLeft = JSON.parse($('.left_evo .intensify').attr('data-data'));
						var mydataRight = JSON.parse($('.right_evo .intensify').attr('data-data'));
						var data = myobj.getData(evolData, mydataLeft.goods.myclass);
						if(mydataLeft.goods.myclass != mydataRight.goods.myclass) {
							$('.evo_info').text('两个物品不是同种颜色属性类型');
						} else {
							$('.evo_info').html('需要$' + data.needMoney + '元<span style="color: #EC971F;">(' + vm.myData.money + ')</span>');
						}

					}
				})

			}

		}
	},
	//物品出售
	clickBox_sale: function() {
		console.log(vm.myData)
		var isRemove = 1;
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.goods.getMoney || mydata.getMoney) {
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

		if(type == 'mat') {
			localStorage.getMoney = mydata.goods.getMoney * val;
			postData.money = parseInt(vm.myData.money) + parseInt(mydata.goods.getMoney * val);
		} else {
			localStorage.getMoney = mydata.getMoney * val;
			postData.money = parseInt(vm.myData.money) + parseInt(mydata.getMoney * val);
		}

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
	clickBox_butIt: function() {
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.type == 'mat') {
			mui.prompt('请输入你购买的数量', function(e) {
				if(e.index == 0) {
					return mui.alert('购买失败！');
				} else if(!re.test(e.value)) {
					return mui.alert('请输入正确正整数数量');
				} else if(e.index == 1) {
					myobj.butPost(e.value);
				}
			});
		} else {
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
	butPost: function(num) {
		var postData = {};
		var mydata = JSON.parse(localStorage.mydata);
		localStorage.getMoney = parseInt(mydata.useMoney) * num;
		postData.money = parseInt(vm.myData.money) - parseInt(localStorage.getMoney);
		if(postData.money < 0) {
			return mui.alert('请确定你有没有那么多钱');
		}
		postData.myacco = localStorage.acco;
		postData.code = mydata.code;
		postData.myclass = mydata.goods.myclass;
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
		if(rdConut <= 5) {
			vm.monster = myobj.getData(monster, lastVal);
		} else {
			var rd = Math.ceil(Math.random() * val.length);
			vm.monster = myobj.getData(monster, val[rd - 1]);
			localStorage.monHp = vm.monster.HP
			console.log(val[rd - 1])
		}
		switch(vm.monster.myclass) {
			case 'broke':
				myobj.mon_creatAttr(10, 20, 1, 5, 1, '20#40');
				break;
			case 'ordin':
				myobj.mon_creatAttr(20, 50, 3, 7, 2, '10#25');
				break;
			case 'green':
				myobj.mon_creatAttr(50, 100, 5, 10, 2, '5#20');
				break;
			case 'blue':
				myobj.mon_creatAttr(100, 150, 10, 20, 3, '5#15');
				break;
			case 'pink':
				myobj.mon_creatAttr(150, 300, 20, 40, 4, '2#10');
				break;
			case 'red':
				myobj.mon_creatAttr(300, 350, 40, 80, 5, '1#8');
				break;
			case 'purple':
				myobj.mon_creatAttr(350, 500, 80, 100, 6, '0#5');
				break;
			default:
				break;
		}
		console.log(vm.monster);
		$('.fightBoard').fadeIn(300);
		$(document.body).css('overflow', 'hidden');
	},
	//怪物属性生成
	mon_creatAttr: function(minAttr, maxAttr, minMoney, maxMoney, dropGoods, catchOdds) {
		var attrD = maxAttr - minAttr;
		var moneyD = maxMoney - minMoney;
		vm.monster.dropGoods = dropGoods;
		vm.monster.catchOdds = catchOdds;
		vm.monster.dropMoney = (Math.ceil(Math.random() * attrD) + minMoney) * 100;
		vm.monster.ATK = Math.ceil(Math.random() * attrD) + minAttr; //攻击力生成随机数
		vm.monster.DEF = Math.ceil(Math.random() * attrD) + minAttr;
		vm.monster.HP = 10 * (Math.ceil(Math.random() * attrD) + minAttr);
	},
	//捕捉
	catchMon: function(obj) {
		//		$(obj).attr('disabled', 'disabled');
		console.log(vm.myData.ballNum);
		if(parseInt(vm.myData.ballNum) > 0 && vm.myData.ballNum != undefined) {
			vm.monster.ATK = parseInt(vm.monster.ATK);
			vm.monster.HP = parseInt(vm.monster.HP);
			vm.myData.DEF = parseInt(vm.myData.DEF);
			var myLosehp = vm.monster.ATK - vm.myData.DEF;
			myLosehp > 0 ? myLosehp = myLosehp : myLosehp = 1;
			vm.myData.HP -= myLosehp;
			myobj.adventInfo(vm.myData.HP, vm.monster.HP, myLosehp, 0, 0);
			var isCatch = 0;
			vm.myData.ballNum--;
			vm.monster.HP = parseInt(vm.monster.HP);
			var allHp = parseInt(localStorage.monHp);
			var str = vm.monster.catchOdds.split('#');
			vm.monster.HP >= (allHp / 3.3) ? isCatch = myobj.oddsCount(str[0]) : isCatch = myobj.oddsCount(str[1]);
			isCatch ? isCatch = 1 : isCatch = 0;
			var postData = {
				myacco: localStorage.acco,
				myclass: vm.monster.myclass,
				num: vm.myData.ballNum,
				code: vm.monster.code,
				isCatch: isCatch
			};
			console.log(postData)
			myobj.postajax('/catchPet', postData);
		} else {
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
			petAttack > 0 ? petAttack = petAttack : petAttack = 1;
			vm.monster.HP -= myAttack + petAttack;
			var myLosehp = vm.monster.ATK - vm.myData.DEF;
			myLosehp > 0 ? myLosehp = myLosehp : myLosehp = 1;
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
			var str = $('.winnerBox .winnerBorder').css('height');
			str = parseInt(str.replace('px', "")) / 2;
			$('.winnerBox .winnerBorder').css('top', 'calc(50% - ' + str + 'px)');
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
			$('.monHp').text(vm.monster.HP);
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
						myclass: vm.myDrop[i].myclass,
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
	shopBegin: function() {
		vm.matData = myobj.getData(mymaterial, myShop.matShop);
		vm.equiData = myobj.getData(myEqui, myShop.equiShop);
	},
	//升级
	levelPet: function(obj) {
		if($(obj).attr('data-bool') == 0) {
			return;
		}
		if($('.intenBox .intensify').text() == "") {
			return mui.alert('请放置宠物进行升级');
		}
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.level == 10) {
			return mui.alert('该宠物已经是最高级！');
		}
		var data = levelData[mydata.level - 1];
		console.log(data)
		console.log(vm.myData);
		if(parseInt(vm.myData.levelNum) < data.needMat || vm.myData.levelNum == undefined) {
			return mui.alert('请确认你有没有这么多升级材料！');
		}
		var postData = {};
		postData._id = mydata._id;
		postData.myacco = localStorage.acco;
		postData.num = parseInt(vm.myData.levelNum) - data.needMat;
		var judey = myobj.oddsCount(data.odds);
		if(judey) {
			postData.intenState = 1;
			postData.level = parseInt(mydata.level) + 1;
		} else {
			var judey = myobj.oddsCount(data.failOdds);
			if(judey) {
				postData.intenState = -1;
				postData.equiDown = data.failDown;
				postData.level = parseInt(mydata.level) - parseInt(data.failDown);
			} else {
				postData.intenState = 0;
				postData.level = parseInt(mydata.level);
			}
		}
		postData.type = 'pet';
		console.log(postData);
		myobj.postajax('/intenEqui', postData);
		$(obj).attr('data-bool', 0);
	},
	//强化
	intenEqui: function(obj) {
		if($(obj).attr('data-bool') == 0) {
			return;
		}
		if($('.intenBox .intensify').text() == "") {
			return mui.alert('请放置装备强化');
		}
		var mydata = JSON.parse(localStorage.mydata);
		if(mydata.inten == 10) {
			return mui.alert('该物品强化等级已经最高级！');
		}
		var data = intenData[mydata.inten];
		console.log(vm.myData);
		if(parseInt(vm.myData.intenNum) < data.needMat || vm.myData.intenNum == undefined) {
			return mui.alert('请确认你有没有这么多强化材料！');
		}

		var postData = {};
		postData._id = mydata._id;
		postData.myacco = localStorage.acco;
		postData.num = parseInt(vm.myData.intenNum) - data.needMat;
		var judey = myobj.oddsCount(data.odds);
		if(judey) {
			postData.intenState = 1;
			postData.inten = parseInt(mydata.inten) + 1;
		} else {
			var judey = myobj.oddsCount(data.failOdds);
			if(judey) {
				postData.intenState = -1;
				postData.equiDown = data.failDown;
				postData.inten = parseInt(mydata.inten) - parseInt(data.failDown);
			} else {
				postData.intenState = 0;
				postData.inten = parseInt(mydata.inten);
			}
		}
		postData.type = 'equi';
		console.log(postData);
		myobj.postajax('/intenEqui', postData);
		$(obj).attr('data-bool', 0);
	},
	//熔铸
	change_inten: function(obj) {
		if($(obj).attr('data-bool') == 0) {
			return;
		}
		if(!$('.put_inten .intensify').attr('data-data') || !$('.change_inten .intensify').attr('data-data')) {
			return mui.alert('框内不能为空');
		}
		var mydataLfte = JSON.parse($('.put_inten .intensify').attr('data-data'));
		var mydataRight = JSON.parse($('.change_inten .intensify').attr('data-data'));
		console.log(mydataLfte, "mydataLfte")
		console.log(mydataRight, "mydataRight")
		if(mydataLfte._id == mydataRight._id) {
			return mui.alert('两者不能是同个装备')
		}
		if(parseInt(vm.myData.money) < 200000) {
			return mui.alert('请确认你有没有这么多钱');
		}
		var postData = {};
		postData.money = parseInt(vm.myData.money) - 200000;
		var judey = myobj.oddsCount(80);
		judey ? postData.changeState = 1 : postData.changeState = 0;
		postData.inten = mydataLfte.inten;
		postData.left_id = mydataLfte._id;
		postData.right_id = mydataRight._id;
		postData.myacco = localStorage.acco;
		postData.type = "equi";
		myobj.postajax('/changeInten', postData);
		$(obj).attr('data-bool', 0);
	},
	//融合
	fusePet: function(obj) {
		if($(obj).attr('data-bool') == 0) {
			return;
		}
		if(!$('.put_inten .intensify').attr('data-data') || !$('.change_inten .intensify').attr('data-data')) {
			return mui.alert('框内不能为空');
		}
		var mydataLfte = JSON.parse($('.put_inten .intensify').attr('data-data'));
		var mydataRight = JSON.parse($('.change_inten .intensify').attr('data-data'));
		console.log(mydataLfte, "mydataLfte")
		console.log(mydataRight, "mydataRight")
		if(mydataLfte._id == mydataRight._id) {
			return mui.alert('两者不能是同个宠物')
		}
		if(parseInt(vm.myData.money) < 200000) {
			return mui.alert('请确认你有没有这么多钱');
		}
		var postData = {};
		postData.money = parseInt(vm.myData.money) - 200000;
		var judey = myobj.oddsCount(80);
		judey ? postData.changeState = 1 : postData.changeState = 0;
		postData.level = mydataLfte.level;
		postData.left_id = mydataLfte._id;
		postData.right_id = mydataRight._id;
		postData.myacco = localStorage.acco;
		postData.type = "pet";
		console.log(postData);
		myobj.postajax('/changeInten', postData);
		$(obj).attr('data-bool', 0);
	},
	//宠物合体
	evolutionPet: function(obj, val) {
		if($(obj).attr('data-bool') == 0) {
			return;
		}
		if(!$('.left_evo .intensify').attr('data-data') || !$('.right_evo .intensify').attr('data-data')) {
			return mui.alert('框内不能为空');
		}
		var getEvol = null;
		var str1 = "";
		var str2 = "";

		var mydataLfte = JSON.parse($('.left_evo .intensify').attr('data-data'));
		var mydataRight = JSON.parse($('.right_evo .intensify').attr('data-data'));
		console.log(mydataLfte, "mydataLfte")
		console.log(mydataRight, "mydataRight")
		var postData = {};
		if(val == 'pet') {
			getEvol = myobj.getData(evolData, mydataLfte.goods.myclass);
			mydataLfte.level > mydataRight.level ? postData.level = mydataLfte.level : postData.level = mydataRight.level;
			str1 = "两者不能是同个宠物";
		} else {
			str1 = "两者不能是同类装备";
			getEvol = myobj.getData(evolData, mydataLfte.goods.myclass);
			mydataLfte.inten > mydataRight.inten ? postData.inten = mydataLfte.inten : postData.inten = mydataRight.inten;
		}
		if(mydataLfte._id == mydataRight._id) {
			return mui.alert(str1)
		}
		if(mydataLfte.goods.myclass != mydataRight.goods.myclass) {
			return mui.alert('两者必须是同种颜色类型的物品')
		}

		console.log(getEvol);

		postData.money = parseInt(vm.myData.money) - getEvol.needMoney;
		var judey = myobj.oddsCount(getEvol.odds);
		if(judey) {
			var myClass = [];
			postData.succState = 1;
			postData.lostState = 0;
			if(val == 'pet') {
				for(i in myPet) {
					if(myPet[i].myclass == getEvol.nextClass) {
						myPet[i].type = 'pet';
						myClass.push(myPet[i]);
					}
				}
			} else {
				for(i in myEqui) {
					if(myEqui[i].myclass == getEvol.nextClass) {
						myClass.push(myEqui[i]);
					}
				}
			}

			var arrCount = Math.round(Math.random() * myClass.length);
			postData.newCode = myClass[arrCount].code;
			postData.type = myClass[arrCount].type;
			postData.myclass = getEvol.nextClass;
			postData.name = myClass[arrCount].name;
		} else {
			postData.type = val;
			postData.succState = 0;
			var myjudey = myobj.oddsCount(getEvol.loseOdds);
			myjudey ? postData.lostState = 1 : postData.lostState = 0;
		}
		postData.left_id = mydataLfte._id;
		postData.right_id = mydataRight._id;
		postData.myacco = localStorage.acco;
		console.log(postData);
		myobj.postajax('/evolution', postData);
		$(obj).attr('data-bool', 0);
	},
	//添加好友
	addFriend: function(obj) {
		var postData = {};
		if(!vm.friendInfo) {
			return mui.alert('信息不能为空');
		}

		postData.state = $('.searchBox option:selected').val();
		for(i in vm.myData) {
			if(postData.state == 2) {
				if(vm.friendInfo == vm.myData[i].friendName) {
					return mui.alert('您已添加了该好友');
				}
			} else {
				if(vm.friendInfo == vm.myData[i].friendAcco) {
					return mui.alert('您已添加了该好友');
				}
			}
		}
		postData.info = vm.friendInfo;
		postData.myacco = localStorage.acco;
		myobj.postajax('/addFriend', postData, obj);
		$(obj).attr('disabled', 'disabled');
	},
	delFriend: function(obj) {
		var postData = {};
		postData.friendAcco = $(obj).attr('data-acco');
		postData.myacco = localStorage.acco;
		myobj.postajax('/delFriend', postData, obj);
		$(obj).attr('disabled', 'disabled');
	},
	deul: function(obj) {
		myobj.onceAjax("/getDeul?myacco =" + localStorage.acco + '&friendAcco = ' + $(obj).attr('data-acco'));
		//		$('.fightBoard').fadeIn(300);
		//		$(document.body).css('overflow', 'hidden');
	},
	//二次ajax
	onceAjax: function(path) {
		mui.ajax({
			url: path,
			type: 'get',
			success: function(data) {
				console.log(data)
			}
		})
	},
	//挂机地区
	on_hoon: function() {
		vm.advent = on_hookData;
		console.log(vm.myData)
	},
	adventChoose: function() {
		if(vm.myData.isStart) {
			return mui.alert('屠杀还在进行中...');
		}
		$('.chooseDiff li span').removeClass('true');
		$('.chooseDiff li span').eq(localStorage.friendAcco).addClass('true');
	},
	//选中挂机地区并确定
	on_hoonEnsure: function(obj) {
		var mydata = null;
		$('.chooseDiff li span').each(function(index, e) {
			if($(e).hasClass('true')) {
				mydata = JSON.parse($(e).parents('li').attr('data-mydata'));
			}
		})
		if(!mydata) {
			return mui.alert('请选择屠杀场地！')
		}
		var atkRange = mydata.if_ATK.split('-');
		if(vm.power < parseInt(atkRange[0])) {
			return mui.alert('您的战斗力不够');
		}
		if(vm.myData.money < mydata.needMoney) {
			return mui.alert('钱不够');
		}
		$(obj).attr('disabled', 'disabled').val('屠杀中...');
		var postData = {};
		var timestamp = Date.parse(new Date());
		postData.endtime = mydata.time * 3600 * 1000 + timestamp;
		postData.nowTime = timestamp;
		postData.limit = mydata.limit;
		postData.drop = mydata.drop;
		postData.time = mydata.time;
		postData.val = mydata.val;
		postData.myacco = localStorage.acco;
		postData.money = vm.myData.money - mydata.needMoney;
		console.log(postData)
		myobj.postajax('/on_hoon', postData, obj);
	},
	//时间走动
	timeAuto: function(h, m, s, obj) {
		mytimer = setInterval(function() {
			if(s == 0) {
				if(m == 0) {
					if(h == 0) {
						clearInterval(mytimer);
						return mui.alert('时间到');
					}
					h--;
					m = 60;
				}
				m--;
				s = 60;
			}
			s--;
			var str = h + ':' + m + ':' + s;
			$(obj).text(str);
		}, 1000);
	},
	//秒转化成时分秒
	secondChange: function(val) {
		var s = parseInt(val);
		var m = 0;
		var h = 0;
		if(s > 60) {
			m = parseInt(s / 60);
			s = parseInt(s % 60);
			if(m > 60) {
				h = parseInt(m / 60);
				m = parseInt(m % 60);
			}
		}
		return h+':'+m+':'+s;
	}

}
var myobj = new myFun();
var vm = new Vue({
	el: '#login,#firstLogin,#info,#bagData,#advenContent,#bagInfo,#choosePass,#advenTG',
	data: {
		dataPush: [], //ajax请求多次转化数组
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
		equDrop: [], //装备掉落
		friendInfo: '', //添加好友的信息
		hasFriend: false, //判断是否有好友数据
		power: '' //总能力（30%ATK+30%PET+20%DEF+20HP）
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

$('.loading').css('background',"transparent");