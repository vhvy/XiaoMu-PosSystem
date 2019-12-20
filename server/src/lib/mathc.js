import _math from "mathjs";




export const math = {
    addList: (list) => {
        return _math.number(list.reduce((a, b) => _math.add(_math.bignumber(a), _math.bignumber(b)), 0));
    },
    add: (a, b) => {
        return _math.number(_math.add(_math.bignumber(a), _math.bignumber(b)));
    },
    subtract: (a, b) => {
        return _math.number(_math.subtract(_math.bignumber(a), _math.bignumber(b)));
    },
    multiply: (a, b) => {
        return _math.number(_math.multiply(_math.bignumber(a), _math.bignumber(b)));
    },
    divide: (a, b) => {
        return _math.number(_math.divide(_math.bignumber(a), _math.bignumber(b)));
    },
    round: (a, bit = 2) => {
        return _math.round(a, bit);
    }
}