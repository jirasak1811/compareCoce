var etbslib = require('etbs-lib'),
    CallType = require('etbs-lib').CallType,
    TollType = require('etbs-lib').TollType;

function paramExtension(req) {
    var sql;
    var values = []

    if (req.body.extFrom && req.body.extTo) {
        sql = ' caller BETWEEN ? AND ? '
        values.push(req.body.extFrom);
        values.push(req.body.extTo)
    }

    return {
        sql: sql,
        values: values
    };
}

function paramStartTime(req) {
    var sql;
    var values = [];

    if (req.body.dateFrom && req.body.dateTo) {
        sql = ' startTime BETWEEN ? AND ? '
        values.push(req.body.dateFrom);
        values.push(req.body.dateTo)
    }

    return {
        sql: sql,
        values: values
    };
}

function paramCallType(req) {
    var sql;
    var values = [];

    if (req.body.dirOUT)
        values.push(CallType.Outgoing);

    if (req.body.dirIN)
        values.push(CallType.Incoming);

    if (req.body.dirINT)
        values.push(CallType.Internal);

    // we only add condition when select 1-2 call types.
    // if none or all 3 are selected, no need to add condition in where statement
    switch (values.length) {
    case 1:
        sql = ' callType = ? '
        break;

    case 2:
        sql = ' callType IN (?, ?) '
        break;
    }

    return {
        sql: sql,
        values: values
    };
}

function paramTollType(req) {
    var sql;
    var values = [];

    if (req.body.tollFree)
        values.push(TollType.Free);

    if (req.body.tollLocal)
        values.push(TollType.Local);

    if (req.body.tollDomestic)
        values.push(TollType.Domestic);

    if (req.body.tollMobile)
        values.push(TollType.Mobile);

    if (req.body.tollInter)
        values.push(TollType.International);

    // we only add condition when select 1-4 call types.
    // if none or all 3 are selected, no need to add condition in where statement
    switch (values.length) {
    case 1:
        sql = ' tollType = ? '
        break;

    case 2:
        sql = ' tollType IN (?, ?) '
        break;
    case 3:
        sql = ' tollType IN (?, ?, ?) '
        break;

    case 4:
        sql = ' tollType IN (?, ?, ?, ?) '
        break;
    }

    return {
        sql: sql,
        values: values
    };
}

function paramDuration(req) {
    var sql;
    var values = []

    if (req.body.durationFrom && req.body.durationTo) {
        sql = ' duraiton BETWEEN ? AND ? '
        values.push(req.body.durationFrom);
        values.push(req.body.durationTo)
    }

    return {
        sql: sql,
        values: values
    };
}

function paramCharge(req) {
    var sql;
    var values = []

    if (req.body.chargeFrom && req.body.chargeTo) {
        sql = ' duraiton BETWEEN ? AND ? '
        values.push(req.body.chargeFrom);
        values.push(req.body.chargeTo)
    }

    return {
        sql: sql,
        values: values
    };
}

function paramLimit(req) {
    var sql;
    var values = []

    if (req.body.limitFrom && req.body.limitTo) {
        sql = ' LIMIT ?,? '
        values.push(req.body.limitFrom);
        values.push(req.body.limitTo)
    }

    return {
        sql: sql,
        values: values
    };
}

function paramBuild(req) {
    var params = {};
    var sql = '';
    var values = [];

    params.extension = paramExtension(req);
    params.startTime = paramStartTime(req);
    params.callType = paramCallType(req);
    params.tollType = paramTollType(req);
    params.duration = paramDuration(req);
    params.charge = paramCharge(req);
    params.limit = paramLimit(req);

    if (params.extension.sql) {
        sql = ' WHERE ' + params.extension.sql;
        values = params.extension.values;
    }

    if (params.startTime.sql) {
        sql += !sql ? ' WHERE ' : ' AND ';
        sql += params.startTime.sql;
        values = values.concat(params.startTime.values);
    }

    if (params.callType.sql) {
        sql += !sql ? ' WHERE ' : ' AND ';
        sql += params.callType.sql;
        values = values.concat(params.callType.values);
    }

    if (params.tollType.sql) {
        sql += !sql ? ' WHERE ' : ' AND ';
        sql += params.tollType.sql;
        values = values.concat(params.tollType.values);
    }

    if (params.duration.sql) {
        sql += !sql ? ' WHERE ' : ' AND ';
        sql += params.duration.sql;
        values = values.concat(params.duration.values);
    }

    if (params.charge.sql) {
        sql += !sql ? ' WHERE ' : ' AND ';
        sql += params.charge.sql;
        values = values.concat(params.charge.values);
    }

    return {
        sql: sql,
        values: values
    };
}

exports.buildWhere = paramBuild;
exports.buildLimit = paramLimit;
