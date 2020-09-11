./bin/build.sh
aws lambda update-function-code --function-name xkcd-cors-lambda --zip-file fileb://build/dist.zip