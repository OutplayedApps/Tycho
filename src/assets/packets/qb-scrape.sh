#!/bin/bash

# change these depending on where you want to pull from
# for the hs archive, the URL should be 'http://www.quizbowlpackets.com'
baseurl='http://www.quizbowlpackets.com'
outdir='hs'

curl -s $baseurl | # get index page
	#grep '<SPAN class="Name">' | # extract lines containing packet links
	grep '<SPAN class="Name RecommendedSet">' | # extract lines containing packet links
	sed -e 's/^.*href="//' -e 's/">/*/' -e 's/<\/a>.*$//' | # parse url and name
	while read -r line; do
		# parse url and name for each set
		seturl=$(cut -f 1 -d '*' <(echo $line)) 
		setname=$(cut -f 2 -d '*' <(echo $line))
		setname=${setname//\//,} # remove /

		echo "Downloading packets from $setname"
		mkdir -p "$outdir/$setname"
		curl -s "$baseurl/$seturl" | # get packet listing
			sed -e 's/<\/LI>/\n/g' | # packets show up on different lines
			tr '> <' '> \n <' | # adds line breaks so grep works properly.
			grep "href=\"$baseurl/$seturl" | # lines with links to packets
			while read -r line2; do
				packurl=$(cut -f 2 -d '"' <(echo $line2))
				filename=$(sed 's/.*\///g' <(echo $packurl))
				packurl=$(echo $packurl | sed 's/ /%20/g') #url-encodes spaces.
				curl -s "$packurl" -o "$outdir/$setname/$filename"
			done
	done
