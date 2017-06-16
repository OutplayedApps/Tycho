find . -maxdepth 3 -iname "*.pdf" | while read x
do
	filename="${x##*/}"
	directory=`dirname "$x"`
	newDir="./new"${directory#.}
	mkdir -p "$newDir"
	newPath="$newDir""/""$filename"
	#first optimization:
	ps2pdf "$x" "$newPath"
	size1=$(wc -c < "$x")
	size2=$(wc -c < "$newPath")
	echo $size1" versus "$size2,$x
	if [ $size2 -gt $size1 ]
		then
		cp "$x" "$newDir"
		echo "\tnow we're replacing it..."
	fi
	#second optimization:
	./pdfsizeopt/pdfsizeopt --use-jbig2=no --use-pngout=no  --do-optimize-images=no "$newPath" "$newPath" > out.log
done
