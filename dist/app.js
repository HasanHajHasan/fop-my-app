"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const xml_js_1 = __importDefault(require("xml-js"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = require("fs");
const rando_js_1 = require("@nastyox/rando.js");
const app = (0, express_1.default)();
const port = 8080;
app.use(body_parser_1.default.json());
app.post("/export-to-pdf", (req, res) => {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const result = xml_js_1.default.json2xml(req.body, options);
    console.log("fop file");
    const fileName = `${(0, rando_js_1.rando)(100000)}-pdf`;
    (0, fs_1.writeFileSync)(`../fops/${fileName}.fo`, result);
    console.log("file name: ", fileName);
    (0, child_process_1.exec)(`./fopScript.sh '../../opt/fop-my-app/fops/${fileName}.fo' '../../opt/fop-my-app/pdfs/${fileName}.pdf'`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});
app.listen(port, () => {
    console.log(`server started at port ${port}`);
});
//# sourceMappingURL=app.js.map