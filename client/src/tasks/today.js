export class TodayTasks {
    static getTodayData(ajax) {
        // 获取首页今日数据

        return ajax.get("/api/today");
    }
}