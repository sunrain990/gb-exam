/**
 * Created by kevin on 16/5/27.
 */
var mysql = require('mysql');
var pool;
var conn;

var database = 'project';

var os = require('os');


function handleError (database) {

    var ipv4;

    if(os.networkInterfaces().eth1){
        for(var i=0;i<os.networkInterfaces().eth1.length;i++){
            if(os.networkInterfaces().eth1[i].family=='IPv4'){
                ipv4=os.networkInterfaces().eth1[i].address;
            }
        }
        var hostname = os.hostname();
        //console.log(hostname,ipv4);
        if(ipv4 == '121.41.41.46'){
            conn = mysql.createConnection({
                host: 'rdsf39n5tp6w482946xa.mysql.rds.aliyuncs.com',
                user: 'ecp_test',
                password: 'ecp_test',
                database: database,
                port: 3306
            });
            console.log('informal,single');
        }else if(ipv4 == '121.41.123.2'){
            conn = mysql.createConnection({
                host: 'rdsvy6jrfrbi2a2.mysql.rds.aliyuncs.com',
                user: 'ecp',
                password: 'CqmygDsx2s_MYSQL',
                database: database,
                port: 3306
            });
            console.log('formal,single');
        }else if(ipv4 == '120.26.245.233'){
            conn = mysql.createConnection({
                host: 'rdsf39n5tp6w482946xa.mysql.rds.aliyuncs.com',
                user: 'ecp_test',
                password: 'ecp_test',
                database: database,
                port: 3306
            });
            console.log('test,single');
        }
    }else if(os.networkInterfaces().lo0){
        for(var i=0;i<os.networkInterfaces().lo0.length;i++){
            if(os.networkInterfaces().lo0[i].family=='IPv4'){
                ipv4=os.networkInterfaces().lo0[i].address;
            }
        }
        if(ipv4 == '127.0.0.1'){
            conn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: database,
                port: 3306
                //,
                //multipleStatements: true
            });
            console.log('localhost');
        }
    }



    //conn = mysql.createConnection({
    //    host:'rdsvy6jrfrbi2a2.mysql.rds.aliyuncs.com',
    //    user:'ecp',
    //    password:'CqmygDsx2s_MYSQL',
    //    database:'project',
    //    port:'3306'
    //});

    //连接错误，2秒重试
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(function() {
                handleError(database) , 2000
            });
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError(database);
        }
        if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'){
            handleError(database);
        } else {
            handleError(database);
        }
    });

    setInterval(function(){
        conn.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
            if (err) throw err;

            console.log('The solution is: ', rows[0].solution);
        });
    },3600000);
    console.log('mysql ready!');
}
handleError(database);

function handlePool (database) {

    var ipv4;

    if(os.networkInterfaces().eth1){
        for(var i=0;i<os.networkInterfaces().eth1.length;i++){
            if(os.networkInterfaces().eth1[i].family=='IPv4'){
                ipv4=os.networkInterfaces().eth1[i].address;
            }
        }
        var hostname = os.hostname();
        //console.log(hostname,ipv4);
        if(ipv4 == '121.41.41.46'){
            pool = mysql.createPool({
                host: 'rdsf39n5tp6w482946xa.mysql.rds.aliyuncs.com',
                user: 'ecp_test',
                password: 'ecp_test',
                database: database,
                port: 3306
            });
            console.log('informal');
        }else if(ipv4 == '121.41.123.2'){
            pool = mysql.createPool({
                host: 'rdsvy6jrfrbi2a2.mysql.rds.aliyuncs.com',
                user: 'ecp',
                password: 'CqmygDsx2s_MYSQL',
                database: database,
                port: 3306
            });
            console.log('formal');
        }else if(ipv4 == '120.26.245.233'){
            pool = mysql.createPool({
                host: 'rdsf39n5tp6w482946xa.mysql.rds.aliyuncs.com',
                user: 'ecp_test',
                password: 'ecp_test',
                database: database,
                port: 3306
            });
            console.log('test');
        }
    }else if(os.networkInterfaces().lo0){
        for(var i=0;i<os.networkInterfaces().lo0.length;i++){
            if(os.networkInterfaces().lo0[i].family=='IPv4'){
                ipv4=os.networkInterfaces().lo0[i].address;
            }
        }
        if(ipv4 == '127.0.0.1'){
            pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: database,
                port: 3306
                //,
                //multipleStatements: true
            });
            console.log('localhost');
        }
    }

}
handlePool(database);



var Mysql = {
    single: conn,
    pool: pool,
    //query: function (sql,param2,callback){
    //    if(typeof param2 === 'function'){
    //        this.getConnection(function (err, connection){
    //            connection.query(sql, function (){
    //                param2.apply(connection, arguments);
    //                console.log(connection.threadId);
    //                connection.release();
    //            });
    //        })
    //    }else if(typeof param2 === 'object'){
    //        this.getConnection(function (err,connection){
    //            connection.query(sql,param2,function (){
    //                callback.apply(connection, arguments);
    //                console.log(connection.threadId);
    //                connection.release();
    //            });
    //        })
    //    }
    //
    //}.bind(pool)
}

module.exports = Mysql;