var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/mytest'; //数据库为 mytest
http.createServer(function(req, res) {
	var pathname = url.parse(req.url, true).pathname;
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

							var data = {
								msg: "登录成功",
								myacco: result[0].myacco
							}
							var mymoney = {
							myacco: myattr.myacco,
							money: "1000",
							goods:{$ref:"goods",$id:myattr.myacco}
						};
						insertData(db, mymoney, function(result) {
							db.close();
						}, 'mymoney');	
							console.log(data)
							res.end(JSON.stringify(data));
						} else {
							var data = {
								msg: "密码错误"
							}
							res.end(JSON.stringify(data));
						}
					} else {
						var data = {
							msg: "用户名不存在"
						}
						res.end(JSON.stringify(data));
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
	}
	else if(pathname.indexOf(".png") > 0) {
		console.log(req.url)
		fs.readFile('../img' + req.url, 'binary', function(err, data) {
			res.writeHead(200, {
				"Content-type": "'image/jpeg"
			})
			res.write(data,'binary')
			res.end()
			return;
		});
		/*注册页面*/
	}else if(pathname == "/firstlogin") {
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
				console.log("连接成功！");
				selectData(db, whereAttr, function(result) {
					console.log(result)
					if(result.length) {
						if(result[0].name == myattr.name) {
							return res.end("角色名已存在，请换一个角色名");
						} else if(result[0].myacco == myattr.myacco) {
							return res.end("用户已存在，请换个用户");
						}
					} else {
						//初始化所有数据
						var initData = {
							myacco: myattr.myacco,
							name: myattr.name,
							ATK: "10",
							DEF: "10",
							HP: "100",
							money: "1000",
							weaponUse: "00",
							clothUse: "00",
							amuletUse: "00",
							goods:{$ref:"goods",$id:myattr.myacco}
						};
						//初始化武器数据
						/*装备代码1000：第一位1表示是否使用中,第二位0表示武器，1表示防具，2表示护符,最后两位00代表装备代码**/
						/*其他物品代码1000：前两位代表数量,最后两位00代表物品代码**/
						var goods = {
							_id: myattr.myacco,
							equiCode: "1000,0001,1100,0101,1200,0201", //装备
							medicineCode: "55#01,52#01,5#00", //药水
							materialCode: "10#01", //材料
							money:'1000'
						};
						insertData(db, initData, function(result) {
							db.close();
						}, 'personInfo');
						insertData(db, goods, function(result) {
							db.close();
						}, 'goods');
						insertData(db, myattr, function(result) {
							db.close();
						}, 'user');
						res.end("注册成功");
					}
				}, 'user');
			});
		});
		/*首页获取ajax数据*/
	} else if(pathname == "/getInfo" || pathname == "/getGoods") {
		var mydata = null;
		if(pathname == "/getInfo") {
			linkBase = 'personInfo'
		} else if(pathname == "/getGoods") {
			linkBase = 'goods'
		}
		var params = url.parse(req.url, true).query;
		console.log(params)
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			selectData(db, params, function(result) {
				console.log(result[0])
				mydata = result[0];
				res.end(JSON.stringify(mydata))
				db.close();
			}, linkBase);
		});
	} else if(pathname == "/useEqui") {
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			console.log(myattr);
			var whereData = {myacco:myattr.myacco}
			if (myattr.equiClass=="weapon") {
				var udInfo = {$set:{weaponUse:myattr.weaponUse}}
			}else if(myattr.equiClass=="cloth"){
				var udInfo = {$set:{clothUse:myattr.clothUse}}
			}else if(myattr.equiClass=="amulet"){
				var udInfo = {$set:{amuletUse:myattr.amuletUse}}
			}
			if (myattr.typeCode=="equiCode") {
				var udBag = {$set:{equiCode:myattr.code}}
				console.log(udBag)
			}
			console.log(udInfo)
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				updateData(db,whereData,udBag,function(result) {db.close();},'goods');
				updateData(db,whereData,udInfo,function(result) {db.close();},'personInfo');
				res.end('使用成功')
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
var updateData = function(db, whereData, mydata, callback, table) {
	var collection = db.collection(table);
	//更新数据
	collection.update(whereData, mydata, function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}

// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:8081/');