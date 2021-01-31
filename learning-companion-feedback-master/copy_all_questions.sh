#!/bin/bash
# Script to copy all questions of one test to another (within the same session)
#Arg 1 is the path to the pictures folder
#Arg 2 is the session
#Arg 3 is the test to copy from
#Arg 4 is the new session
#Arg 5 is the test to copy to

#Example bash copy_all_questions.sh server/persist/data/pictures 15 wb 15 fa

find $1 -name "$2-$3-question*" | while IFS= read -r pathname; do
    base=$(basename "$pathname"); name=${base:6:-4};
    cp "$1/$2-$3-$name.png" "$1/$4-$5-$name.png"
done