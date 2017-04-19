var express = require('express'),
    app = express();

app.use(express.static('public'));

app.get('/', function (request, response) {
    response.send('index.html');
});

app.listen(8080, function (request, response) {
    console.log('Application UI5 is running')
});