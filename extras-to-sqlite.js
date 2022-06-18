const fs = require("fs");
const XLSX = require("xlsx");
const sqlite3 = require('sqlite3').verbose();
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({description: "Convert ODS formatted runs to sqlite database."});
parser.add_argument('ods_path', {type: 'str', help: "path to input ODS file"});
parser.add_argument('sqlite_path', {type: 'str', help: "path to output sqlite file"});

const args = parser.parse_args();

if (fs.existsSync(args.sqlite_path)) {
    fs.unlinkSync(args.sqlite_path);
}

const wb = XLSX.readFile(args.ods_path);
const db = new sqlite3.Database(args.sqlite_path);

Object.keys(wb.Sheets).forEach(sheet => {
    const runs = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { raw: false, dateNF: 'yyyy-mm-dd', defval: "" });
    const game = sheet.split("#")[0];
    const category = sheet.split("#")[1];
    
    runs.forEach(run => {
        const data = Object.keys(run).map(k => run[k]);
        data.unshift(category);
        const create_statement = `Create TABLE if not exists ${game} (category text, player text, time real, platform text, region text, emulated integer, date text, comment text, link text, [editor\'s note] text, cheated integer, removed integer, disputed integer, anonymised integer, unsubmitted integer, [no video] integer, subcategory text)`;
        db.run(create_statement, () => {
            db.run(`INSERT INTO ${game} values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, data);
        });
    })
})

db.close();