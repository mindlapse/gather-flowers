
# Gather Flowers

Gathers images tagged with 'flower' or 'flowers' from Flickr and stores them in /data in the container.
Images are skipped unless dimensions are at least 1024x1024
There is a 3 second delay between each request

## Environment
See the install section for info on how these are provided to container through the kube yamls:
API_KEY - The API_KEY must be provided to the container as an environment variable.
START_TS - The app proceeds in date-ascending order, and the initial start time is specified as a unix timestamp


## Install
See ```kube/README.md```


