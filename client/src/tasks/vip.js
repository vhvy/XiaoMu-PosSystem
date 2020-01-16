export class VipManage {
    static frontQurey(http, query) {
        return http.get(`/api/front/vip/${encodeURIComponent(query)}`);
    }
}