var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'myapp',
    streams:[
        {
            level: 'info',
            path: './logs/tokenTransfer.log'
        }
    ]
});

module.exports = logger;