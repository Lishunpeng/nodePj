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
							money: '1000'
						};
						//初始化背包数据
						var equiCode = [
						{myacco: myattr.myacco,code:'000',type:'wea',useState:'1',inten:0},
						{myacco: myattr.myacco,code:'001',type:'wea',useState:'0',inten:0},
						{myacco: myattr.myacco,code:'100',type:'clo',useState:'1',inten:0},
						{myacco: myattr.myacco,code:'101',type:'clo',useState:'0',inten:0},
						{myacco: myattr.myacco,code:'200',type:'amu',useState:'1',inten:0},
						{myacco: myattr.myacco,code:'201',type:'amu',useState:'0',inten:0}
						]
						var matCode = [
						{myacco: myattr.myacco,code:'00',type:'mat',num:5},
						{myacco: myattr.myacco,code:'01',type:'mat',num:3},
						{myacco: myattr.myacco,code:'02',type:'mat',num:2},
						{myacco: myattr.myacco,code:'05',type:'mat',num:1},
						{myacco: myattr.myacco,code:'06',type:'mat',num:5},
						{myacco: myattr.myacco,code:'07',type:'mat',num:5}
						]
						var petCode = [
						{myacco: myattr.myacco,code:'00',type:'pet',level:5,useState:'0'},
						{myacco: myattr.myacco,code:'00',type:'pet',level:3,useState:'0'},
						{myacco: myattr.myacco,code:'02',type:'pet',level:2,useState:'1'},
						{myacco: myattr.myacco,code:'00',type:'pet',level:10,useState:'0'}
						]
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
					res.end(JSON.stringify(backData));
				},'bag_equi');
		});
	}else if(pathname == "/useEqui") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
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
			console.log(myattr);
			
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
				updateData(db, whereData, udBag, function(result) {db.close();}, 'personInfo');
				for (i in myattr.dropData) {
					console.log(i)
					if (myattr.dropData[i]._id) {
						console.log(2212121212121)
						var whereData = {
							myacco: myattr.myacco,
							"_id": ObjectId(myattr.dropData[i]._id)
						}
						var udBag = {$set:{num:myattr.dropData[i].num}}
						updateData(db, whereData, udBag, function(result) {db.close();}, 'bag_mat');
					}else{
						console.log(11)
						var dataLink = '';
						myattr.dropData[i].type == 'mat'?dataLink = 'bag_mat':dataLink = 'bag_equi';
						insertData(db,myattr.dropData[i], function(result) {db.close();}, dataLink);
					}		
				}
				backData.msg = '闯关成功';
				res.end(JSON.stringify(backData));
			});
		});
	}else if(pathname == "/putdonwPet") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
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
					updateData(db, whereData, udData, function(result) {db.close();}, 'bag_mat');
				}
				if (myattr.isCatch!=1) {
					backData.msg = '没抓住！再接再厉';
					backData.bool = 0;
					res.end(JSON.stringify(backData));
				}else{
					var insetData = {myacco: myattr.myacco,code:myattr.code,type:'pet',level:1,useState:'0'}
					insertData(db,insetData,function(result){
						backData.msg = '抓住了！';
						backData.bool = 1;
						res.end(JSON.stringify(backData));
						db.close();
					},'bag_pet');
				}
			});
		});
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

// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:3000/');