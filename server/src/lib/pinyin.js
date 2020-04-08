import pinyin from "pinyin";

export function getPinyin(name) {
    // 获取名称的拼音缩写首字母

    function getPinyinFirstLetter(str) {
        return pinyin(str, {
            segment: false,
            style: pinyin["STYLE_NORMAL"]
        })[0][0][0];
    }

    let PINYIN = "";
    for (let i of name) {
        if (/[\u4e00-\u9fa5]+/.test(i)) {
            PINYIN += getPinyinFirstLetter(i);
        } else {
            PINYIN += i;
        }
    }

    return PINYIN.toUpperCase();
}