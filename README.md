# DockiQL

## About

A project in order to get [GraphiQL](https://github.com/graphql/graphiql/) available in a docker container because as my backend in Php was, I needed to have [GraphiQL](https://github.com/graphql/graphiql/) 
rendered by a web server and not by a browser extension to enable the debugging functionality.

This project was largely inspired by [ChromeIql](https://github.com/ermanc/ChromeiQL/)


## Docker command
  * When you want to develop (with [cmder](http://cmder.net/) as console)
```bash
MOUNT_POINT=$(cygpath -u $(readlink -f ./public/))
docker run -dit \
   --name DockiDL 
   -p 80:80 \
   -v "$PWD": 
   --mount type=bind,source=/$MOUNT_POINT,target=/usr/local/apache2/htdocs/
   httpd:2.4
```

  * When you want to build the docker image
```bash   
docker build -t my-apache2 .
```
