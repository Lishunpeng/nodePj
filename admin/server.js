var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
var DB_CONN_STR = 'mongodb://localhost:27017/mytest'; //数据库为 mytest
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var backData = {};
/*登录页面*/
app.post('/mylogin', function (req, res) {
   var myattr = req.body;
	var whereAttr = {
		myacco: myattr.myacco
	}
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		selectData(db, whereAttr, function(result) {
		if(result.length) {
			if(result[0].mypassword == myattr.mypassword) {
				backData.msg="登录成功";
				backData.myacco=result[0].myacco;
				backData.name=result[0].name;
				res.send(JSON.stringify(backData));
			} else {
				backData.msg="密码错误";
				res.send(JSON.stringify(backData));
			}
		} else {
			backData.msg="用户名不存在";
			res.send(JSON.stringify(backData));
			}
			db.close();
		}, 'user');
	});
});
app.post('/firstlogin',function(req, res){
		var myattr = req.body;
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
							return res.send(JSON.stringify(backData));
						} else if(result[0].myacco == myattr.myacco) {
							backData.msg = "用户已存在，请换个用户";
							return res.send(JSON.stringify(backData));
						}
					} else {
						//初始化所有数据
						var initData = {
							myacco: myattr.myacco,
							name: myattr.name,
							headPath:'headImg/000.jpg',
							ATK: "10",//攻击力
							DEF: "10",//防御力
							HP: "100",//血量
							DOD:'10',//闪避
							HIT:'10',//命中力
							CRI:'10',//暴击率
							TOU:'10',//韧性
							CRH:'10',//暴击伤害
							money:'100000000'
						};
						//初始化背包数据
						var goods = [
							{myacco: myattr.myacco,code:'000',type:'wea',useState:'1',inten:0,addAttr:3,getMoney:300},
							{myacco: myattr.myacco,code:'100',type:'clo',useState:'1',inten:0,addAttr:3,getMoney:400},
							{myacco: myattr.myacco,code:'200',type:'amu',useState:'1',inten:0,addAttr:30,getMoney:500},
							{myacco: myattr.myacco,code:'300',type:'cri',useState:'1',inten:0,addAttr:3,getMoney:300},
							{myacco: myattr.myacco,code:'400',type:'tou',useState:'1',inten:0,addAttr:3,getMoney:400},
							{myacco: myattr.myacco,code:'500',type:'hit',useState:'1',inten:0,addAttr:3,getMoney:500},
							{myacco: myattr.myacco,code:'600',type:'dod',useState:'1',inten:0,addAttr:3,getMoney:500},
							{myacco: myattr.myacco,code:'700',type:'crh',useState:'1',inten:0,addAttr:3,getMoney:500},
							{myacco: myattr.myacco,code:'00',type:'mat',num:5},
							{myacco: myattr.myacco,code:'01',type:'mat',num:3},
							{myacco: myattr.myacco,code:'02',type:'mat',num:2},
							{myacco: myattr.myacco,code:'05',type:'mat',num:1},
							{myacco: myattr.myacco,code:'000',type:'pet',level:1,useState:'0',addAttr:13},
							{myacco: myattr.myacco,code:'001',type:'pet',level:1,useState:'0',addAttr:15},
							{myacco: myattr.myacco,code:'002',type:'pet',level:1,useState:'1',addAttr:18},
							{myacco: myattr.myacco,code:'003',type:'pet',level:1,useState:'0',addAttr:20},
							{myacco: myattr.myacco,code:'00',type:'des',level:1,useState:'1',addAttr:3,dis:'hit'},
							{myacco: myattr.myacco,code:'10',type:'des',level:1,useState:'1',addAttr:3,dis:'dod'},
							{myacco: myattr.myacco,code:'20',type:'des',level:1,useState:'1',addAttr:3,dis:'wea'},
							{myacco: myattr.myacco,code:'30',type:'des',level:1,useState:'1',addAttr:3,dis:'clo'},
							{myacco: myattr.myacco,code:'40',type:'des',level:1,useState:'1',addAttr:3,dis:'amu'},
							{myacco: myattr.myacco,code:'50',type:'des',level:1,useState:'1',addAttr:3,dis:'cri'},
							{myacco: myattr.myacco,code:'60',type:'des',level:1,useState:'1',addAttr:3,dis:'tou'},
							{myacco: myattr.myacco,code:'70',type:'des',level:1,useState:'1',addAttr:3,dis:'crh'},
						]
						
//						var friend = {friendAcco: 'a569133352',friendName:'哈哈哈',myacco: myattr.myacco}
						insertData(db, initData, function(result) {
							db.close();
						}, 'personInfo');
						insertData(db, myattr, function(result) {
							db.close();
						}, 'user');
						for (i in goods) {
							insertData(db, goods[i], function(result) {
								db.close();
							}, 'goods');
						}
						backData.msg = "注册成功"
						res.send(JSON.stringify(backData));
					}
				}, 'user');
			});
	})
/*获取数据*/
app.get('/getInfo', function (req, res) {
   var params = req.query;
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			selectData(db, params, function(result) {
				backData = result[0];
				db.close();
				res.send(JSON.stringify(backData));
			}, 'personInfo');
	});
})
/*获取数据*/
app.get('/getGoods', function (req, res) {
   var params = req.query;
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectData(db, params, function(result) {
			backData = result[0];
			db.close();
		}, 'personInfo');
		selectData(db, params, function(result) {
			backData.goods = result;
			db.close();
			res.send(JSON.stringify(backData));
		}, 'goods');
	});
})
/*角色信息*/
app.get('/getRole', function (req, res) {
    var params = req.query;
    var whereData = {$or:[{myacco: params.myacco,useState:'1'},{type:'mat'}]}
    MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectData(db, params, function(result) {
			backData = result[0];
			db.close();
		}, 'personInfo');
		selectData(db, whereData, function(result) {
			backData.goods = result;
			db.close();
			console.log(result)
			res.send(JSON.stringify(backData));
		}, 'goods');
	});
})

/*使用装备*/
app.post('/useEqui',function(req, res){
	var myattr = req.body;
		backData = myattr;
		var whereData = {
			myacco: myattr.myacco,
			type:myattr.type
		}
//		myattr.type=='pet' ? linkData = 'bag_pet':linkData = 'bag_equi';
		var selecData = {"_id" : ObjectId(myattr._id)}
		var selecUdData = {$set: {useState:'1'}}
		var udData = {$set: {useState:'0'}}
		console.log(selecData)
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			updateData(db, whereData,udData,function(result) {db.close();},'goods');
			updateData(db, selecData,selecUdData,function(result) {db.close();},'goods');
			backData.msg = '使用成功';
			res.send(JSON.stringify(backData));
		});
});
/*出售装备*/
app.post('/saleGoods',function(req, res){
	var myattr = req.body;
	backData = myattr;
	var whereData = {myacco: myattr.myacco,_id:ObjectId(myattr._id)}
	var selemyInfo = {myacco: myattr.myacco}
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		var udBag = {$set:{money:myattr.money}}
		updateData(db, selemyInfo, udBag, function(result) {db.close();},'personInfo');
		if(myattr.isRemove==1){
			delData(db,whereData,function(result){
				backData.msg = '出售成功';
				res.send(JSON.stringify(backData))
				db.close();
			},'goods');
		}else{
			var udBag = {$set:{num:myattr.num}}
			updateData(db, whereData, udBag, function(result) {
				backData.msg = '出售成功';
				res.send(JSON.stringify(backData))
				db.close();
			},'goods');
		}
	});
});
/*保存数据*/
app.post('/saveData',function(req, res){
	var myattr = req.body;
	myattr.dropData = JSON.parse(myattr.dropData);
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		var whereData = {myacco: myattr.myacco}
		var udBag = {$set:{money: myattr.money}}
		backData.msg = '闯关成功';
		if (myattr.saveState) {
			backData.data = myattr.dropData;
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
			updateData(db, whereData, udBag, function(result) {db.close();}, 'goods');
			}else{
				myattr.dropData[i].type == 'amu'?myattr.dropData[i].addAttr = createAttr(myattr.dropData[i].myclass)*10:myattr.dropData[i].addAttr = 				createAttr(myattr.dropData[i].myclass);
				myattr.dropData[i].type != 'mat'?myattr.dropData[i].getMoney = createAttr(myattr.dropData[i].myclass)*100:"";
				insertData(db,myattr.dropData[i], function(result) {db.close();}, 'goods');
			}		
		}
		res.send(JSON.stringify(backData));
	});
});
/*放生*/
app.post('/putdonwPet', function (req, res) {
 	var myattr = req.body;
	backData = myattr;
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			var whereData = {myacco: myattr.myacco,_id:ObjectId(myattr._id)}
			delData(db,whereData,function(result){
				backData.msg = '放生成功';
				res.send(JSON.stringify(backData));
				db.close();
			},'goods');
		});
})
/*捕捉*/
app.post('/catchPet', function (req, res) {
 	var myattr = req.body;
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		var whereData = {myacco: myattr.myacco,code:'05'}
		if (myattr.num==0) {
			delData(db,whereData,function(result){db.close();},'goods');
		}else{
			var udData = {$set:{num:myattr.num}};
			updateData(db, whereData, udData, function(result) {db.close();},'goods');
		}
		if (myattr.isCatch!=1) {
			backData.msg = '没抓住！再接再厉';
			backData.bool = 0;
			res.send(JSON.stringify(backData));
		}else{
			var insetData = {myacco: myattr.myacco,code:myattr.code,type:'pet',level:1,useState:'0'}
			insetData.addAttr = createAttr(myattr.myclass)+10;
			insertData(db,insetData,function(result){
				backData.msg = '抓住了！';
				backData.bool = 1;
				res.send(JSON.stringify(backData));
				db.close();
			},'goods');
		}
	});
})
/*购买货物*/

app.post('/showBut', function (req, res) {
 	var myattr = req.body;
    backData.money = myattr.money;
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		var whereData = {myacco: myattr.myacco}
		var udData = {$set:{money:myattr.money}}
		updateData(db, whereData, udData, function(result) {db.close();}, 'personInfo');
		if (myattr.type == 'mat') {
			var whereData = {myacco: myattr.myacco,code:myattr.code,type:myattr.type}
			myattr.num = parseInt(myattr.num);
			var udData = {$inc:{num:myattr.num}};
			upsertData(db, whereData, udData, function(result) {db.close();}, 'goods');
		}else{
			var inseData = {myacco: myattr.myacco,code:myattr.code,type:myattr.type,useState:'0',inten:0};
			myattr.type == 'amu'?inseData.addAttr = createAttr(myattr.myclass)*10:inseData.addAttr = createAttr(myattr.myclass);
			inseData.getMoney = createAttr(myattr.myclass)*100;
			insertData(db, inseData, function(result) {db.close();}, 'goods');
		}
		backData.msg = '购买成功';
		res.send(JSON.stringify(backData));
	});
})
/*强化装备*/
app.post('/intenEqui', function (req, res) {
 	var myattr = req.body;
    backData = myattr;
	myattr.num = parseInt(myattr.num);
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
//			dataLink = "bag_equi";
			succStr = '强化成功';
			failStr = '强化失败,物品等级下降0级';
			failDownStr = '强化失败,物品等级下降'+myattr.equiDown+'级';
		}else{
			udData = {$set:{level:myattr.level}}
			whereData = {myacco: myattr.myacco,code:'07'}
//			dataLink = "bag_pet";
			succStr = '升级成功';
			failStr = '升级失败,物品等级下降0级';
			failDownStr = '升级失败,物品等级下降'+myattr.equiDown+'级';
		}
		if (myattr.num==0) {
			delData(db,whereData,function(result){db.close();},'goods');
		}else{
			var update = {$set:{num:myattr.num}};
			updateData(db, whereData, update, function(result) {db.close();},'goods');
		}
		updateData(db, seleData, udData, function(result) {
			if (myattr.intenState==1) {
				backData.msg = succStr;
			}else if(myattr.intenState==0){
				backData.msg = failStr;
			}else{
				backData.msg = failDownStr;
			}
			res.send(JSON.stringify(backData));
		db.close();},'goods');
	});
})
/*转移强化属性*/
app.post('/changeInten',function(req,res){  
  	var myattr = req.body;  
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
		}else{
			udData_left = {$set:{level:1}};
			udData_right = {$set:{level:myattr.level}};
			succStr = '融合成功';
			failStr = '融合失败,宠物都消失了'
		}
		if (myattr.changeState==1) {
			backData.msg = succStr;
			updateData(db,seleData_left,udData_left, function(result) {db.close();},'goods');
			updateData(db,seleData_right,udData_right, function(result) {db.close();},'goods');
		}else{
			backData.msg = failStr;
			delData(db, seleData_left, function(result) {db.close();},dataLink);
			delData(db, seleData_right, function(result) {db.close();},dataLink);
		}
		res.send(JSON.stringify(backData));
	}); 
});  
/*物品进阶*/
app.post('/evolution',function(req,res){  
	var myattr = req.body;  
	console.log(myattr);
	backData = myattr;
//	var seleData_left = {myacco: myattr.myacco,_id:ObjectId(myattr.left_id)};
//	var seleData_right = {myacco: myattr.myacco,_id:ObjectId(myattr.right_id)};
	var deleteData = {$or:[{myacco: myattr.myacco,_id:ObjectId(myattr.left_id)},{myacco: myattr.myacco,_id:ObjectId(myattr.right_id)}]}
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
			inseData = {myacco: myattr.myacco,code:myattr.newCode,type:myattr.type,useState:'0',level:myattr.level};
			inseData.addAttr = createAttr(myattr.myclass);
		}else{
			succStr = '锤炼成功';
			failStr = '锤炼失败,两件装备都消失了';
			faillessStr = '锤炼失败,装备没有消失了';
			inseData = {myacco: myattr.myacco,code:myattr.newCode,type:myattr.type,useState:'0',inten:myattr.inten};
			myattr.type == 'amu'?inseData.addAttr = createAttr(myattr.myclass)*10:inseData.addAttr = createAttr(myattr.myclass);
			inseData.getMoney = createAttr(myattr.myclass)*100;
		}
		if (myattr.succState==1) {
			backData.msg = succStr;
			insertData(db,inseData, function(result) {db.close();},'goods');
			delData(db, deleteData, function(result) {db.close();},'goods');
//			delData(db, seleData_right, function(result) {db.close();},'goods');
		}else{
			if (myattr.lostState==1) {
				backData.msg = failStr;
//				delData(db, seleData_left, function(result) {db.close();},'goods');
				deleteData(db, seleData_right, function(result) {db.close();},'goods');
			} else{
				backData.msg = faillessStr;
			}
		}
		res.send(JSON.stringify(backData));
	});
});  

/*添加好友*/
app.get('/addFriend', function (req, res) {
  	var params = req.query;
	console.log(params);
	MongoClient.connect(DB_CONN_STR,function(err,db){
		selectData(db,params,function(result){
			if(result.length) {
				res.send(JSON.stringify(result));
			} else {
				backData.msg="您的好友是空的";
				res.send(JSON.stringify(backData));
			}
			db.close();
		},'myFriend');
	})
})
app.post('/addFriend', function (req, res) {
	var myattr = req.body;  
	if (myattr.state==1) {
		var seleData = {myacco:myattr.info};
		var selData = {friendAcco:myattr.info,myacco: myattr.myacco}
	}else{
		var seleData = {name:myattr.info};
		var selData = {friendName:myattr.info,myacco: myattr.myacco}
	}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		selectData(db,seleData,function(result){
			if(result.length) {
				var insertInfo = {friendAcco: result[0].myacco,friendName:result[0].name,myacco: myattr.myacco,friendImg:result[0].headPath};
				insertData(db,insertInfo,function(result){
				backData.msg = '添加成功';
				res.send(JSON.stringify(backData));
				db.close();
			},'myFriend');
			} else {
				backData.msg="查找好友不存在";
				res.send(JSON.stringify(backData));
			}
			db.close();
		},'personInfo');
	})
})

/*删除好友*/
app.post('/delFriend', function (req, res) {
	var myattr = req.body;
	MongoClient.connect(DB_CONN_STR,function(err,db){
		delData(db,myattr,function(result){
			backData.msg = '删除成功';
			res.send(JSON.stringify(backData));
			db.close();
		},'myFriend');
	})
})
/*决斗*/
app.get('/getDeul', function (req, res) {
	var params = req.query;
	var whereAttr = {$or: [{myacco: params.myacco}, {aaa: params.friendAcco}]}
	var selData = {"useState":"1",$or: [{myacco: params.myacco}, {aaa: params.friendAcco}]}
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		selectData(db,whereData, function(result) {
			backData = result;
			db.close();
		}, 'personInfo');
		selectData(db, selData,function(result) {
			backData.pet = result;
			db.close();
		}, 'bag_pet');
		selectData(db,selData,function(result) {
			backData.equi = result;
			db.close();
			res.send(JSON.stringify(backData));
		},'bag_equi');
	});
})

/*挂机*/
app.get('/on_hoon', function (req, res) {
	var params = req.query;
	var whereData = {$or:[{myacco: params.myacco,useState:'1'},{type:'mat'}]}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		selectData(db, params, function(result) {
			backData = result[0];
			db.close();
		}, 'personInfo');
		selectData(db, whereData,function(result) {
			backData.goods = result;
			db.close();
		}, 'goods');
		selectData(db,params, function(result) {
			backData.time = result[0];
			res.send(JSON.stringify(backData));
			db.close();
		}, 'onHoonData');
	})
})
app.post('/on_hoon',function(req, res){
	var myattr = req.body;
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
		res.send(JSON.stringify(backData));
	})
})
/*切换头像*/
app.post('/headImg',function(req, res){
	var myattr = req.body;
	MongoClient.connect(DB_CONN_STR,function(err,db){
		var whereData = {myacco: myattr.myacco};
		var udData = {$set:{headPath:myattr.headPath}};
		updateData(db, whereData, udData, function(result) {
			backData.msg = '修改成功'
			res.send(JSON.stringify(backData));
			db.close();}, 'personInfo');
	})
})
app.get('/*.html', function (req, res) {
	console.log(req.url)
   	fs.readFile('..' + req.url, 'utf8', function(err, data) {
		res.writeHead(200, {
			"Content-type": "text/html"
		})
		res.end(data)
	});
})
app.get('/*.js', function (req, res) {
   	fs.readFile('../js' + req.url, 'utf8', function(err, data) {
		res.writeHead(200, {
			"Content-type": "text/javascript"
		})
		res.end(data)
	});
})
app.get('/', function (req, res) {
   	fs.readFile('../index.html', 'utf8', function(err, data) {
		res.writeHead(200, {
			"Content-type": "text/html"
		})
		res.end(data)
	});
})

app.get('/cache.appcache', function (req, res) {
   	fs.readFile('../cache.appcache', 'utf8', function(err, data) {
		res.writeHead(200, {
			"Content-type": "text/cache-manifest"
		})
		res.end(data)
	});
})

app.get('/*.css', function (req, res) {
   	fs.readFile('../css' + req.url, 'utf8', function(err, data) {
		res.writeHead(200, {
			"Content-type": "text/css"
		})
		res.end(data)
	});
})
app.get('/*.png', function (req, res) {
   	fs.readFile('../img' + req.url, 'binary', function(err, data) {
			res.writeHead(200, {
				"Content-type": "image/jpeg"
			})
			res.write(data, 'binary')
			res.end()
			return;
	});
})
app.get('/*.jpg', function (req, res) {
   	fs.readFile('../img' + req.url, 'binary', function(err, data) {
			res.writeHead(200, {
				"Content-type": "image/jpeg"
			})
			res.write(data, 'binary')
			res.send()
			return;
	});
})
app.get('/*.gif', function (req, res) {
   	fs.readFile('../img' + req.url, 'binary', function(err, data) {
			res.writeHead(200, {
				"Content-type": "image/jpeg"
			})
			res.write(data, 'binary')
			res.send()
			return;
	});
})


var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("localhost:3000/", host, port)
 
})





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