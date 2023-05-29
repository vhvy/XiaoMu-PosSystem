import EventEnum from "@/constants/event"

type EventHandler = (payload: any) => void

type EventList = {
    [P in EventEnum]?: EventHandler[]
}

export class EventBus {
    private eventList: EventList = {}

    public subscribe(type: EventEnum, handler: EventHandler) {

        if (!this.eventList[type]) {
            this.eventList[type] = [];
        }

        !this.eventList[type]!.includes(handler) && this.eventList[type]!.push(handler);
    }

    public publish(type: EventEnum, payload: any) {
        if (this.eventList[type]) {
            for (let handler of this.eventList[type]!) {
                handler(payload);
            }
        }
    }

    public removeSubscribe(type: EventEnum, handler: EventHandler) {
        if (this.eventList[type]) {
            this.eventList[type] = this.eventList[type]!.filter(item => item !== handler);
        }
    }
}

export default new EventBus();