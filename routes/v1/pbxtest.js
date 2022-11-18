var express = require('express');
var passport = require('passport');
var router = express.Router();
var database = require('./database');
var ConnectRoles = require('connect-roles');
var Buffer = require('buffer').Buffer;
var BufferStream = require('bufferstream');
var net = require('net');

var host = "122.155.210.6";
var port = "3000";

router.get('/', function (req, res, next) {
    res.render('v1/pbxtest', {
        title: 'PBX Test',
        table: 0,
    });
});

router.get('/buffer_req', function (req, res, next) {
    res.render('v1/pbxtest', {
        title: 'PBX Test',
        table: 0,
    });
});

router.get('/test', function (req, res, next) {
    res.end('It worked!');
});


function connecter_nec(status) {
    if (status = "start"){
        var buffer_req = new Buffer(10);
        buffer_req[0] = 0x16; buffer_req[1] = 0x31; buffer_req[2] = 0x30; buffer_req[3] = 0x30; buffer_req[4] = 0x30; buffer_req[5] = 0x30; buffer_req[6] = 0x32; buffer_req[7] = 0x30; buffer_req[8] = 0x30; buffer_req[9] = 0xFC;
        stream_req = new BufferStream(buffer_req);
    }else if (status = "end"){

    }
    client = net.connect({ host: host, port: port }, connected);
}

function connected() {
    stream_req.pipe(client);
    console.log('server connected');
}

function calculate_parity(byte_buffer) {
    var length = byte_buffer.Length - 1;
    var parity = 0x00;
    for (i = 1; i < length; i++) {
        parity ^= buffer[i];
    }
    return (0xFF - parity);
}

module.exports = router;