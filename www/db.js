import initSqlJs from "sql.js";

const sqlPromise = await initSqlJs({
    locateFile: file => `${file}`
});

async function fetchDB(path) {
    const dataPromise = fetch(path).then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
    return new SQL.Database(new Uint8Array(buf));
}

export default {
    srcom: await fetchDB("data/srcom.sqlite"),
    extras: await fetchDB("data/extras.sqlite"),
}