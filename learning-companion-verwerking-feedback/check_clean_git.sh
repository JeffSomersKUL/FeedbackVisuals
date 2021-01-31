#!/bin/bash!

if [ -z "$(git status --porcelain)" ]; then
	exit 0
else
	echo "There are changes";
	git status;
	exit 1
fi
