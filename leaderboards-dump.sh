#!/bin/sh

cp -R src/assets/db/srcom.sqlite src-dump/out/

cd src-dump

#rm -rf out

while IFS= read -r line || [ -n "$line" ]; do
    eval "python3 main.py $line --sqlite"
done < ../leaderboards.txt

cd ..

cp -R src-dump/out/srcom.sqlite src/assets/db