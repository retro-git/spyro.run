import initSqlJs from "sql.js";

const sqlPromise = await initSqlJs({
    locateFile: file => `${file}`
});

async function fetchDB(path) {
    const dataPromise = fetch(path).then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    return new SQL.Database(new Uint8Array(buf));
}

const srcom = await fetchDB("data/srcom.sqlite");
const extras = await fetchDB("data/extras.sqlite");

//console.log(extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'"));

const res = srcom.exec("SELECT * FROM spyro1");
const res2 = extras.exec("SELECT * FROM spyro1");

console.log(res);
console.log(res2);

let res3 = structuredClone(res2);

res3[0]["values"] = res[0]["values"].concat(res2[0]["values"]);

console.log(res3);

let unique_games = [...new Set(res3[0]["values"].map(a => a[res3[0]["columns"].indexOf("game")]))];
let unique_categories = [...new Set(res3[0]["values"].map(a => a[res3[0]["columns"].indexOf("category")]))];

//console.log(unique_games)
//console.log(unique_categories);