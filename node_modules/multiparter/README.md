# nodejs module to make POST file uploads

Module allows to send POST requests with `Content-type: multipart/form-data`
with files and any [readable streams](http://nodejs.org/docs/v0.6.0/api/streams.html#readable_Stream).

## Installation

`npm install multiparter`

## API

* `var request = new multiparter.request(protocol, options)`

    Create request object. For protocol you may pass `http` or `https` module,
    `options` is request options object just like for `http.request`.

* `request.setParam(field, value)`

    Set plain field value for your request.

* `request.addStream(field, fileName, mimeType, streamLength, stream)`

    Add stream to request and assign it to specified field.
    Stream must have mime type (pass `application/octet-stream` if unsure)
    and length to calculate request length without loading whole stream data into memory.

* `request.send(callback)`

    Send request and receive `error` as first argument of callback
    and `response` as second (usual [http.ClientResponse](http://nodejs.org/docs/v0.6.0/api/http.html#http.ClientResponse)
    or [https.ClientResponse](http://nodejs.org/docs/v0.6.0/api/https.html#https.ClientResponse) object)

## Example

```javascript
var fs          = require("fs");
var http        = require("http");
var multiparter = require("multiparter");

// test host, but it works
var request = new multiparter.request(http, {
    host: "bobrik.name",
    port: 80,
    path: "/test2.php",
    method: "POST"
});

// add some plain params here
request.setParam("here", "we are");
request.setParam("again", "ok bye!");

// add files you need with readable stream
// don't forget to crete file test.txt
request.addStream(
    "myfile",
    "test.txt",
    "text/plain",
    19,
    fs.createReadStream("test.txt")
);

// send request and receive response
request.send(function(error, response) {
    if (error) {
        console.log(error);
    }

    var data = "";

    response.setEncoding("utf8");

    response.on("data", function(chunk) {
        data += chunk;
    });

    response.on("end", function() {
        console.log("Data: " + data);
    });

    response.on("error", function(error) {
        console.log(error);
    });
});
```

## Authors
- Ian Babrou (ibobrik@gmail.com)