var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/mytest'; //数据库为 mytest
http.createServer(function(req, res) {

	if(req.url == "/mylogin") {
		var myattr = null;
		req.addListener('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			console.log(myattr);
			var whereAttr = {
				myacco: myattr.myacco
			}
			console.log(whereAttr)
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				console.log("连接成功！");

				selectData(db, whereAttr, function(result) {
					console.log(result)
					if(result.length) {
						if(result[0].mypassword == myattr.mypassword) {
							res.end("登录成功");
						} else {
							res.end("密码错误");
						}
					} else {
						res.end("用户不存在")
					}
					db.close();
				});
			});
		});
	} else if(req.url == "/firstlogin") {
		var myattr = null;
		req.on('data', function(attr) {
			myattr = qs.parse(decodeURI(attr));
			var whereAttr = {
				myacco: myattr.myacco
			}
			MongoClient.connect(DB_CONN_STR, function(err, db) {
				console.log("连接成功！");
				selectData(db, whereAttr, function(result) {
					console.log("13213213213")
					console.log(result.length)
					if(result.length) {
						return res.end("用户已存在，请换个用户");
					} else {
						insertData(db, myattr, function(result) {
							console.log(result);
							db.close();
						});
						res.end("注册成功");
					}
				});

			});
		});

		console.log("我在注册")
	} else if(req.url.indexOf(".js")>0) {
		console.log(req.url)
		fs.readFile('../js'+req.url, function(err, data) {
			res.writeHead(200, {"Content-type": "text/javascript"})
			res.end(data)
		});
	} else if(req.url.indexOf(".css")>0) {
		fs.readFile('../css'+req.url, function(err, data) {
			res.writeHead(200, {"Content-type": "text/css"})
			res.end(data)
		});
	}else if(req.url == "/") {
		fs.readFile('../index.html', 'utf8', function(err, data) {
			res.writeHead(200, {"Content-type": "text/html"})
			res.end(data)
		});
	} else if(req.url.indexOf(".html")>0) {
		fs.readFile('..'+req.url, 'utf8', function(err, data) {
			res.writeHead(200, {"Content-type": "text/html"})
			res.end(data)
		});
	}
	console.log(req.url)
}).listen(3000);
var insertData = function(db, mydata, callback) {
	//连接到表 site
	var collection = db.collection('site');
	collection.insert(mydata, function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
var selectData = function(db, mydata, callback) {
	//连接到表  
	var collection = db.collection('site');
	//查询数据
	collection.find(mydata).toArray(function(err, result) {
		if(err) {
			console.log('Error:' + err);
			return;
		}
		callback(result);
	});
}
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:8081/');