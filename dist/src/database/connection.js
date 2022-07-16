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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const features_1 = require("../utils/features");
const databaseConnection = (db_url) => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.Promise = Promise;
    if (db_url)
        yield mongoose_1.default.connect(db_url);
    else
        (0, features_1.log)('db_url not found in process env');
    mongoose_1.default.connection.on('connected', () => {
        (0, features_1.log)('database connection status: true');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        (0, features_1.log)('database reconnected');
    });
    mongoose_1.default.connection.on('disconnected', () => {
        (0, features_1.log)('databse disconnected');
        (0, features_1.log)('shutting down server');
    });
    mongoose_1.default.connection.on('close', () => {
        (0, features_1.log)('database connection closed');
    });
    mongoose_1.default.connection.on('error', (err) => {
        (0, features_1.log)('database connection error: ', err);
    });
});
exports.databaseConnection = databaseConnection;
//# sourceMappingURL=connection.js.map