while IFS= read -r line || [ -n "$line" ]; do
    echo "$line"
    (cd src-dump; python3 main.py $line --sqlite)
done < leaderboards.txt