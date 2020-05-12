
const Twitter = require("twitter");
const config = require("./config.json");

const client = new Twitter(config);

////

const redis = require("redis");
const redis_client = redis.createClient();

const KEY_GBF_STATS = "gbf_raids_stats";
const KEY_GBF_CODES = "gbf_raids_codes";
const KEY_GBF_RAIDS = "gbf_raids";
//const KEY_GBF_BOSS_NAME = "gbf_boss_name";
//const KEY_GBG_CHECK_BOSS_NAME = "gbf_boss_name_check";

////

const Utils = require("./Utils.js");

////

const method = "search/tweets";
const q = `参加者募集！ AND 参戦ID`;
const result_type = `recent`;
const count = 100;

const tweet_type = "request";

////

let since_id = null;

////

function doSearchKeyWord() {
    let options = { q, count, result_type, since_id };

    client.get(method, options, (error, tweets) => {
        if (error) { console.log(error); }
        if (tweets != null && tweets.statuses != null) {
            let first_tweet = tweets.statuses[0];
            if (first_tweet != null) {
                since_id = first_tweet.id_str;
                tweets.statuses.forEach((tweet) => {
                    doParseTweet(tweet, tweet_type);
                })
            }
        }
    })
}

function doParseTweet(tweet, by) {
    let screen_name = tweet.user.screen_name;
    let content = tweet != null && tweet.text != null ? tweet.text.replace(/(\r\n|\n|\r)/gm, " ") : "";
    let time = new Date(tweet.created_at);
    let tweet_time = Utils.doParseTime(time);
    let time_num = new Date(tweet.created_at).getTime();
    let regex = /([0-9a-z]+)[\s][\D]+[\s][a-z]+([0-9]+)[\s](\D.+) /gi;
    let res = "";

    try {
        res = regex.exec(content);
    } catch (err) {
        console.log(err);
    }

    if (res == null) {
        let regex_noob = /([0-9a-z]+)[\s][\D]+[\s](\D.+)/gi;
        let res_temp = "";

        if (content.indexOf("四大天司") != -1) {
            try {
                res_temp = regex_noob.exec(content);
            } catch (err) {
                console.log(err);
            }

            if (res_temp != null && res_temp != "") {
                res = ["", res_temp[1], "200", "四大天司HL"];
            }
        }

        if (content.indexOf("黄龍・黒麒麟") != -1) {

            try {
                res_temp = regex_noob.exec(content);
            } catch (err) {
                console.log(err);
            }

            if (res_temp != null && res_temp != "") {
                res = ["", res_temp[1], "120", "黄龍・黒麒麟HL"];
            }
        }
    }

    if (res != null) {
        let level = parseInt(res[2], 10);
        let boss_name = res[3];
        let code = res[1];

        if (level > 0 && boss_name.length > 0 && code.length > 7) {

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
                        redis_client.hincrby(KEY_GBF_STATS, type, 1);

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
    }
}

setInterval(doSearchKeyWord, 1000 * 5);
