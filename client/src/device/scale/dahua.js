import { convertToZoneBitCode } from "chinese-to-zone-bit-code";
import { PromiseSocket } from "../../tools/promiseSocket";

export class DahuaScale {
    constructor(host = "192.168.0.150", port = 4001) {
        this.socket = new PromiseSocket(port, host);
    }

    convertDataToPlu(data) {
        // 转换商品信息为plu信息

        function convertToCent(s) {
            if (s > 9999.99) return 999999;

            let str = s * 100 + "";
            // 转单位元为分

            function setLen(s) {
                if (s.length === 6) return s;
                // 6个字符的长度直接返回

                if (s.length > 6) return setLen(s.slice(s, s.length - 1));
                // 如果字符长度大于6， 从最后一位开始删减

                if (s.length < 6) return setLen("0" + s);
                // 字符长度如果小于6，从字符串前方开始补零
            }

            return setLen(str);
        }

        return data.map(({ plu_code, code, name, unit_price }) => {
            return `!0V${plu_code}A${code}${convertToCent(unit_price)}000000000803000000000000000000000000000000000000000000000000B${convertToZoneBitCode(name)}C${convertToZoneBitCode(name)}D${convertToZoneBitCode(name)}E`;
        });

        /**PLU信息
        * !0V0001A2281080002000000000000803000000000000000000000000000000000000000000000000B186642525027C186642525028D186642525028E
        * !0V	为协议序号(固定)  
        * 0001	为PLU序号	（0001~4000）
        * A		为分隔符
        * 2281080 为商品代码	（7位）
        * 002000	为单价		（6位）	单位为: 分 / kg[此时表示单价为: 20元 / kg]
        * 0		为称重方式	（1位）	0：称重		1：计件		2：定重
        * 00		为特殊信息1	（2位）
        * 00		为特殊信息2	（2位）
        * 00		为特殊信息3	（2位）
        * 008		为有效期	（3位）
        * 03		为店名号	（2位）
        * 00		为部门号	（2位）
        * 0000000000000	为13位数字代号	（13位）
        * 01000	为皮重		（5位）单位为: g[此时表示皮重为: 1 kg]
        * 00		为标签号	（2位）[此时表示调用第0号标签]
        * 02      为是否打折  （2位）[00：不按时间段自动调单价，手动不可以调单价；01：按时间段自动调单价，手动不可以调单价；02：按时间段自动调单价，手动可以调单价；]
        * 01		为第一时间段起始时间(2位)
        * 06		为第一时间段结束时间(2位)
        * 10		为第一时间段内折掉(2位)
        * 07		为第二时间段起始时间(2位)
        * 12		为第二时间段结束时间(2位)
        * 20		为第二时间段内折掉(2位)
        * 13		为第三时间段起始时间(2位)
        * 18		为第三时间段结束时间(2位)
        * 30		为第三时间段内折掉(2位)
        * 19		为第四时间段起始时间(2位)
        * 24		为第四时间段结束时间(2位)
        * 40		为第四时间段内折掉(2位)
        * [此时表示：从凌晨1点到6点这段时间内，商品价格为正常价格的90 %，从早上7点到12点时间段内，商品价* 格为正常价格的80 %，从下午13点到18点时间段内，商品价格为正常价格的70 %，从晚上19点到24点时间段* 内，商品价格为正常价格的60 %，由于此PLU的打折项选择了02，所以每到一个时间段，单价便会按预设自动* 打折。] 
        * B		为分隔符
        * 186642525027	为商品名1区位码
        * C		为分隔符
        * 186642525028	为商品名2区位码
        * D		为分隔符
        * 186642525029	为商品名3区位码
        * E		为分隔符
        */
    }

    async sendPlu({ data, onItemEnd, onEnd, onError }) {

        /**
         * data = [{
         *     plu_code: 1,     // PLU代码，热键编码
         *     code: 2281080,   // 商品代码
         *     unit_price: 12,  // 公斤单价
         *     name: "测试商品"  //  商品名称
         * }]
         * 
         * onItemEnd 某条PLU数据更新完成的回调函数
         * onEnd 所有PLU数据更新完成时的回调函数
         * onError PLU数据更新出错时的回调函数
         */

        const plu_code_list = this.convertDataToPlu(data);

        const end_code_buffer = Buffer.from([0x0d, 0x0a]);


        let index = 0;
        for (let plu of plu_code_list) {
            const plu_buffer = Buffer.from(plu);
            const buffer = Buffer.concat([plu_buffer, end_code_buffer]);
            try {
                const data = await this.socket.write(buffer);
                onItemEnd(index, data);
                index++;
            } catch (error) {
                onError(error);
                return;
            }
        }

        onEnd();
    }
}