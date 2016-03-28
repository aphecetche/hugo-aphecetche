
for file in $(cat filelist.txt) 
do 
  search="/alice/data"
  a=$(expr match "$file" ".*$search")
  search="FILTER"
  b=$(expr match "$file" ".*$search")
  dir=${file:a+1:b-a - $(expr length "$search")-2}
  search="raw"
  d=$(expr match "$file" ".*$search")
  desc=${file:d+12:b-d-13 - $(expr length "FILTER")}
  mkdir -p $dir
  if [ ! -e $dir/runreco.log ]; then
  	echo "initialdir = "$(pwd)"/$dir"
  	echo "arguments = $file $dir"
    echo "description=$desc"
  	echo "queue"
  fi
done
