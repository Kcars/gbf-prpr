const rq = require("request");

////

const Twitter = require("twitter");
const config = require("./config.json");

const client = new Twitter(config);

////

const redis = require("redis");
const redis_client = redis.createClient();

const KEY_GBF_STATS = "gbf_raids_stats";
const KEY_GBF_CODES = "gbf_raids_codes";
const KEY_GBF_RAIDS = "gbf_raids";
const KEY_GBF_POSTERS = "gbf_raids_poster";

////

const Utils = require("./Utils.js");

////

const method = "statuses/filter";
const track = "I need backup,Lv90,Lv1,ID";
const tweet_type = "streaming";

let last_cd = 0;
let past_cd = 0;

////

function run() {
    getJPPosters().then((follow) => {
        let stream = client.stream(method, { track, follow });

        stream.on("error", (err) => {
            console.log(err);
            setTimeout(() => {
                console.log(`[ERROR] error found. exited after 10 seconds.`);
                stream = null;
                process.exit(1);
            }, 1000 * 10);
        });

        stream.on("data", (event) => {
            last_cd++;
            doParseTweet(event, tweet_type);
        });
    })

}

function doCheckStatus() {
    let diff_cd = last_cd - past_cd;
    if (diff_cd < 10) {
        console.log(`[INFO] restart service.`);
        process.exit(0);
    } else {
        console.log(`[INFO] last_cd=${last_cd} , past_cd=${past_cd} , diff_cd=${diff_cd}`);
        past_cd = last_cd;
    }
}

function doParseTweet(tweet, by) {
    let screen_name = tweet.user.screen_name;
    let content = tweet != null && tweet.text != null ? tweet.text.replace(/(\r\n|\n|\r)/gm, " ") : "";
    let time = new Date(tweet.created_at);
    let tweet_time = Utils.doParseTime(time);
    let time_num = new Date(tweet.created_at).getTime();
    let regex = /([0-9a-z]+)[\s][\D]+[\s]([0-9a-z]+)[\s](\D.+) /gi;
    let res = "";
    let is_target_tweet = (content.indexOf("参加者募集！") != -1 || content.indexOf("I need backup") != -1) && content.indexOf("ルームID") == -1;

    if (is_target_tweet) {
        try {
            res = regex.exec(content);
        } catch (err) {
            console.log(err);
        }

        if (res == null) {
            let regex_noob = /([0-9a-z]+)[\s][\D]+[\s](\D.+)/gi;
            let res_temp = "";
            if (content.indexOf("四大天司") != -1 || content.indexOf("Primarchs") != -1) {
                try {
                    res_temp = regex_noob.exec(content);
                } catch (err) {
                    console.log(err);
                }

                if (res_temp != null) {
                    res = ["", res_temp[1], "200", "四大天司HL"];
                }
            }

            if (content.indexOf("Huanglong & Qilin") != -1 || content.indexOf("黄龍・黒麒麟") != -1) {
                try {
                    res_temp = regex_noob.exec(content);
                } catch (err) {
                    console.log(err);
                }

                if (res_temp != null) {
                    res = ["", res_temp[1], "120", "黄龍・黒麒麟HL"];
                }
            }
        }

        if (res != null) {
            let level_pre = res[2].replace("Lv", "");
            let level = parseInt(level_pre, 10);
            let boss_name = res[3];
            let code = res[1];

            if (level == null) {
                console.log(`[WARN] level=${level} , level_pre=${level_pre} , text=${tweet.text}`);
            }

            if (level > 0 && boss_name.length > 0 && code.length == 8) {

                let type = Utils.getType(level, boss_name);

                let obj = {
                    type
                    , level
                    , code
                    , boss_name
                    , screen_name
                    , tweet_time
                    , time_num
                    , by
                };

                let obj_str = JSON.stringify(obj);

                redis_client.sismember(KEY_GBF_CODES, code, (err, res) => {
                    if (res != 1) {
                        redis_client.sadd(KEY_GBF_CODES, code, (err, res) => {
                            redis_client.rpush(KEY_GBF_RAIDS, obj_str);
                            redis_client.hincrby(KEY_GBF_STATS, by, 1);
                            
                            doPostToEs(obj);

                            redis_client.scard(KEY_GBF_CODES, (err, res) => {
                                if (res > 10000) {
                                    redis_client.del(KEY_GBF_CODES, (err, res) => {
                                        console.log(`[INFO] DELETE ${KEY_GBF_CODES} set.`)
                                    });
                                }
                            })
                        })
                    }
                })
            }
        } else {
            //console.log(`[WARN] regex failed. text=${tweet.text}`);
        }
    }
}

function doPostToEs(obj) {
    let dd = Utils.getDate();
    let tid = obj.type;
    let level = obj.level;
    let code = obj.code;
    let boss_name = obj.boss_name;
    let screen_name = obj.screen_name;
    let post_time = new Date(obj.time_num).toISOString();

    let index_name = `gbf_raids-${dd}` ;
    let url = `${config.es_url}/${index_name}/doc/`

    let method = "POST";
    let json = {
        boss_name
        , level
        , tid
        , code
        , post_time
        , screen_name
    };

    const options = {
        url,
        method,
        json
    }

    rq(options, (err, res) => {
        if (err) { console.log(err); }
    });
}

function getJPPosters() {
    return new Promise((resolve, reject) => {
        redis_client.srandmember(KEY_GBF_POSTERS, 500, (err, res) => {
            follow = res.join(",");
            resolve(follow);
        })
    })
}

setInterval(doCheckStatus, 1000 * 60 * 2);

run();