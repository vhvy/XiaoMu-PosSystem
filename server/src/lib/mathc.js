import * as _math from "mathjs";
import math from "mathjs";

const __math = process.env.NODE_ENV === "development" ? math : _math;
/**
 * mathjs在webpack打包后的表现不一致
 */

export const mathc = {
    addList: (list) => {
        return __math.number(list.reduce((a, b) => __math.add(__math.bignumber(a), __math.bignumber(b)), 0));
    },
    add: (a, b) => {
        return __math.number(__math.add(__math.bignumber(a), __math.bignumber(b)));
    },
    subtract: (a, b) => {
        return __math.number(__math.subtract(__math.bignumber(a), __math.bignumber(b)));
    },
    multiply: (a, b) => {
        return __math.number(__math.multiply(__math.bignumber(a), __math.bignumber(b)));
    },
    divide: (a, b) => {
        return __math.number(__math.divide(__math.bignumber(a), __math.bignumber(b)));
    },
    round: (a, bit = 2) => {
        return __math.round(a, bit);
    }
}