# Dependencies

The kube definitions requires a secret called 'flickr-secret' to be present with the key 'api-key' corresponding to the Flickr API Key.

You can create the secret like this, but replacing the 9s with your own key:
```
echo -n '99999999999999999999' > api-key
kubectl create secret generic flickr-secret --from-file=./api-key
rm api-key
```
