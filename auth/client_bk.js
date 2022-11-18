var express = require('express');
var md5 = require('md5');
var router = express.Router();
var database = require('../routes/v1/database');

router.post('/info', function (req, res, next) {

    if (!req.body.u.trim() && !req.body.p.trim()) {
        res.status(500).send('username or password can not empty');
        return;
    }

    database.getConnection(function (err, conn) {
        var sql = 'SELECT c.clientid, c.clientsecret FROM ?? u JOIN ?? c ON u.clientid=c.clientid WHERE u.username = ? AND u.password = ? AND is_active = 1';
        var values = [
            'users',
            'client_lic',
            req.body.u,
            md5('etbsjs' + req.body.p)
        ];

        conn.query({
            sql: sql,
            values: values
        }, function (err, client_res) {
            console.log(err)
            if (client_res) {
                console.log(sql);
                console.log(JSON.stringify(client_res));
                console.log(JSON.stringify(values));
                res.send(JSON.stringify(client_res));
            } else {
                if (err)
                    res.status(500).send(err);
            }

            conn.release();
        });
    })
});

module.exports = router;
