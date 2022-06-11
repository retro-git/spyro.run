cd src-dump

while IFS= read -r line || [ -n "$line" ]; do
    eval "python3 main.py $line --sqlite"
done < ../leaderboards.txt