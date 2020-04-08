import SupplierManage from "../suppliers.js";
import CategoryManage from "../categories.js";
import CommodityTask from "../commodity.js";
import config from "../../config/index.js";

const { default_supplier } = config;

export default class ImportCommdityManage {
    static async importData(rules, data) {
        // 导入数据

        const {
            barcode_exist,
            category_exist,
            supplier_exist
        } = rules;

        const current_category_value = await CategoryManage.getCategoriesDetails();
        // 当前数据库中所有分类信息

        const current_supplier_list = (await SupplierManage.getSupplierDetails()).map(({ name }) => name);
        // 当前数据库中所有供应商名称

        const current_category_list = current_category_value.map(({ name }) => name);
        // 当前数据库中所有分类名称

        let create_count = 0;
        let update_count = 0;
        let skip_count = 0;

        async function handleCategory(category_name) {
            // 处理分类

            if (current_category_list.includes(category_name)) {
                return current_category_value.find(i => i.name === category_name).id;
            }
            // 当分类已经存在时返回对应id

            if (!category_exist) return false;
            // 当分类不存在时跳过此商品

            const { lastID } = await CategoryManage.createCategory(category_name);
            // 否则就创建分类

            current_category_value.push({
                id: lastID,
                name: category_name
            });
            // 将新创建的分类信息传入列表中

            current_category_list.push(category_name);
            // 将新创建的分类名称传入列表中

            return lastID;
        }

        async function handleSupplier(supplier_name) {
            // 处理供应商

            if (!supplier_name) return default_supplier;
            // 当商品信息没有供应商时返回默认供应商



            if (current_supplier_list.includes(supplier_name) || supplier_exist) return supplier_name;
            // 当供应商已经存在时或者规则设为使用默认供应商时直接返回供应商

            await SupplierManage.createSupplier(supplier_name);
            // 否则就创建供应商

            current_supplier_list.push(supplier_name);
            // 将新创建的供应商名称传入列表中

            return supplier_name;
        }


        for (let item of data) {
            const {
                barcode,
                category_name,
                supplier_name,
                ...fields
            } = item;

            const result = await CommodityTask.getCommodityDetails(barcode);
            // 查找是否含有条码对应的商品
            if (result) {
                // 此条码的商品已经存在
                if (!barcode_exist) {
                    // 规则为跳过商品， 则跳过此商品
                    skip_count++;
                    continue;
                } else {
                    // 否则就更新商品信息
                    const category_id = await handleCategory(category_name);

                    if (category_id === false) {
                        skip_count++;
                        continue;
                        // 当规则设置为跳过时直接跳过此商品
                    }

                    const base_supplier_name = await handleSupplier(supplier_name);

                    let updateValue = {
                        ...fields,
                        current_barcode: result.barcode,
                        category_name,
                        supplier_name: base_supplier_name
                    };


                    await CommodityTask.updateCommodityValue(updateValue);
                    update_count++;
                }
            } else {
                // 无此条码，创建商品

                const category_id = await handleCategory(category_name);
                if (category_id === false) {
                    skip_count++;
                    continue;
                    // 当规则设置为跳过时直接跳过此商品
                }

                const base_supplier_name = await handleSupplier(supplier_name);

                await CommodityTask.createCommodity({
                    ...fields,
                    barcode,
                    category_id,
                    supplier_name: base_supplier_name
                });

                create_count++;
            }
        }

        return {
            create_count,
            update_count,
            skip_count
        };

    }
}