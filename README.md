![logo](http://ww2.sinaimg.cn/large/61ff0de3gw1e7m89xtn9ej201k017t8i.jpg) seesaw ![npm](https://badge.fury.io/js/seesaw.png)
---

a quick-setup springboard server working around client-side cross-domain requests

### How to install

````
$ npm install seesaw
````

### Using as Express middleware

````
var seesaw = require('seesaw').redirect;

// incert before custom routers
app.use('/someDir',seesaw('http://abc.com/apis')) // the base url you wanna mock
````

### Use CLI

(now building...)

````
$ sudo npm install seesaw -g
$ swwsaw -r http://abc.com/apis -p 9999 // mock http://abc.com/apis running on port[9999]
````

### Using as signle spring server

````javascript
var Seesaw = require('seesaw');

// init a server instance
var server = new Seesaw('http://abc.com/apis'); // the base url you wanna mock

// start sever
server.run(1234);
````

### How to seesaw ?

make sure your client-side scripts work like this:

````javascript
// jQuery Demo:
// this request will be redirected by seesaw server to URL http://abc.com/apis/user/1234567
$.get('http://mockserver:port/user/1234567',function(result){
    // and callback real response
});
````

### Features

- quick setup
- develeoper friendly
- express middleware supported

### Pull Request Welcome !

- fork this repo
- feel free to add your feature
- make sure your feature are fully tested!
- send me a PR, and enjoy !