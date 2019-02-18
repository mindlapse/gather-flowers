docker build -t mindlapse/gather-flowers .
docker run -it -v `pwd`/images:/data -e `cat .auth` mindlapse/gather-flowers
