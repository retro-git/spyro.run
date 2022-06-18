const _ = require("lodash");

module.exports = function conv(string) {
    if (string.indexOf(".") > -1) {
        const time = _.replace(_.clone(string), ".", ":")
        const ret = time.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur.padEnd(3, "0") + "ms" + prev
                case 1:
                    return cur + "s" + prev
                case 2:
                    return cur + "m" + prev
                case 3:
                    return cur + "h" + prev
                default:
                    return
            }
        }, "");
        console.log(ret);
        return ret;
    }
    else {
        const ret = string.split(":").reverse().reduce((prev, cur, i) => {
            switch (i) {
                case 0:
                    return cur + "s" + prev
                case 1:
                    return cur + "m" + prev
                case 2:
                    return cur + "h" + prev
                default:
                    return
            }
        }, "");
        console.log(ret);
        return ret;
    }
}