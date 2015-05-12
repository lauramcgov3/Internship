#!/bin/bash

FILES=`ls ../PNG/`

for f in $FILES
do
	
	convert ../PNG/$f -resize 85x45 ${f}
done
