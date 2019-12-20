export function getNightTimeStrap(str) {
    // 获取指定日期午夜00:00的时间戳，默认返回今天午夜00:00的时间戳

    const time = str ? new Date(str) : new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return new Date(`${year}/${month}/${day}`).getTime();
}