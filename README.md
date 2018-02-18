# DockiQL

## About

[GraphiQL](https://github.com/graphql/graphiql/) in Docker.

As my backend in Php is, I needed to be able to set the debug option.
And it does not work with Browser extension such as  [ChromeIql](https://github.com/ermanc/ChromeiQL/) 


## Security Concerns

As you are going to use a browser, you wil hit the CORS problem. Ie the browser by default does not allow you to make a request to another domain if this domain does not allow it.

There is actually three solutions:
  * put the public directory on your server and don't use the docker image
  * disable web security when starting your browser
```bash
chromium-browser --disable-web-security --user-data-dir
```
  * allow the request by configuring your server with the CORS headers. Example for the whole `www` directory:
```
<Directory /var/www/>
	<IfModule mod_headers.c>
      Header set Access-Control-Allow-Origin "http://graphiql"
      Header set Access-Control-Allow-Headers "Content-Type"
      Header set Access-Control-Allow-Credentials "true"
    </IfModule>
</Directory>
```


## Docker command, if you want to 

### Get DockiQL

Start DockiQL without modifying the code:
```bash
docker run \
    --name DockiQL \
    -p 70:80 \
    --rm \
    gerardnico/dockiql:1.0.0
```

### Modify DockiQL
  * When you want to develop or modify the code (with [cmder](http://cmder.net/) as console)
```bash
git clone https://github.com/gerardnico/DockiQL .
MOUNT_POINT=$(cygpath -u $(readlink -f ./public/))
docker run \
   --name DockiQL \
   -p 80:80 \
   --rm \
   --detach \
   --mount type=bind,source=/$MOUNT_POINT,target=/usr/local/apache2/htdocs/ \
   httpd:2.4
```

### Build the docker Image

When you want to build the docker image
```bash   
docker build -t gerardnico/dockiql:1.0.0 .
```


## Credits

This project was largely inspired by:
  * [ChromeIql](https://github.com/ermanc/ChromeiQL/)
  * the [GraphiQL example](https://github.com/graphql/graphiql/tree/master/example) that shows how to use it directly the GraphiQL minifed script.
