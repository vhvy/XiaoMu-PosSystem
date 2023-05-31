import EventBus from "@/utils/event";
import EventEnum from "@/constants/event";
import { DialogConfig } from "@/components/XMDialog";


const useDialog = () => {

    return {
        confirm(config: DialogConfig) {
            EventBus.publish(EventEnum.DIALOG, config);
        }
    };
}

export default useDialog;