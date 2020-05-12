class Utils {

    static getDate() {
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth() + 1;
        let dd = new Date().getDate();

        mm = mm < 10 ? "0" + mm : mm.toString();
        dd = dd < 10 ? "0" + dd : dd.toString();

        return `${yy}${mm}${dd}`;
    }

    static doParseTime(val) {
        return (val.getHours() < 10 ? "0" + val.getHours() : val.getHours()) + ":" +
            (val.getMinutes() < 10 ? "0" + val.getMinutes() : val.getMinutes()) + ":" +
            (val.getSeconds() < 10 ? "0" + val.getSeconds() : val.getSeconds());
    }

    static getType(level, boss_name) {
        let result = 995;

        // wind -> fire -> water -> grand -> light -> dark

        result = level < 50 ? 999 : result;

        result = boss_name == "ティアマト・マグナ" || boss_name == "Tiamat Omega" ? 1 : result;
        result = boss_name == "コロッサス・マグナ" || boss_name == "Colossus Omega" ? 2 : result;
        result = boss_name == "リヴァイアサン・マグナ" || boss_name == "Luminiera Omega" ? 3 : result;
        result = boss_name == "ユグドラシル・マグナ" || boss_name == "Yggdrasil Omega" ? 4 : result;
        result = boss_name == "シュヴァリエ・マグナ" || boss_name == "Luminiera Omega" ? 5 : result;
        result = boss_name == "セレスト・マグナ" || boss_name == "Celeste Omega" ? 6 : result;

        if (level == 100) {
            result = boss_name == "ティアマト・マグナ＝エア" || boss_name == "Tiamat Omega Ayr" ? 100001 : result;
            result = boss_name == "コロッサス・マグナ" || boss_name == "Colossus Omega" ? 100002 : result;
            result = boss_name == "リヴァイアサン・マグナ" || boss_name == "Leviathan Omega" ? 100003 : result;
            result = boss_name == "ユグドラシル・マグナ" || boss_name == "Yggdrasil Omega" ? 100004 : result;
            result = boss_name == "シュヴァリエ・マグナ" || boss_name == "Luminiera Omega" ? 100005 : result;
            result = boss_name == "セレスト・マグナ" || boss_name == "Celeste Omega" ? 100006 : result;

            result = boss_name == "ナタク" || boss_name == "Nezha" ? 100101 : result;
            result = boss_name == "フラム＝グラス" || boss_name == "Twin Elements" ? 100102 : result;
            result = boss_name == "マキュラ・マリウス" || boss_name == "Macula Marius" ? 100103 : result;
            result = boss_name == "メドゥーサ" || boss_name == "Medusa" ? 100104 : result;
            result = boss_name == "アポロン" || boss_name == "Apollo" ? 100105 : result;
            result = boss_name == "Dエンジェル・オリヴィエ" || boss_name == "Dark Angel Olivia" ? 100106 : result;

            result = boss_name == "ガルーダ" || boss_name == "Garuda" ? 100201 : result;
            result = boss_name == "アテナ" || boss_name == "Athena" ? 100202 : result;
            result = boss_name == "グラニ" || boss_name == "Grani" ? 100203 : result;
            result = boss_name == "バアル" || boss_name == "Baal" ? 100204 : result;
            result = boss_name == "オーディン" || boss_name == "Odin" ? 100205 : result;
            result = boss_name == "リッチ" || boss_name == "Lich" ? 100206 : result;

            result = boss_name == "ラファエル" || boss_name == "Raphael" ? 100301 : result;
            result = boss_name == "ミカエル" || boss_name == "Michael" ? 100302 : result;
            result = boss_name == "ガブリエル" || boss_name == "Gabriel" ? 100303 : result;
            result = boss_name == "ウリエル" || boss_name == "Uriel" ? 100304 : result;

            result = boss_name == "黄龍" || boss_name == "Huanglong" ? 100405 : result;
            result = boss_name == "黒麒麟" || boss_name == "Qilin" ? 100406 : result;

            result = boss_name == "ゼノ・コキュートス" || boss_name == "ゼノ・コキュートス" ? 100503 : result;
            result = boss_name == "ゼノ・ウォフマナフ" || boss_name == "ゼノ・ウォフマナフ" ? 100504 : result;

            result = boss_name == "ジ・オーダー・グランデ" || boss_name == "Grand Order" ? 100905 : result;
            result = boss_name == "プロトバハムート" || boss_name == "Proto Bahamut" ? 100906 : result;
        }

        if (level == 110) {
            // max 6
            result = boss_name == "ローズクイーン" || boss_name == "Rose Queen" ? 110001 : result;
        }

        if (level == 120) {
            // max 18
            result = boss_name == "ナタク" || boss_name == "Nezha" ? 120001 : result;
            result = boss_name == "フラム＝グラス" || boss_name == "Twin Elements" ? 120002 : result;
            result = boss_name == "マキュラ・マリウス" || boss_name == "Macula Marius" ? 120003 : result;
            result = boss_name == "メドゥーサ" || boss_name == "Medusa" ? 120004 : result;
            result = boss_name == "アポロン" || boss_name == "Apollo" ? 120005 : result;
            result = boss_name == "Dエンジェル・オリヴィエ" || boss_name == "Dark Angel Olivia" ? 120006 : result;

            // max 30
            result = boss_name == "グリームニル" || boss_name == "Grimnir" ? 120101 : result;
            result = boss_name == "シヴァ" || boss_name == "Shiva" ? 120102 : result;
            result = boss_name == "エウロペ" || boss_name == "Europa" ? 120103 : result;
            result = boss_name == "ゴッドガード・ブローディア" || boss_name == "Godsworn Alexiel" ? 120104 : result;
            result = boss_name == "メタトロン" || boss_name == "Metatron" ? 120105 : result;
            result = boss_name == "アバター" || boss_name == "Avatar" ? 120106 : result;

            // max 6
            result = boss_name == "バイヴカハ" || boss_name == "Morrigna" ? 120201 : result;
            result = boss_name == "プロメテウス" || boss_name == "Prometheus" ? 120202 : result;
            result = boss_name == "カー・オン" || boss_name == "Ca Ong" ? 120203 : result;
            result = boss_name == "ギルガメッシュ" || boss_name == "Gilgamesh" ? 120204 : result;
            result = boss_name == "ヘクトル" || boss_name == "Hector" ? 120205 : result;
            result = boss_name == "アヌビス" || boss_name == "Anubis" ? 120206 : result;
        }

        if (level == 150) {
            // max 30
            result = boss_name == "アルティメットバハムート" || boss_name == "Ultimate Bahamut" ? 150006 : result;

            result = boss_name == "ルシファー" || boss_name == "Lucilius" ? 150005 : result;

            // max 18
            result = boss_name == "プロトバハムート" || boss_name == "Proto Bahamut" ? 150106 : result;

            // max 6
            result = boss_name == "ティアマト・マリス" || boss_name == "Tiamat Malice" ? 150201 : result;
        }

        result = boss_name == "青竜" || boss_name == "青竜" || boss_name == "Qinglong" ? 60001 : result;
        result = boss_name == "朱雀" || boss_name == "朱雀" || boss_name == "Zhuque" ? 60002 : result;
        result = boss_name == "玄武" || boss_name == "玄武" || boss_name == "Xuanwu" ? 60003 : result;
        result = boss_name == "白虎" || boss_name == "白虎" || boss_name == "Baihu" ? 60004 : result;

        result = boss_name == "ゼピュロス" || boss_name == "ゼピュロス" || boss_name == "Zephyrus" ? 90001 : result;
        result = boss_name == "アグニス" || boss_name == "アグニス" || boss_name == "Agni" ? 90002 : result;
        result = boss_name == "ネプチューン" || boss_name == "ネプチューン" || boss_name == "Neptune" ? 90003 : result;
        result = boss_name == "ティターン" || boss_name == "ティターン" || boss_name == "Titan" ? 90004 : result;

        result = boss_name == "黄龍・黒麒麟HL" ? 120307 : result;

        result = boss_name == "四大天司HL" ? 200007 : result;

        //if (result == 995) {
        //    redis_client.sadd(KEY_GBG_CHECK_BOSS_NAME, `${level},${boss_name}`);
        //}

        return result;
    }

    static getWFType(boss_name) {
        let result = 995;

        result = boss_name == "ヴィエ・ソラス 初級" ? 1 : result;
        result = boss_name == "不死王レシタール 中級" ? 2 : result;
        result = boss_name == "カースアークエギル 中級" ? 3 : result;

        //if (result == 995) {
        //    redis_client.sadd(KEY_GBG_CHECK_BOSS_NAME, `${level},${boss_name}`);
        //}

        return result;
    }
}

module.exports = Utils; 