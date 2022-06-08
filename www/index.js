import initSqlJs from "sql.js";

const SQL = await initSqlJs({
    locateFile: file => `sql-wasm.wasm`
});

var db = new SQL.Database();

console.log(db)