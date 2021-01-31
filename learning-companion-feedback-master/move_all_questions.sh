#!/bin/bash
# Script to move all questions of one session to another (within the same test)
#Arg 1 is the path to the pictures folder
#Arg 2 is the test
#Arg 3 is the session to move from
#Arg 4 is the session to move to

#Example bash move_all_questions.sh server/persist/data/pictures wb 15 19

find $1 -name "$3-$2-question*" | while IFS= read -r pathname; do
    base=$(basename "$pathname"); name=${base:6:-4};
    mv "$1/$3-$2-$name.png" "$1/$4-$2-$name.png"
done