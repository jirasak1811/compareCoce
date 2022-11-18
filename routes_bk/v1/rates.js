var express = require('express');
var router = express.Router();
var database = require('./database');

router.get('/', function (req, res, next) {
    res.render('v1/tariff', {
        title: 'Tariff',
        table: 0
    });
});

// router.post('/new/:tableId', function (req, res, next) {
//     console.log(req.body.data)
//     console.log(req.params.tableId)
//     res.json([])
// });



router.get('/:tableId', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT id, ratename, day, timefrom, timeto, charge, surcharge FROM ?? ORDER BY ratename, day, timefrom',
                values: ['rate_' + req.params.tableId]
            },
                function (err, rows) {
                    if (!err)
                        res.send(JSON.stringify(rows));
                    else
                        res.status(500).send(err);

                    conn.release();
                });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/p/:tableid/:page/:count', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT COUNT(*) total FROM ??',
                values: ['rate_' + req.params.tableid]
            }, function (err, rows) {
                if (rows) {
                    var total = rows[0].total;
                    var sql = 'SELECT id, ratename, day, timefrom, timeto, charge, surcharge FROM ?? ORDER BY ratename, FIELD(day, \'Monday\', \'Tuesday\', \'Wednesday\', \'Thursday\', \'Friday\', \'Saturday\', \'Sunday\'), timefrom LIMIT ?,?';
                    var values = [
                        'rate_' + req.params.tableid,
                        Number((req.params.page - 1) * req.params.count),
                        Number(req.params.count)
                    ];

                    conn.query({
                        sql: sql,
                        values: values
                    }, function (err, rates) {
                        if (rates) {
                            res.send(JSON.stringify({
                                total: total,
                                data: rates
                            }));
                        } else {                            
                            if (err)
                                res.status(500).send(err);
                        }
                    });
                } else {
                    if (err)
                        res.status(500).send(err);
                }
                conn.release()
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.get('/summ/:tableId', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT DISTINCT id, ratename FROM ?? ORDER BY ratename',
                values: ['rate_' + req.params.tableId]
            }, function (err, rows) {
                if (!err)
                    res.send(JSON.stringify(rows));
                else
                    res.status(500).send(err);

                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});


router.get('/daylist/:tableId/:id', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'SELECT DISTINCT id, day FROM ?? WHERE id=?',
                values: ['rate_' + req.params.tableId,
                req.params.id]
            }, function (err, rows) {
                if (!err)
                    res.send(JSON.stringify(rows));
                else
                    res.status(500).send(err);

                conn.release();
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.delete('/:tableId/:id/:day', function (req, res, next) {
    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: 'DELETE FROM ?? WHERE id=? AND day=?',
                values: [
                    'rate_' + req.params.tableId,
                    // req.params.provider.trim() == 'null' ? '' : req.params.provider.trim(),
                    req.params.id.trim(),
                    req.params.day,

                ]
            }, function (err, rows) {
                if (err)
                    res.status(500).send('Can not delete provider \'' + req.params.provider + '\' and areacode \'' + req.params.areacode + '\' from provider_' + req.params.tableId);
                else
                    res.send(JSON.stringify({
                        success: true
                    }));
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

router.post('/new/:tableId', function (req, res, next) {
    console.log("req.body", req.body);
    if (!req.body.newRateId.trim()) {
        res.status(500).send('Areacode or Rate can not empty');
        return;
    }
    database.getConnection(function (err, conn) {
                    if (conn) {
                        var sql = 'INSERT INTO ??(id, ratename, day, timefrom, timeto, charge) VALUES(?,?,?,?,?,?)';
                        var values = [
                            'rate_' + req.params.tableId,
                            req.body.newRateId.trim(),
                            req.body.newRateName.trim(),
                            req.body.newDayOfWeek,
                            req.body.newStartTime.trim(),
                            req.body.newEndTime.trim(),
                            req.body.newCharge.trim()
                        ];
                        conn.query({
                            sql: sql,
                            values: values
                        }, function (err, rows) {
                            if (err){
                                console.log(err);
                                return next(err); 
                            }
                            else
                                res.send(JSON.stringify({
                                    success: true,
                                    redirect: '/api/v1/rates/' + req.body.tableId
                                }));
                            conn.release()
                        });
                    } else {
                        res.status(500).send('Can not connect to database');
                    }
    });
    // else{
    //     if (conn) {
    //         var sql = 'INSERT INTO ??(id, ratename, day, timefrom, timeto, charge) VALUES(?,?,?,?,?,?)';
    //             var values = [
    //                 'rate_' + req.body.tableId,
    //                 req.body.newRateId.trim(),
    //                 req.body.newRateName.trim(),
    //                 req.body.newDayOfWeek,
    //                 req.body.newStartTime.trim(),
    //                 req.body.newEndTime.trim(),
    //                 req.body.newCharge.trim()
    //             ];
    
    //         conn.query({
    //             sql: sql,
    //             values: values
    //         }, function (err, rows) {
    //             if (err)
    //                 return next(err);
    //             else
    //                 res.send(JSON.stringify({
    //                     success: true,
    //                     redirect: '/api/v1/rates/' + req.body.tableId
    //                 }));
    //         });
    //     } else {
    //         res.status(500).send('Can not connect to database');
    //     }
    // }
});

router.post('/update/:tableid', function (req, res, next) {
    console.log(req.body);
    var sql;
    var values = [];
    if (req.body.name == 'id' || req.body.name == 'ratename') {
        sql = 'UPDATE ?? SET ??=? WHERE id=?';
        values = [
            'rate_' + req.params.tableid,
            req.body.name,
            req.body.value.trim() ? req.body.value.trim() : null,
            req.body['pk[id]']
        ];
    }else {
        sql = 'UPDATE ?? SET ??=? WHERE id=? AND timefrom=? AND timeto=? AND charge=?';
        values = [
            'rate_' + req.params.tableid,
            req.body.name,
            req.body.value.trim() ? req.body.value.trim() : null,
            req.body['pk[id]'],
            req.body['pk[timefrom]'],
            req.body['pk[timeto]'],
            req.body['pk[charge]']
        ];
    }
    console.log(req.body);

    database.getConnection(function (err, conn) {
        if (conn) {
            conn.query({
                sql: sql,
                values: values
            }, function (err, rows) {
                conn.release()
                if (err)
                    res.send(JSON.stringify(err));
                else
                    res.send(JSON.stringify({
                        success: true
                    }));
            });
        } else {
            res.status(500).send('Can not connect to database');
        }
    });
});

module.exports = router;
