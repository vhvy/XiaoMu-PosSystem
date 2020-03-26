import moment from "moment";

export function getNextDayStartTimeStrap(time_stamp) {
    // 获取下一天00:00的时间戳
    return moment(Number(time_stamp)).add(1, "day").startOf("day").format("x");
}

export function getWeekendStartTimeStrap(end_time_stamp) {
    // 获取指定日期一周前的时间戳

    return moment(end_time_stamp).subtract(6, "day").startOf("day").format("x");
}

export function getNightTimeStrap(str) {
    // 获取指定日期午夜00:00的时间戳，默认返回今天午夜00:00的时间戳

    const time = str ? new Date(str) : new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    return new Date(`${year}/${month}/${day}`).getTime();
}


export function getFormatTime(_timestamp, type) {

    // type
    // year, month, day, hour

    const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);

    const time = timestamp ? new Date(timestamp) : new Date();
    const year = time.getFullYear();

    if (type === "year") return year;


    const now_month = time.getMonth() + 1;
    const month = now_month < 10 ? "0" + now_month : now_month;

    if (type === "month") return `${year}/${month}`;

    const now_day = time.getDate();
    const day = now_day < 10 ? "0" + now_day : now_day;

    if (type === "day") return `${year}/${month}/${day}`;


    const now_hours = time.getHours();
    const hours = now_hours < 10 ? "0" + now_hours : now_hours;

    if (type === "hour") return hours;

    const now_minute = time.getMinutes();
    const minute = now_minute < 10 ? "0" + now_minute : now_minute;
    const now_sec = time.getSeconds();
    const sec = now_sec < 10 ? "0" + now_sec : now_sec;

    return `${year}/${month}/${day} ${hours}:${minute}:${sec}`;
}

export function createTimerangeKey(start_time, end_time, maxTime, type) {

    let start_time_instance = moment(Number(start_time));
    let end_time_instance = moment(Number(end_time));

    function format(i) {
        return i > 9 ? i + "" : "0" + i;
    }

    function formatTime(list) {
        return list.map((i, index) => index === 0 ? i : (index === 1 ? format(i + 1) : format(i))).join("/");
    }

    const config = [
        {
            type: "hour",
            fn: () => {
                end_time_instance.endOf("day");
                start_time_instance = moment(Number(end_time_instance.format("x"))).startOf("day");

                let list = [];

                for (let i = 0; i < 24; i++) {
                    list.push(format(i));
                }

                return [
                    Number(start_time_instance.format("x")),
                    Number(end_time_instance.format("x")),
                    list
                ];
            }
        },
        {
            type: "day",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");
                const end_day = end_time_instance.get("date");

                let list = [];

                const end_time_list = [end_year, end_month, end_day];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month"),
                        start_time_instance.get("date")
                    ];
                }

                let nowStartTime = getStartTime();

                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "day");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        },
        {
            type: "month",
            fn: () => {
                if ((Number(end_time) - Number(start_time)) > maxTime) {
                    start_time_instance = moment(Number(end_time) - maxTime);
                }

                const start_time_stamp = Number(start_time_instance.format("x"));
                const end_time_stamp = Number(end_time_instance.format("x"));

                const end_year = end_time_instance.get("year");
                const end_month = end_time_instance.get("month");

                let list = [];

                const end_time_list = [end_year, end_month];
                const end_time_text = end_time_list.join("/");

                function getStartTime() {
                    return [
                        start_time_instance.get("year"),
                        start_time_instance.get("month")
                    ];
                }

                let nowStartTime = getStartTime();

                while (end_time_text !== nowStartTime.join("/")) {
                    list.push(nowStartTime);
                    start_time_instance.add(1, "month");
                    nowStartTime = getStartTime();
                }

                list.push(end_time_list);
                return [
                    start_time_stamp,
                    end_time_stamp,
                    list.map(arr => formatTime(arr))
                ];
            }
        }
    ];

    const { fn } = config.find(i => i.type === type);

    return fn();
}
