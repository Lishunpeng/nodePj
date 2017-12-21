var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
var DB_CONN_STR = 'mongodb://localhost:27017/mytest'; //数据库为 mytest
http.createServer(function(req, res) {
	var pathname = url.parse(req.url, true).pathname;
	var backData = {};
	/*登录页面*/
	if(pathname == "/mylogin") {
		var myattr = null;
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			console.log(myattr);
			var whereAttr = {
				myacco: myattr.myacco
			}
			console.log(whereAttr)
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				console.log("连接成功！");

				selectData(db, whereAttr, function(result) {
					if(result.length) {
						if(result[0].mypassword == myattr.mypassword) {
							backData.msg="登录成功";
							backData.myacco=result[0].myacco;
							backData.name=result[0].name;
							res.end(JSON.stringify(backData));
						} else {
							backData.msg="密码错误";
							res.end(JSON.stringify(backData));
						}
					} else {
							backData.msg="用户名不存在";
						res.end(JSON.stringify(backData));
					}
					db.close();
				}, 'user');
			});
		});

		/*封装调用所有JS文件*/
	} else if(pathname.indexOf(".js") > 0) {
		fs.readFile('../js' + req.url, function(err, data) {
			res.writeHead(200, {
				"Content-type": "text/javascript"
			})
			res.end(data)
		});
		/*封装调用所有css文件*/
	} else if(pathname.indexOf(".css") > 0) {
		fs.readFile('../css' + req.url, function(err, data) {
			res.writeHead(200, {
				"Content-type": "text/css"
			})
			res.end(data)
		});
		/*默认页面*/
	} else if(pathname == "/") {
		fs.readFile('../index.html', 'utf8', function(err, data) {
			res.writeHead(200, {
				"Content-type": "text/html"
			})
			res.end(data)
		});
		/*封装调用所有html文件*/
	} else if(pathname.indexOf(".html") > 0) {
		fs.readFile('..' + req.url, 'utf8', function(err, data) {
			res.writeHead(200, {
				"Content-type": "text/html"
			})
			res.end(data)
		});
		/*注册页面*/
	} else if( pathname.indexOf(".png") > 0 || pathname.indexOf(".gif") > 0 || pathname.indexOf(".jpg") > 0) {
		fs.readFile('../img' + req.url, 'binary', function(err, data) {
			res.writeHead(200, {
				"Content-type": "image/jpeg"
			})
			res.write(data, 'binary')
			res.end()
			return;
			
		});
		/*注册页面*/
	} else if(pathname == "/firstlogin") {
		var myattr = null;
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			var whereAttr = {
				$or: [{
					myacco: myattr.myacco
				}, {
					name: myattr.name
				}]
			}
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				selectData(db, whereAttr, function(result) {
					if(result.length) {
						if(result[0].name == myattr.name) {
							backData.msg = "角色名已存在，请换一个角色名";
							return res.end(JSON.stringify(backData));
						} else if(result[0].myacco == myattr.myacco) {
							backData.msg = "用户已存在，请换个用户";
							return res.end(JSON.stringify(backData));
						}
					} else {
						//初始化所有数据
						var initData = {
							myacco: myattr.myacco,
							name: myattr.name,
							ATK: "10",
							DEF: "10",
							HP: "100",
							money:'10000000'
						};
						//初始化背包数据
						var equiCode = [
						{myacco: myattr.myacco,code:'000',type:'wea',useState:'1',inten:8,addAttr:30,getMoney:300},
						{myacco: myattr.myacco,code:'100',type:'clo',useState:'1',inten:8,addAttr:30,getMoney:400},
						{myacco: myattr.myacco,code:'200',type:'amu',useState:'1',inten:8,addAttr:300,getMoney:500}
						]
						var matCode = [
						{myacco: myattr.myacco,code:'00',type:'mat',num:5},
						{myacco: myattr.myacco,code:'01',type:'mat',num:3},
						{myacco: myattr.myacco,code:'02',type:'mat',num:2},
						{myacco: myattr.myacco,code:'05',type:'mat',num:1}
						]
						var petCode = [
						{myacco: myattr.myacco,code:'000',type:'pet',level:1,useState:'0',addAttr:13},
						{myacco: myattr.myacco,code:'001',type:'pet',level:1,useState:'0',addAttr:15},
						{myacco: myattr.myacco,code:'002',type:'pet',level:10,useState:'1',addAttr:18},
						{myacco: myattr.myacco,code:'003',type:'pet',level:1,useState:'0',addAttr:20}
						]
//						var friend = {friendAcco: 'a569133352',friendName:'哈哈哈',myacco: myattr.myacco}
						insertData(db, initData, function(result) {
							db.close();
						}, 'personInfo');
						insertData(db, myattr, function(result) {
							db.close();
						}, 'user');
						for (i in matCode) {
							insertData(db, matCode[i], function(result) {
							db.close();
						}, 'bag_mat');
						}
						for (i in equiCode) {
							insertData(db, equiCode[i], function(result) {
							db.close();
						}, 'bag_equi');
						}
						for (i in petCode) {
							insertData(db, petCode[i], function(result) {
							db.close();
						}, 'bag_pet');
						}
						backData.msg = "注册成功"
						res.end(JSON.stringify(backData));
					}
				}, 'user');
			});
		});
		/*首页获取ajax数据*/
	} else if(pathname == "/getInfo" || pathname == "/getGoods") {
		var params = url.parse(req.url, true).query;
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			if(pathname == "/getInfo") {
				selectData(db, params, function(result) {
					backData = result[0];
					db.close();
					res.end(JSON.stringify(backData));
				}, 'personInfo');
			} else if(pathname == "/getGoods") {
				selectData(db, params, function(result) {
					backData = result[0];
					db.close();
				}, 'personInfo');
				selectData(db, params, function(result) {
					backData.matCode = result;
					db.close();
				}, 'bag_mat');
				selectData(db, params, function(result) {
					backData.equiCode = result;
					db.close();
				}, 'bag_equi');
				selectData(db, params, function(result) {
					backData.petCode = result;
					db.close();
					res.end(JSON.stringify(backData));
				}, 'bag_pet');
			}
		});
	} else if(pathname == "/getRole") {
		var params = url.parse(req.url, true).query;
			var whereData = {
				myacco: params.myacco,
				useState:'1'
			}
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				selectData(db, params, function(result) {
					backData = result[0];
					db.close();
				}, 'personInfo');
				selectData(db, whereData,function(result) {
					backData.pet = result;
					db.close();
				}, 'bag_pet');
				selectData(db, params,function(result) {
					backData.mat = result;
					db.close();
				}, 'bag_mat');
				selectData(db,whereData,function(result) {
					backData.equi = result;
					db.close();
					console.log(backData)
					res.end(JSON.stringify(backData));
				},'bag_equi');
				
		});
		
	}else if(pathname == "/useEqui") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			backData = myattr;
			var whereData = {
				myacco: myattr.myacco,
				type:myattr.type
			}
			myattr.type=='pet' ? linkData = 'bag_pet':linkData = 'bag_equi';
			var selecData = {"_id" : ObjectId(myattr._id)}
			var selecUdData = {$set: {useState:'1'}}
			var udData = {$set: {useState:'0'}}
			console.log(selecData)
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				updateData(db, whereData,udData,function(result) {db.close();},linkData);
				updateData(db, selecData,selecUdData,function(result) {db.close();},linkData);
				backData.msg = '使用成功';
				res.end(JSON.stringify(backData));
			});
		});
	} else if(pathname == "/saleGoods") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			backData = myattr;
			myattr.type == 'mat'?dataLink = 'bag_mat':dataLink = 'bag_equi';
			var whereData = {
				myacco: myattr.myacco,
				_id:ObjectId(myattr._id)
			}
			var selemyInfo = {myacco: myattr.myacco}
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var udBag = {$set:{money:myattr.money}}
				updateData(db, selemyInfo, udBag, function(result) {db.close();},'personInfo');
				if(myattr.isRemove==1){
					console.log(whereData,dataLink);
					delData(db,whereData,function(result){
						backData.msg = '出售成功';
						res.end(JSON.stringify(backData))
						db.close();
					},dataLink);
				}else{
					var udBag = {$set:{num:myattr.num}}
					updateData(db, whereData, udBag, function(result) {
						backData.msg = '出售成功';
						res.end(JSON.stringify(backData))
						db.close();
					},dataLink);
				}
			});
		});
	}else if(pathname == "/saveData") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			myattr.dropData = JSON.parse(myattr.dropData);
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var whereData = {myacco: myattr.myacco}
				var udBag = {$set:{money: myattr.money}}
				backData.msg = '闯关成功';
				if (myattr.saveState) {
					backData.msg = '屠杀成功';
					delData(db, whereData, function(result) {db.close();}, 'onHoonData');
				}
				updateData(db, whereData, udBag, function(result) {db.close();}, 'personInfo');
				for (i in myattr.dropData) {
					if (myattr.dropData[i]._id) {
						var whereData = {
							myacco: myattr.myacco,
							"_id": ObjectId(myattr.dropData[i]._id)
						}
						var udBag = {$set:{num:myattr.dropData[i].num}}
						updateData(db, whereData, udBag, function(result) {db.close();}, 'bag_mat');
					}else{
						var dataLink = '';
						myattr.dropData[i].type == 'amu'?myattr.dropData[i].addAttr = createAttr(myattr.dropData[i].myclass)*10:myattr.dropData[i].addAttr = createAttr(myattr.dropData[i].myclass);
						myattr.dropData[i].type == 'mat'?dataLink = 'bag_mat':dataLink = 'bag_equi';
						myattr.dropData[i].type != 'mat'?myattr.dropData[i].getMoney = createAttr(myattr.dropData[i].myclass)*100:"";
						insertData(db,myattr.dropData[i], function(result) {db.close();}, dataLink);
					}		
				}
				res.end(JSON.stringify(backData));
			});
		});
	}else if(pathname == "/putdonwPet") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			backData = myattr;
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var whereData = {myacco: myattr.myacco,_id:ObjectId(myattr._id)}
				delData(db,whereData,function(result){
						backData.msg = '放生成功';
						res.end(JSON.stringify(backData));
						db.close();
					},'bag_pet');
			});
		});
	}else if(pathname == "/catchPet") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var whereData = {myacco: myattr.myacco,code:'05'}
				if (myattr.num==0) {
					delData(db,whereData,function(result){db.close();},'bag_mat');
				}else{
					var udData = {$set:{num:myattr.num}};
					updateData(db, whereData, udData, function(result) {db.close();},'bag_mat');
				}
				if (myattr.isCatch!=1) {
					backData.msg = '没抓住！再接再厉';
					backData.bool = 0;
					res.end(JSON.stringify(backData));
				}else{
					var insetData = {myacco: myattr.myacco,code:myattr.code,type:'pet',level:1,useState:'0'}
					insetData.addAttr = createAttr(myattr.myclass)+10;
					insertData(db,insetData,function(result){
						backData.msg = '抓住了！';
						backData.bool = 1;
						res.end(JSON.stringify(backData));
						db.close();
					},'bag_pet');
				}
			});
		});
	}else if(pathname == "/showBut") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			backData.money = myattr.money;
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var whereData = {myacco: myattr.myacco}
				var udData = {$set:{money:myattr.money}}
				updateData(db, whereData, udData, function(result) {db.close();}, 'personInfo');
				if (myattr.type == 'mat') {
					var whereData = {myacco: myattr.myacco,code:myattr.code,type:myattr.type}
					myattr.num = parseInt(myattr.num);
					var udData = {$inc:{num:myattr.num}};
					upsertData(db, whereData, udData, function(result) {db.close();}, 'bag_mat');
				}else{
					var inseData = {myacco: myattr.myacco,code:myattr.code,type:myattr.type,useState:'0',inten:0};
					myattr.type == 'amu'?inseData.addAttr = createAttr(myattr.myclass)*10:inseData.addAttr = createAttr(myattr.myclass);
					inseData.getMoney = createAttr(myattr.myclass)*100;
					insertData(db, inseData, function(result) {db.close();}, 'bag_equi');
				}
				backData.msg = '购买成功';
				res.end(JSON.stringify(backData));
			});
		});
	}else if(pathname == "/intenEqui") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			backData = myattr;
			myattr.num = parseInt(myattr.num);
			console.log(myattr);
			var seleData = {myacco: myattr.myacco,_id:ObjectId(myattr._id)}
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var udData = {};
				var whereData ={};
				var succStr = "";
				var failStr = "";
				var failDownStr = "";
				var dataLink="";
				if (myattr.type=='equi') {
					udData = {$set:{inten:myattr.inten}}
					whereData = {myacco: myattr.myacco,code:'06'}
					dataLink = "bag_equi";
					succStr = '强化成功';
					failStr = '强化失败,物品等级下降0级';
					failDownStr = '强化失败,物品等级下降'+myattr.equiDown+'级';
				}else{
					udData = {$set:{level:myattr.level}}
					whereData = {myacco: myattr.myacco,code:'07'}
					dataLink = "bag_pet";
					succStr = '升级成功';
					failStr = '升级失败,物品等级下降0级';
					failDownStr = '升级失败,物品等级下降'+myattr.equiDown+'级';
				}
				
				if (myattr.num==0) {
					delData(db,whereData,function(result){db.close();},'bag_mat');
				}else{
					var update = {$set:{num:myattr.num}};
					updateData(db, whereData, update, function(result) {db.close();},'bag_mat');
				}
				updateData(db, seleData, udData, function(result) {
					if (myattr.intenState==1) {
						backData.msg = succStr;
					}else if(myattr.intenState==0){
						backData.msg = failStr;
					}else{
						backData.msg = failDownStr;
					}
					res.end(JSON.stringify(backData));
				db.close();},dataLink);
			});
		});
	}else if(pathname == "/changeInten") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			console.log(myattr);
			var seleData_left = {myacco: myattr.myacco,_id:ObjectId(myattr.left_id)};
			var seleData_right = {myacco: myattr.myacco,_id:ObjectId(myattr.right_id)};
			var udData_left = {};
			var udData_right = {};
			var dataLink = "";
			var succStr = "";
			var failStr = "";
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var udData = {$set:{money:myattr.money}};
				var whereData = {myacco:myattr.myacco};
				updateData(db, whereData, udData, function(result) {db.close();},'personInfo');
				if (myattr.type == "equi") {
						udData_left = {$set:{inten:0}};
						udData_right = {$set:{inten:myattr.inten}};
						succStr = '熔铸成功';
						failStr = '熔铸失败,两件物品都消失了'
						dataLink = "bag_equi";
					}else{
						udData_left = {$set:{level:1}};
						udData_right = {$set:{level:myattr.level}};
						succStr = '融合成功';
						failStr = '融合失败,宠物都消失了'
						dataLink = "bag_pet";
				}
				if (myattr.changeState==1) {
					backData.msg = succStr;
					updateData(db,seleData_left,udData_left, function(result) {db.close();},dataLink);
					updateData(db,seleData_right,udData_right, function(result) {db.close();},dataLink);
				}else{
					backData.msg = failStr;
					delData(db, seleData_left, function(result) {db.close();},dataLink);
					delData(db, seleData_right, function(result) {db.close();},dataLink);
				}
				res.end(JSON.stringify(backData));
			});
		});
	}else if(pathname == "/evolution") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			console.log(myattr);
			backData = myattr;
			var seleData_left = {myacco: myattr.myacco,_id:ObjectId(myattr.left_id)};
			var seleData_right = {myacco: myattr.myacco,_id:ObjectId(myattr.right_id)};
			var dataLink = "";
			var succStr = "";
			var failStr = "";
			var inseData = null;
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				var udData = {$set:{money:myattr.money}};
				var whereData = {myacco:myattr.myacco};
				updateData(db, whereData, udData, function(result) {db.close();},'personInfo');
				if (myattr.type == "pet") {
						succStr = '进阶成功';
						failStr = '进阶失败,宠物都消失了';
						faillessStr = '进阶失败,宠物没有消失了';
						dataLink = "bag_pet";
						inseData = {myacco: myattr.myacco,code:myattr.newCode,type:myattr.type,useState:'0',level:myattr.level};
						inseData.addAttr = createAttr(myattr.myclass);
				}else{
						succStr = '锤炼成功';
						failStr = '锤炼失败,两件装备都消失了';
						faillessStr = '锤炼失败,装备没有消失了';
						dataLink = "bag_equi";
						inseData = {myacco: myattr.myacco,code:myattr.newCode,type:myattr.type,useState:'0',inten:myattr.inten};
						myattr.type == 'amu'?inseData.addAttr = createAttr(myattr.myclass)*10:inseData.addAttr = createAttr(myattr.myclass);
						inseData.getMoney = createAttr(myattr.myclass)*100;
				}
				if (myattr.succState==1) {
					backData.msg = succStr;
					insertData(db,inseData, function(result) {db.close();},dataLink);
					delData(db, seleData_left, function(result) {db.close();},dataLink);
					delData(db, seleData_right, function(result) {db.close();},dataLink);
				}else{
					if (myattr.lostState==1) {
						backData.msg = failStr;
						delData(db, seleData_left, function(result) {db.close();},dataLink);
						delData(db, seleData_right, function(result) {db.close();},dataLink);
					} else{
						backData.msg = faillessStr;
					}
					
				}
				res.end(JSON.stringify(backData));
			});
		});
	}else if(pathname == "/addFriend"){
		if (req.method.toLowerCase() == 'post') {
			console.log(121212121)
			req.on('data',function(attr){
			myattr = qs.parse(decodeURI(attr));
			if (myattr.state==1) {
				var seleData = {myacco:myattr.info};
				var selData = {friendAcco:myattr.info,myacco: myattr.myacco}
			}else{
				var seleData = {name:myattr.info};
				var selData = {friendName:myattr.info,myacco: myattr.myacco}
			}
			MongoClient.connect(DB_CONN_STR,function(err,db){
//				var data = [];
//				selectData(db,selData,function(result){data = result;db.close();},'myFriend');
				selectData(db,seleData,function(result){
//					console.log(data)
					if(result.length) {
//						if(data.length){
//							backData.msg = '好友已存在';
//							res.end(JSON.stringify(backData));
//						}else{
							var insertInfo = {friendAcco: result[0].myacco,friendName:result[0].name,myacco: myattr.myacco};
							insertData(db,insertInfo,function(result){
								backData.msg = '添加成功';
								res.end(JSON.stringify(backData));
								db.close();
							},'myFriend');
//						}
					} else {
						backData.msg="查找好友不存在";
						res.end(JSON.stringify(backData));
					}
					db.close();
				},'personInfo');
			})
		})
		}else{
			console.log(6678678678)
			var params = url.parse(req.url, true).query;
			console.log(params);
			MongoClient.connect(DB_CONN_STR,function(err,db){
				selectData(db,params,function(result){
					if(result.length) {
						res.end(JSON.stringify(result));
					} else {
						backData.msg="您的好友是空的";
						res.end(JSON.stringify(backData));
					}
					db.close();
				},'myFriend');
			})
		}
	}else if(pathname == "/delFriend"){
		req.on('data',function(attr){
			myattr = qs.parse(decodeURI(attr));
			MongoClient.connect(DB_CONN_STR,function(err,db){
				delData(db,myattr,function(result){
						backData.msg = '删除成功';
						res.end(JSON.stringify(backData));
						db.close();
				},'myFriend');
			})
		})
	}else if(pathname == "/getDeul"){
		var params = url.parse(req.url, true).query;
		var whereAttr = {
				$or: [{
					myacco: params.myacco
				}, {
					aaa: params.friendAcco
				}]
			}
		var selData = {
				"useState":"1",
				$or: [{
					myacco: params.myacco
				}, {
					aaa: params.friendAcco
				}]
			}
			console.log(whereAttr,'whereAttr');
			console.log(selData,'selData');
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			selectData(db,whereData, function(result) {
				backData = result;
				db.close();
			}, 'personInfo');
			selectData(db, selData,function(result) {
//				console.log(result)
				backData.pet = result;
				db.close();
			}, 'bag_pet');
			selectData(db,selData,function(result) {
				backData.equi = result;
				db.close();
				res.end(JSON.stringify(backData));
			},'bag_equi');
		});
	}else if(pathname == "/on_hoon"){
		if (req.method.toLowerCase() == 'post') {
			req.on('data',function(attr){
				myattr = qs.parse(decodeURI(attr));
				backData.money = myattr.money;
				backData.time = myattr.time;
				backData.val = myattr.val;
				MongoClient.connect(DB_CONN_STR,function(err,db){
					var whereData = {myacco: myattr.myacco};
					var udData = {$set:{money:myattr.money}};
					var setData = myattr;
					updateData(db, whereData, udData, function(result) {db.close();}, 'personInfo');
					insertData(db,setData,function(result) {db.close();}, 'onHoonData');
					backData.msg = '设定成功'
					res.end(JSON.stringify(backData));
				})
			})	
		}else{
			var params = url.parse(req.url, true).query;
			var whereData = {
				myacco: params.myacco,
				useState:'1'
			}
			MongoClient.connect(DB_CONN_STR,function(err,db){
				selectData(db, params, function(result) {
					backData = result[0];
					db.close();
				}, 'personInfo');
				selectData(db, whereData,function(result) {
					backData.pet = result;
					db.close();
				}, 'bag_pet');
				selectData(db,whereData,function(result) {
					backData.equi = result;
					db.close();
				},'bag_equi');
				selectData(db,params,function(result) {
					backData.mat = result;
					db.close();
				},'bag_mat');
				selectData(db,params, function(result) {
					backData.time = result[0];
					res.end(JSON.stringify(backData));
					db.close();
				}, 'onHoonData');
			})
		}
	}
}).listen(3000);
var insertData = function(db, mydata, callback, table) {
	var collection = db.collection(table);
	//插入数据
	collection.insert(mydata, function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
var selectData = function(db, mydata, callback, table) {
	var collection = db.collection(table);
	//查询数据
	collection.find(mydata).toArray(function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
//修改数据
var updateData = function(db, whereData, mydata,callback, table) {
	var collection = db.collection(table);
	//更新数据
	collection.update(whereData, mydata,{multi:true},function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
//修改数据如果没有的话增加新数据
var upsertData = function(db, whereData, mydata,callback, table) {
	var collection = db.collection(table);
	//更新数据
	collection.update(whereData, mydata,{upsert:true},{multi:true},function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
//删除数据
 var delData = function(db,whereData,callback,table) {  
  var collection = db.collection(table);
  //删除数据
  collection.remove(whereData, function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}
 
var createAttr = function(myclass){
	switch (myclass){
			case 'broke':return creatRodom(1,8);
				break;
			case 'ordin':return creatRodom(8,15);
				break;
			case 'green':return creatRodom(15,25);
				break;
			case 'blue':return creatRodom(25,35);
				break;
			case 'pink':return creatRodom(35,45);
				break;
			case 'red':return creatRodom(45,50);
				break;
			case 'purple':return creatRodom(50,55);
				break;	
			default:
				break;
		}
}

var creatRodom = function(min,max){
	var attrD = max - min;
	var rd = Math.ceil(Math.random() * attrD) + min;
	return rd;
}
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:3000/');