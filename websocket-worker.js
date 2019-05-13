const fs = require("fs");
const config = require("./config.json");

////

const redis = require("redis");
const redis_client = redis.createClient();

const KEY_GBF_STATS = "gbf_raids_stats";
const KEY_GBF_RAIDS = "gbf_raids";

////

const WebSocketServer = require("websocket").server;
const http = require("https");

const processRequest = (req, res) => {
    let result = "ok";
    let output = { result, total_status };
    let output_str = JSON.stringify(output);

    res.setHeader("Content-Type", "application/json");

    console.log(`[INFO] receive http response. from: ${req.socket.remoteAddress}:${req.socket.remotePort}`);

    res.end(output_str);
};

const server = http.createServer({
    key: fs.readFileSync(config.prpr_key_path),
    cert: fs.readFileSync(config.prpr_cer_path)

}, processRequest).listen(8443);

///

const web_socket = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

////

web_socket.on("request", (request) => {
    let connection = request.accept("echo-protocol", request.origin);
    let output_str = getOutputInfo();

    connection_list.push(connection);

    doSendMessage(connection, output_str);

    console.log(`[INFO] connected. address=${connection.remoteAddress} , online_count=${connection_list.length}`);

    connection.on("close", () => {
        console.log(`[INFO] disconnected. address=${connection.remoteAddress} , online_count=${connection_list.length}`);
    });
});

setInterval(run, 1000 * 5);

function getOutputInfo() {
    let connections = connection_list.length;
    let rc = total_status.request;
    let sc = total_status.streaming;
    let command = "info";
    let info = { connections, rc, sc, total_status };

    let output = { command, info };
    let output_str = JSON.stringify(output);

    return output_str;
}

function run() {
    let now_date = getDate();

    redis_client.hgetall(KEY_GBF_STATS, (err, res) => {
        total_status = res;
        let output_str = getOutputInfo();

        doBroadcast(output_str);
    });

    if (start_date != now_date) {
        start_date = now_date;

        redis_client.del(KEY_GBF_STATS, (err, res) => {
            total_status = {};
            console.log(`[INFO] clear total_status.`);
        })
    }
}

function getDate() {
    let mm = new Date().getMonth() + 1;
    let dd = new Date().getDate();

    mm = mm < 10 ? "0" + mm : mm.toString();
    dd = dd < 10 ? "0" + dd : dd.toString();

    return mm + dd;
}

function doSendMessage(target, str) {
    target.sendUTF(str);
}

function doBroadcast(str) {
    connection_list.forEach((target, index, list) => {
        if (target.connected) {
            doSendMessage(target, str);
        } else {
            console.log(`[INFO] clear. address=${target.remoteAddress}`)
            list.splice(index, 1);
        }
    });
}

function doCheckQueue() {
    if (tid != null) {
        clearTimeout(tid);
        tid = null;
    }

    redis_client.lpop(KEY_GBF_RAIDS, (err, res) => {
        if (err) { console.log(err); }
        if (res != null) {
            let item = null;
            try {
                item = JSON.parse(res);
            } catch (err) {
                console.log(err);
            }

            if (item != null) {
                let command = "item";
                let output = { command, item };
                let output_str = JSON.stringify(output);

                doBroadcast(output_str);
            }
        }

        redis_client.llen(KEY_GBF_RAIDS, (err, res) => {
            if (err) { console.log(err); }
            if (res > 0) {
                doCheckQueue();
            } else {
                tid = setTimeout(doCheckQueue, 1000);
            }
        })
    });
}

let start_date = getDate();

let connection_list = [];
let tid = null;
let total_status = null;

doCheckQueue();

run();