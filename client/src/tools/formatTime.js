export function formatTime(time) {
    const hours = time.getHours() < 9 ? "0" + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 9 ? "0" + time.getMinutes() : time.getMinutes();
    return `${time.getFullYear()}年${time.getMonth()}月${time.getDate()}日 ${hours}:${minutes}`;
}