const fs = require("fs");
const XLSX = require("xlsx");
const sqlite3 = require('sqlite3').verbose();
const { ArgumentParser } = require('argparse');
const parse = require('parse-duration')
const _ = require("lodash");

const parser = new ArgumentParser({ description: "Convert ODS formatted runs to sqlite database." });
parser.add_argument('ods_path', { type: 'str', help: "path to input ODS file" });
parser.add_argument('sqlite_path', { type: 'str', help: "path to output sqlite file" });

const args = parser.parse_args();

if (fs.existsSync(args.sqlite_path)) {
    fs.unlinkSync(args.sqlite_path);
}

const wb = XLSX.readFile(args.ods_path);
const db = new sqlite3.Database(args.sqlite_path);

function format_time(time_str) {
    if (time_str.indexOf(".") > -1) {
        const time = _.replace(_.clone(time_str), ".", ":")
        const ret = time.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur.padEnd(3, "0") + "ms" + prev
                case 1:
                    return cur + "s" + prev
                case 2:
                    return cur + "m" + prev
                case 3:
                    return cur + "h" + prev
                default:
                    return
            }
        }, "");
        //console.log(ret);
        return ret;
    }
    else {
        const ret = time_str.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur + "s" + prev
                case 1:
                    return cur + "m" + prev
                case 2:
                    return cur + "h" + prev
                default:
                    return
            }
        }, "");
        //console.log(ret);
        return ret;
    }
}

Object.keys(wb.Sheets).forEach(sheet => {
    const runs = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { raw: false, dateNF: 'yyyy-mm-dd', defval: "" });
    const game = sheet.split("#")[0];
    const category = sheet.split("#")[1];

    const create_statement = `Create TABLE if not exists ${game} (category text, player text, time real, platform text, region text, emulated integer, date text, comment text, link text, [editor\'s note] text, cheated integer, removed integer, disputed integer, anonymised integer, unsubmitted integer, [no video] integer, subcategory text)`;
    db.run(create_statement, () => {
        runs.forEach(run => {
            const data = Object.keys(run).map(k => {
                if (k === "time") {
                    return parse(format_time(run[k]), "s");
                }
                else return run[k];
            });
            data.unshift(category);
            db.run(`INSERT INTO ${game} values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, data);
        })
    });
})

db.close();