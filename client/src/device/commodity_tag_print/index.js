export class CommodityTagPrint {

    static async print(data) {

        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Print: ", data);
                resolve();
            }, 2000);
        });
    }
}