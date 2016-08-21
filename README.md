# Usage

## First, make sure you have all the dependencies installed:
```sh
npm install
```

## To start application

```sh
gulp
```

## If you want open on browser automatically, use flag open, like below:
```sh
gulp --open
```
Browser is editable on gulpfile.

## To compile project for production
```sh
gulp clean
gulp build-prod
```

## To push to internal
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
