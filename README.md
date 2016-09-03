# Usage

## First, make sure you have all the dependencies installed:
### (NOTE: you must have at least node v 6.0.0)
```sh
npm install
```

## To start application:

```sh
gulp
```

## If you want to open browser automatically:
```sh
gulp --open
```
Browser is editable on gulpfile.

## To compile project for production:
```sh
gulp build-prod
```

## To push to internal:
Create a file in root of folder named .ftppass with auth information

example:
```json
{
  "privateKeyEncrypted": {
    "user": "username",
    "passphrase": "passphrase",
    "keyLocation": "~/.ssh/yourkey.pem"
  }
}
```
Then
```sh
gulp sftp-internal
```

## Not currently implemented
Scripts on package.json

Start process with Nodemon:
```sh
npm start
```

Running test specs (start application before, then):
```sh
npm test
```
