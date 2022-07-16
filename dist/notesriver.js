"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("src/database/connection");
const features_1 = require("src/utils/features");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
app.use((0, cors_1.default)());
(0, dotenv_1.config)({ path: './.env' });
const db_url = process.env.DB_URL;
const port = process.env.PORT || 3000;
(0, connection_1.databaseConnection)(db_url);
server.listen(port, () => {
    (0, features_1.log)(`server is up and running on port: ${port}`);
});
//# sourceMappingURL=notesriver.js.map