#!/bin/bash

LIST=ls
SIZE=30 # assume that icons are squared

#original icons
mkdir /$SIZE_
cd ./60_
for i in *
do
	#echo "Hello " + $i
	NAMEOUT=$SIZE"_"${i:3} #ignore the 60_
	convert -resize $SIZEx$SIZE $i ../$SIZE_/$NAMEOUT
done
