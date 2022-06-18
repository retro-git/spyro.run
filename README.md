# sr-archive-lb

Clone repo recursively:
```bash
git clone https://github.com/retro-git/sr-archive-lb --recursive
```

Install npm dependencies:
```bash
cd sr-archive-lb
npm i
```

Install src-dump submodule dependencies:
```bash
cd src-dump
python3 -m pip install -r requirements.txt
```

Dump speedrun.com leaderboards, listed in leaderboards.txt, to SQLite database (`src/assets/db/srcom.sqlite`):
```bash
npm run dump
```

Store additional runs in `src/assets/db/extras.sqlite` database - you can use the following command to generate this database from a correctly formatted ODS speadsheet file: 

```bash 
npm run extras
```

Optionally, override arbitrary data of a given run, identified by its hash, in `src/assets/json/overrides.json`.

Run test server:
```bash
npm run start
```

Build distribution folder:
```bash
npm run build
```
