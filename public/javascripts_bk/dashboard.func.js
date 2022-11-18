// this is client which will be loaded from browser
function clock() {
    $('#today').html(moment().format('DD-MM-YYYY'));
    $('#now').html(moment().format('HH:mm:ss'));
}

function labelFormatter(label, series) {
    return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
}

function getSystemInfo() {
    $.getJSON('/api/v1/dashboard/system/info').done(function (data) {
        var dfree = data.diskfree / 1024 / 1024 / 1024;
        var dtotal = data.disktotal / 1024 / 1024 / 1024;
        free = dfree.toFixed(1);
        var percent = (Math.round(dfree) / dtotal.toFixed(1) * 100).toFixed(1) + '%';
        //var percent = Math.round(dtotal) + '%';
        $('#disk-free').html(free + ' GB');
        $('#disk-free-percent').html(percent);
        $('#disk-free-bar').css('width', percent);

        if (data.connector) {
            if (document.getElementsByTagName('html')[0].lang != 'th') {
                $('#connector-status').html('Running');
            } else {
                $('#connector-status').html('กำลังทำงาน');
            }
            $('#connector-process').html('pid: ' + data.connector);
            $('#connector-font').removeClass('fa-play').addClass('fa-pause');
        } else {
            if (document.getElementsByTagName('html')[0].lang != 'th') {
                $('#connector-status').html('Not Running');
            } else {
                $('#connector-status').html('ไม่ทำงาน');
            }
            $('#connector-process').html('');
            $('#connector-font').removeClass('fa-pause').addClass('fa-play');
        }

        if (data.calculator) {
            if (document.getElementsByTagName('html')[0].lang != 'th') {
                $('#calculator-status').html('Running');
            } else {
                $('#calculator-status').html('กำลังทำงาน');
            }
            $('#calculator-process').html('pid: ' + data.calculator);
            $('#calculator-font').removeClass('fa-play').addClass('fa-pause');
        } else {
            if (document.getElementsByTagName('html')[0].lang != 'th') {
                $('#calculator-status').html('Not Running');
            } else {
                $('#calculator-status').html('ไม่ทำงาน');
            }
            $('#calculator-process').html('');
            $('#calculator-font').removeClass('fa-pause').addClass('fa-play');
        }
    });
}

function getRecentCalls() {
    $.getJSON('/api/v1/dashboard/recent/calls').done(function (data) {
        $('#recent-calls tbody').empty();
        var maxrows = 50;
        var showOut = $('#show-outbound').is(':checked');
        var showIn = $('#show-inbound').is(':checked');
        $.each(data, function (i, d) {
            d = $.parseJSON(d);

            if (maxrows && ((showOut && d.callType == 'OUT') || (showIn && d.callType == 'IN'))) {
                var hh = String('00' + Math.floor(d.duration / 3600)).slice(-2);
                var mm = String('00' + Math.floor((d.duration % 3660) / 60)).slice(-2);
                var ss = String('00' + d.duration % 60).slice(-2);
                var dir = d.callType == 'OUT' ? 'fa fa-angle-double-right text-danger' : 'fa fa-angle-double-left text-success';
                var row = '<tr>';

                if (d.tollType != 'Free' && d.called.length > 4) {
                    d.called = d.called.substr(0, d.called.length - 3) + 'XXX';
                }

                row += '<td>' + d.caller + '</td>';
                if (d.callerName == null) {
                    row += '<td>' + '-' + '</td>';
                } else {
                    row += '<td>' + d.callerName + '</td>';
                }
                row += '<td><span class=\'small ' + dir + '\')</span></td>';
                row += '<td>' + d.called + '</td>';
                row += '<td>' + (d.calledName || '') + '</td>';
                row += '<td>' + d.startTime + '</td>';
                row += '<td align="center">' + hh + ':' + mm + ':' + ss + '</td>';
                row += '<td class=\'text-right\'>' + (d.charge > 0 ? d.charge.toFixed(2) : '-') + '</td>';
                if (d.rate != null) {
                    if (d.rate.search('bpm') != -1) {
                        d.rate = d.rate.replace('bpm', ' Baht/Minute')
                    } else if (d.rate.search('bpc') != -1) {
                        d.rate = d.rate.replace('bpc', ' Baht/Call')
                    }
                }
                row += '<td class=\'hidden-xs text-right\'>' + (d.rate ? d.rate : '-') + '</td>';
                row += '<td class=\'hidden-xs text-right\'>' + (d.trunk ? d.trunk : '-') + '</td>'; // Add Trunk Data
                row += '</tr>';

                $('#recent-calls tbody').append(row);

                maxrows--;
            }
        });
        //$('#recent-calls')[0].style.display = 'block'
        //$('tbody')[1].style.height = screen.height / 2.5 + 'px'
        //$('tbody')[1].style['overflow'] = 'auto'
        //$('tbody')[1].style.display = 'block'
    });
}

function connectorControl() {
    $('a#connector-control').click(function () {
        $.post('/api/v1/dashboard/service/control', {
            command: $('#connector-status').html() == 'Running' ? 'connector-stop' : 'connector-start'
        }, function (data) {
            if (data) {
                data = $.parseJSON(data);
                if (data.stderr)
                    alert(data.stderr);
            }
        });
    });
}

function RenderChartBase() {
    var html = '<div class="box box-primary">'
    html += ' <div class="box-header with-border">'
    html += '        <i class="fa fa-bar-chart-o"></i>'
    html += '        <h3 class="box-title" data-i18n="Chart">Chart</h3>'
    html += '        <div class="box-tools pull-right">'
    html += '            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'
    html += '        </div>'
    html += '    </div>'
    html += '    <div class="box-body" >'
    html += '        <div class="col-md-8" id="bar-chart" style="height: 200px;"></div>'
    html += '        <div class="col-md-4" id="donut-chart" style="height: 200px;"></div>'
    html += '    </div>'
    html += '</div>'
    $('.chartbase').append(html)
    RenderPie([])
    RenderBar([])
    if (Cookies.get('lang') == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
}

function RenderPie(data) {
    var donutData = [
        { label: "Local", data: 30, color: "#3c8dbc" },
        { label: "Mobile", data: 20, color: "#0073b7" },
        { label: "Domistric", data: 50, color: "#00c0ef" }
    ];
    if (data != undefined) {
        donutData = data
        if (data.length == 0) {
            donutData = [
                { label: "NoData", data: 30, color: "#3c8dbc" }
            ];
        }
    }

    $.plot("#donut-chart", donutData, {
        series: {
            pie: {
                show: true,
                radius: 1,
                innerRadius: 0.5,
                label: {
                    show: true,
                    radius: 2 / 3,
                    formatter: labelFormatter,
                    threshold: 0.1
                }

            }
        },
        legend: {
            show: true
        },
        grid: {
            hoverable: true
        }
    });
}

function RenderBar(data) {
    var bardata = [
        { y: '0', a: 0, b: 0 },
        { y: '1', a: 75, b: 65 },
        { y: '2', a: 100, b: 20 },
        { y: '3', a: 5, b: 0 },
        { y: '4', a: 5, b: 40 },
        { y: '5', a: 0, b: 0 },
        { y: '6', a: 10, b: 90 },
        { y: '7', a: 0, b: 0 },
        { y: '8', a: 0, b: 0 },
        { y: '9', a: 10, b: 90 },
        { y: '10', a: 20, b: 0 },
        { y: '11', a: 0, b: 0 },
        { y: '12', a: 45, b: 0 },
        { y: '13', a: 50, b: 0 },
        { y: '14', a: 0, b: 10 },
        { y: '15', a: 80, b: 10 },
        { y: '16', a: 0, b: 90 },
        { y: '17', a: 100, b: 0 },
        { y: '18', a: 0, b: 0 },
        { y: '19', a: 0, b: 0 },
        { y: '20', a: 0, b: 0 },
        { y: '21', a: 0, b: 0 },
        { y: '22', a: 0, b: 0 },
        { y: '23', a: 0, b: 0 }
    ]

    if (data != undefined) {
        bardata = data
        if (data.length == 0) {
            bardata = [
                { y: '0', a: 0, b: 0 },
                { y: '1', a: 0, b: 0 },
                { y: '2', a: 0, b: 0 },
                { y: '3', a: 0, b: 0 },
                { y: '4', a: 0, b: 0 },
                { y: '5', a: 0, b: 0 },
                { y: '6', a: 0, b: 0 },
                { y: '7', a: 0, b: 0 },
                { y: '8', a: 0, b: 0 },
                { y: '9', a: 0, b: 0 },
                { y: '10', a: 0, b: 0 },
                { y: '11', a: 0, b: 0 },
                { y: '12', a: 0, b: 0 },
                { y: '13', a: 0, b: 0 },
                { y: '14', a: 0, b: 0 },
                { y: '15', a: 0, b: 0 },
                { y: '16', a: 0, b: 0 },
                { y: '17', a: 0, b: 0 },
                { y: '18', a: 0, b: 0 },
                { y: '19', a: 0, b: 0 },
                { y: '20', a: 0, b: 0 },
                { y: '21', a: 0, b: 0 },
                { y: '22', a: 0, b: 0 },
                { y: '23', a: 0, b: 0 }
            ];
        }
    }

    var bar = new Morris.Bar({
        element: 'bar-chart',
        resize: true,
        data: bardata ,
        barColors: ['#00a65a', '#f56954'],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['InBound', 'OutBound'],
        hideHover: 'auto'
    });

}

function getChartData() {
    var data = {
        //start: '2020-5-1 00:00:00',
        start: moment().format('YYYY-MM-DD 00:00:00'),
        end: moment().format('YYYY-MM-DD 23:59:59'),
        //end: '2020-5-1 23:59:59'
    }
    //
    var colorPieTmp = ["#3c8dbc", "#0073b7", "#00c0ef", "#699dff", "#3853ff", "#a8b2ed" ]
    //
    $.ajax({
        url: '/api/v1/dashboard/chartdata',
        type: 'POST',
        data: data,
        success: function (data) {
            //console.log(data)
            var CallType = []
            var TollType = []
            for (var i = 0; i < data.length; i++) {
                if (CallType[data[i].callType] == undefined) {
                    CallType[data[i].callType] = 1
                } else {
                    CallType[data[i].callType]++
                }
                if (data[i].callType == "OUT") {
                    if (TollType[data[i].tollType] == undefined) {
                        TollType[data[i].tollType] = 1
                    } else {
                        TollType[data[i].tollType]++
                    }
                }
            }
            //console.log("CallType ", CallType)
            //console.log("CallType OBjKey ", Object.keys(CallType))
            //console.log("TollType ", TollType)
            //console.log("TollType OBjKey", Object.keys(TollType))
            //Map Data Pie
            var PieData = []
            for (var i = 0; i < Object.keys(TollType).length; i++) {
                if (Object.keys(TollType)[i] == 'null') {
                    var tmp = {
                        'label': 'Unknow', 'data': TollType[Object.keys(TollType)[i]], 'color': colorPieTmp[i]
                    }
                } else {
                    var tmp = {
                        'label': Object.keys(TollType)[i], 'data': TollType[Object.keys(TollType)[i]], 'color': colorPieTmp[i]
                    }
                }

                PieData.push(tmp)
            }
            //Map Data Pie
            //console.log("PieData : ", PieData)
            RenderPie(PieData)
            var ChartData = []
            for (var i = 0; i < data.length; i++) {
                if (ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))] == undefined) {
                    ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))] = { Time: moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH:00') ,In: 0, Out: 0 }
                    if (data[i].callType == 'IN') {
                        ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))].In++
                    } else if (data[i].callType == 'OUT') {
                        ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))].Out++
                    } else {
                        ////console.log(data[i])
                    }
                } else {
                    if (data[i].callType == 'IN') {
                        ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))].In++
                    }
                    else if (data[i].callType == 'OUT') {
                        ChartData[parseInt(moment(data[i].startTime, 'YYYY-MM-DD HH:mm:ss Z').format('HH'))].Out++
                    }
                    else {
                        ////console.log(data[i])
                    }
                }
            }
            //console.log(ChartData)
            var mapChart = []
            for (var i = 0; i < ChartData.length; i++) {
                if (ChartData[Object.keys(ChartData)[i]] != undefined) {
                    mapChart.push({ y: Object.keys(ChartData)[i].Time, a: ChartData[Object.keys(ChartData)[i]].In, b: ChartData[Object.keys(ChartData)[i]].Out })
                }
            }
            //console.log(mapChart)
            $('#bar-chart').html('')
            RenderBar(mapChart)
        },
        error: function (err) {
            //console.log(err)
        }
    });
}

function calculatorControl() {
    $('a#calculator-control').click(function () {
        $.post('/api/v1/dashboard/service/control', {
            command: $('#calculator-status').html() == 'Running' ? 'calculator-stop' : 'calculator-start'
        }, function (data) {
            if (data) {
                data = $.parseJSON(data);
                if (data.stderr)
                    alert(data.stderr);
            }
        });
    });
}

$(document).ready(function () {
    
})