import initSqlJs from "sql.js";

const sqlPromise = await initSqlJs({
    locateFile: file => `${file}`
});

async function fetchDB(path) {
    const dataPromise = fetch(path).then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
    return new SQL.Database(new Uint8Array(buf));
}

const srcom = await fetchDB("data/srcom.sqlite");
const extras = await fetchDB("data/extras.sqlite")

const res = srcom.exec("SELECT * FROM Run")
const res2 = extras.exec("SELECT * FROM Run")

console.log(res)
console.log(res2)

//console.log(db)