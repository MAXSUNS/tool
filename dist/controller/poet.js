"use strict";

/**
 * Created by suns on 2018/3/14.
 */
var fs = require("fs");
var http = require("http");
var request = require("request");
var crypto = require("crypto");
var md5 = crypto.createHash("md5");
var async = require("async");

function add(ctx) {
    ctx.body = {
        username: ctx.request.body.username
    };
}
async function info(ctx) {
    var files = [];
    var newfiles = [];

    await new Promise(function (resolve, reject) {
        // 读image文件夹
        fs.readdir('./json', function (err, picFiles) {
            if (err) ctx.throw(err);
            files = picFiles; // 将所有的文件夹名字放到外面来。
            resolve(); // resolve过后，await语句才结束
        });
    });
    var count = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var fileName = _step.value;

            (function (count) {
                fs.readFile('./json/' + fileName, function (err, bytesRead) {
                    if (err) {
                        console.log("读取文件失败" + fileName + '-result.js');
                    } else {
                        var words = fileName.split(".");
                        if (words[0] == 'poet' && words[1] == 'song' && words[2] > 60000) {
                            async.mapSeries(JSON.parse(bytesRead), function (aut, callback) {
                                var path = 'http://0.0.0.0:9200/' + words[0] + '/' + words[1] + '/';
                                if (aut.paragraphs[0]) {
                                    path = path + cryptPwd(aut.paragraphs[0]);
                                } else {
                                    path = path + cryptPwd(aut.author + aut.title);
                                }
                                addElatic(path, aut, callback);
                            }, function (error, result) {
                                console.log("mapLimit:" + result);
                            });
                            // for (let aut of JSON.parse(bytesRead)) {
                            //     let path = 'http://119.23.64.113:9200/' + words[0] + '/' + words[1] + '/';
                            //     path = path + cryptPwd(aut.title + count);
                            //
                            //     console.log(path);
                            //     addElatic(path, aut);
                            //     count = count + 1;
                            // }
                        }
                    }
                });
            })(count);
        };

        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

var concurrencyCount = 0;
function addElatic(path, aut, callback) {
    concurrencyCount++;
    console.log("当前线程数==" + concurrencyCount);
    request({
        url: path,
        method: "PUT",
        json: true,
        headers: {
            "content-type": "application/json"
        },
        body: aut
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(path); // 请求成功的处理逻辑
            concurrencyCount--;
            callback(null, "success");
        } else {
            console.log("error" + path);
            concurrencyCount--;
            addElatic(path, aut, callback);
        }
    });
    // request('http://119.23.64.113:9200/'+words[0]+'/'+words[1]+'/'+files[0], function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         console.log(body);
    //     } else {
    //         console.log(response.statusCode)
    //         // messageService.sendMessage(environment.name + '环境 eureka异常');
    //     }
    // })
}

module.exports = {
    add: add,
    info: info
};
//# sourceMappingURL=poet.js.map
