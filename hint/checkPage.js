"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hint_1 = require("hint");
var node_fetch_1 = require("node-fetch");
var http = require("http");
function CheckWebPage(urls) {
    return __awaiter(this, void 0, void 0, function () {
        var userConfig, begin, webhint_1, results, end, time_1, totalHints_1, resultData, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userConfig = {
                        extends: ["accessibility"],
                        formatters: ["html"],
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    begin = Date.now();
                    webhint_1 = hint_1.Analyzer.create(userConfig);
                    return [4 /*yield*/, webhint_1.analyze(urls)];
                case 2:
                    results = _a.sent();
                    end = Date.now();
                    time_1 = end - begin;
                    totalHints_1 = 0;
                    results.forEach(function (result) {
                        console.log("Result for: ".concat(result.url));
                        totalHints_1 += result.problems.length;
                        var options = {
                            // date: Date.now().toLocaleString(),
                            scanTime: time_1,
                            target: result.url,
                            version: "6.14.15",
                        };
                        webhint_1.format(result.problems, options);
                    });
                    resultData = {
                        time: time_1,
                        totalHints: totalHints_1
                    };
                    return [2 /*return*/, resultData];
                case 3:
                    ex_1 = _a.sent();
                    console.log("Error during validation: " + ex_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function FetchData(params) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1.default)("http://localhost:3002/geturls", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    })
                        .then(function (res) { return res.json(); })
                        .catch(function (ex) { return console.log(ex); })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function FetchUrlsAndExecuteValidation(url, max_urls) {
    return __awaiter(this, void 0, void 0, function () {
        var params, urls, resultData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        start_url: url,
                        max_urls: max_urls,
                    };
                    return [4 /*yield*/, FetchData(params)];
                case 1:
                    urls = _a.sent();
                    return [4 /*yield*/, CheckWebPage(urls)];
                case 2:
                    resultData = _a.sent();
                    resultData.urls = urls;
                    return [2 /*return*/, resultData];
            }
        });
    });
}
var myServer = http.createServer(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.method == "POST" && req.url == "/geturls") {
            return [2 /*return*/, getUrls(req, res)];
        }
        return [2 /*return*/];
    });
}); });
myServer.listen(3001, function () {
    console.log('Server is running on port 3001. Go to http://localhost:3001/');
});
var getUrls = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body_1;
    return __generator(this, function (_a) {
        try {
            res.setHeader('Access-Control-Allow-Origin', '*');
            console.log("REQUEST COMING IN");
            body_1 = "";
            req.on("data", function (chunk) {
                body_1 += chunk.toString();
            });
            req.on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, url, maxurls, resultData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = JSON.parse(body_1), url = _a.url, maxurls = _a.maxurls;
                            return [4 /*yield*/, FetchUrlsAndExecuteValidation(url, parseInt(maxurls))];
                        case 1:
                            resultData = _b.sent();
                            res.statusCode = 200;
                            res.statusMessage = "OK";
                            res.end(JSON.stringify(resultData));
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (error) {
            console.log(error);
        }
        return [2 /*return*/];
    });
}); };
