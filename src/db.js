import initSqlJs from "sql.js";

const SQL = await initSqlJs({
    locateFile: file => `${file}`
});

/*async function fetchDB(path) {
    const dataPromise = fetch(path).then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    return new SQL.Database(new Uint8Array(buf));
}*/

async function fetchDB(path) {
    const res = await fetch(path);
    if (res.status == 404) {
        return new SQL.Database();
    }
    const dataPromise = res.arrayBuffer();
    const buf = await dataPromise;
    return new SQL.Database(new Uint8Array(buf));
}

export default {
    srcom: await fetchDB("assets/db/srcom.sqlite"),
    extras: await fetchDB("assets/db/extras.sqlite"),
}