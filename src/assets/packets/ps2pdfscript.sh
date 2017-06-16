find . -iname "HFT XI Round 2 FINISHED.pdf" | while read x
do
	filename="${x##*/}"
	directory=`dirname "$x"`
	newDir="./new"${directory#.}
	mkdir -p "$newDir"
	newPath="$newDir""/""$filename"
	echo $x, $newPath
	ps2pdf "$x" "$newPath"
	#./pdfsizeopt/pdfsizeopt --use-jbig2=no "$x" "$newPath"
done
