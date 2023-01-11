# Google Charts Node Application Server with ExpressJS

[Google Charts Node](https://github.com/typpo/google-charts-node)

`npm install -g nodemon`

`nodemon index.js`

---

## Building your image

`docker build -t rahulbaruah/google-charts-express -f Dockerfile ./`

## Run the image

`docker run -p 49160:8080 -d rahulbaruah/google-charts-express`

## Print the output of your app

```bash
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
```

**If you need to go inside the container you can use the exec command:**

`docker exec -it <container id> /bin/bash`

`docker exec -it --user root e0365658aa79 /bin/bash`

## Test

`docker ps`

`curl -i localhost:49160`

## Shut down the image

`docker kill <container id>`

**Confirm that the app has stopped**
`curl -i localhost:49160`

## Troubleshoot

`docker run --rm -it buildkite/puppeteer:latest /bin/sh`

## Custom node modules from github

`npm install https://github.com/<username>/<repository>/tarball/<branch>`

Or in package.json add the following:

`"custom_module": "https://github.com/<username>/<repository>/tarball/master"`
