mkdir new
for x in *.pdf; do
echo $x;
ps2pdf "$x" "new/$x"
done