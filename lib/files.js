"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var stream_1 = require("stream");
var util_1 = require("util");
var stat = util_1.promisify(fs.stat);
var fsPromises = fs.promises;
var readFile = fsPromises.readFile;
var FileError = /** @class */ (function (_super) {
    __extends(FileError, _super);
    function FileError(fPath, stats) {
        var _this = _super.call(this, path.basename(fPath) + " is not a regular file.") || this;
        _this.path = fPath;
        _this.name = 'FileError';
        _this.stats = stats;
        return _this;
    }
    return FileError;
}(Error));
function buffertoStream(buffer) {
    var stream = new stream_1.Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}
function fileToStream(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvePath, stats, fileBuffer, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolvePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, stat(resolvePath)];
                case 2:
                    stats = _a.sent();
                    if (!stats.isFile()) return [3 /*break*/, 4];
                    return [4 /*yield*/, readFile(resolvePath)];
                case 3:
                    fileBuffer = _a.sent();
                    return [2 /*return*/, buffertoStream(fileBuffer)];
                case 4: throw new FileError(filePath, stats);
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    throw err_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.fileToStream = fileToStream;
