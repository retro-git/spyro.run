#!/bin/zsh

declare -A lbs=(
    ['spyro1']="Any% 120%"
    ['spyro2']="Any% 14__Talisman 100%"
    ['spyro3']="Any% 100__Egg 117%"
)

# for key val in "${(@kv)lbs}"; do
#     for i in "${val[0]}"
#     do
#         echo "$key -> $i"
#     done    
# done

for key val in "${(@kv)lbs}"; do
    for x in $val
    do
        echo "$x"
        echo "hi"
    done
done

typeset -a array
array=(a 'b c' '')
for ((i = 1; i <= $#array; i++)) print -r -- $array[i]