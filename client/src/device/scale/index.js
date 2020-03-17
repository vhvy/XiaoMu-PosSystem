// import { DahuaScale } from "./dahua";
import { WebFakeScale } from "./webFakeScale";

// export const ScaleList = [
//     {
//         name: "大华电子秤",
//         port: 4001,
//         host: "192.168.0.150",
//         // ScaleClass: DahuaScale
//     },
//     {
//         name: "顶尖电子秤",
//         port: 5001,
//         host: "192.168.2.150"
//     }
// ];

export const ScaleList = [
    {
        name: "大华电子秤",
        port: 4001,
        host: "192.168.0.150",
        ScaleClass: WebFakeScale
    },
    {
        name: "顶尖电子秤",
        port: 5001,
        host: "192.168.2.150",
        ScaleClass: WebFakeScale
    }
];

export default ScaleList;