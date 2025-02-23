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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var line_reader_1 = __importDefault(require("line-reader"));
function insertRMPData(con) {
    return __awaiter(this, void 0, void 0, function () {
        var rmpFilePath, rmpEntries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rmpFilePath = "./db/data/rmp.csv";
                    console.log("parsing: ".concat(rmpFilePath));
                    return [4 /*yield*/, parseRMPCSV(rmpFilePath)];
                case 1:
                    rmpEntries = _a.sent();
                    writeRMPDataToDB(con, rmpEntries);
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = insertRMPData;
function parseRMPCSV(rmpFilePath) {
    var entries = new Array();
    return new Promise(function (resolve) {
        line_reader_1["default"].eachLine(rmpFilePath, function (line, last) {
            var lineArr = line.split(",");
            var numRatings = parseInt(lineArr[5].trim());
            var dupEntry = entries.find(function (entry) {
                return entry.firstName === lineArr[0].trim() &&
                    entry.lastName === lineArr[1].trim();
            });
            if (numRatings > 0 && !dupEntry) {
                entries.push({
                    firstName: lineArr[0].trim(),
                    lastName: lineArr[1].trim(),
                    rating: parseFloat(lineArr[2].trim()),
                    difficulty: parseFloat(lineArr[3].trim()),
                    retakeRate: parseInt(lineArr[4].trim()),
                    numRatings: numRatings
                });
            }
            if (last)
                resolve(entries);
        });
    });
}
function writeRMPDataToDB(con, rmpEntries) {
    rmpEntries.forEach(function (elm) {
        con.query("INSERT INTO quality_ratings (rating, difficulty, retake_rate, num_ratings, professor_id) " +
            "SELECT * FROM (SELECT ".concat(elm.rating, " AS rating, ").concat(elm.difficulty, " AS difficulty, ").concat(elm.retakeRate, " AS retake_rate, ").concat(elm.numRatings, " AS num_ratings, ") +
            "(SELECT professor_id FROM professors WHERE first_name = \"".concat(elm.firstName, "\" AND last_name = \"").concat(elm.lastName, "\") AS professor_id) as t ") +
            "WHERE EXISTS (SELECT first_name, last_name FROM professors WHERE first_name = \"".concat(elm.firstName, "\" AND last_name = \"").concat(elm.lastName, "\") LIMIT 1;"));
    });
}
