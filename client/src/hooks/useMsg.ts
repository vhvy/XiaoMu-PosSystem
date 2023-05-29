import { NoticeType } from "@/components/Notice";
import EventBus from "@/utils/event";
import EventEnum from "@/constants/event";

const useMsg = () => {

    const addMsg = (message: string, type: NoticeType, timeout: number) => {
        EventBus.publish(EventEnum.NOTICE, {
            message,
            type,
            timeout
        });
    }

    return {
        notice(msg: string, type: NoticeType, timeout: number = 2000) {
            addMsg(msg, type, timeout);
        },
        success(msg: string, timeout: number = 2000) {
            this.notice(msg, "success", timeout);
        },
        error(msg: string, timeout: number = 2000) {
            this.notice(msg, "error", timeout);
        },
        info(msg: string, timeout: number = 2000) {
            this.notice(msg, "info", timeout);
        },
        warning(msg: string, timeout: number = 2000) {
            this.notice(msg, "warning", timeout);
        }
    };
}

export default useMsg;