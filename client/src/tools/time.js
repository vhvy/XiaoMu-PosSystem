export function getFormatTime(_timestamp) {

    if (_timestamp) {
        const timestamp = (typeof _timestamp === "number") ? _timestamp : Number(_timestamp);
        return convert(new Date(timestamp));
    }

    return convert(new Date());

    function convert(time) {
        const year = time.getFullYear();
        const now_month = time.getMonth() + 1;
        const month = now_month < 10 ? "0" + now_month : now_month;
        const now_date = time.getDate();
        const date = now_date < 10 ? "0" + now_date : now_date;
        const now_hours = time.getHours();
        const hours = now_hours < 10 ? "0" + now_hours : now_hours;
        const now_minute = time.getMinutes();
        const minute = now_minute < 10 ? "0" + now_minute : now_minute;
        const now_sec = time.getSeconds();
        const sec = now_sec < 10 ? "0" + now_sec : now_sec;

        return `${year}/${month}/${date} ${hours}:${minute}:${sec}`;
    }
}