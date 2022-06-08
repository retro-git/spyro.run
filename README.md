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
Dump a speedrun.com leaderboard to SQLite database (example of Spyro 1 Any%):

```bash
python3 main.py spyro1 Any% --sqlite
```
Run test server:

```bash
npm run start
```
Build distribution folder:
```bash
npm run build
```
