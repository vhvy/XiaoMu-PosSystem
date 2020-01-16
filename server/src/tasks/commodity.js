import AppDAO from "../data/AppDAO.js";
import CategoriesTask from "./categories.js";
import config from "../config/index.js";
import SuppliersTask from "./suppliers.js";
import { getPinyin } from "../lib/pinyin.js";

const { default_supplier } = config;

class CommodityTask {

    static async getAllCommodityDetails() {
        return await AppDAO.all(`
        SELECT * FROM commodity 
        ;`);
    }

    static async getCommodityByCategory(category) {
        /**
         * category: 分类名，String 或 String[]
         */

        function query(id) {
            return AppDAO.all(`
            SELECT * FROM commodity WHERE category_id=?
            ;`, id);
        }

        if (Array.isArray(category)) {
            const result = await Promise.all(category.map(t => this.getCommodityByCategory(t)));

            return result.reduce((arr, arr1) => [...arr, ...arr1], []);
        }

        const { id, parent_id } = await CategoriesTask.getCategoryDetails(category);

        const commodityList = await query(id);

        if (parent_id) {
            // 如果有父分类id，证明为子分类，直接返回结果即可
            return commodityList;
        } else {
            // 没有父分类id，证明为父分类，做进一步查询

            const childList = await CategoriesTask.getChildCategory(id);
            // 检查是否有子分类

            if (childList.length === 0) return commodityList;
            // 没有子分类， 直接返回结果

            const result = (await Promise.all(childList.map(
                async ({ id }) => await query(id)
            )))
                .reduce((arr, arr2) => [...arr, ...arr2], commodityList);

            return result;
        }
    }


    static async getCommodityDetailsByTimestamp(
        timestamp,
        query,
        type = "barcode"
    ) {
        // 查看某个时间的商品信息

        const result = await this.getCommodityDetails(query, type);
        if (result.change_date >= timestamp) {
            const result_snapshot = await AppDAO.get(`
            SELECT * FROM commodity_snapshot WHERE (commodity_id=? AND change_date <?) ORDER BY change_date DESC
            ;`, [result.id, timestamp]);
            if (result_snapshot) return result_snapshot;
        }

        return result;
    }

    static async getCommodityDetails(
        query,
        type = "barcode",
    ) {
        // 查看商品信息

        return await AppDAO.get(`
        SELECT * FROM commodity WHERE ${type}=?
        ;`, [query]);
    }

    static async createCommodity({
        barcode: _barcode,
        name,
        category_id,
        unit,
        size,
        supplier_name = default_supplier,
        in_price = 0.0,
        sale_price = 0.0,
        vip_points = true,
        is_delete = false
    }) {
        // 创建新的商品

        let barcode = _barcode;
        if (!barcode) {
            barcode = await this.createCustomBarcode();
        }

        const { id: supplier_id } = await SuppliersTask.getSupplierDetails(supplier_name);
        const pinyin = getPinyin(name);
        const time = new Date().getTime();
        let query = "";
        let params = [
            barcode,
            name,
            category_id,
            in_price,
            sale_price,
            vip_points ? 1 : 0,
            pinyin,
            time,
            time,
            is_delete ? 1 : 0,
            supplier_id
        ];

        if (unit) {
            query += ", unit";
            params.push(unit);
        }
        if (size) {
            query += ", size";
            params.push(size);
        }
        let placeholder = (() => {
            let list = [];
            params.forEach(() => list.push("?"));
            return `(${list.join(", ")})`;
        })();

        return await AppDAO.run(`
        INSERT INTO commodity 
        (barcode, name, category_id, in_price, sale_price, vip_points, pinyin, work_date, change_date, is_delete, supplier_id${query}) 
        VALUES 
        ${placeholder}
        ;`, params);
    }

    static async createCustomBarcode() {
        // 暂时没想到更好的解决办法，需要递增且不能重复的八位自定义条码，暂时写这么写着.


        const { lastID } = await AppDAO.run(`
        INSERT INTO custom_barcode (name) 
        VALUES (?)
        ;`, "占位");

        let code = String(lastID);
        while (code.length < 5) {
            code = "0" + code;
        }

        await AppDAO.run(`
        DELETE FROM custom_barcode WHERE id=?
        ;`, [lastID]);

        const result = await AppDAO.get(`
        SELECT id FROM commodity WHERE barcode=?
        ;`, [code]);

        if (result) {
            return await this.createCustomBarcode();
        }

        return code;
    }

    static async updateCommodityName(barcode, new_name) {
        // 修改商品名称

        const pinyin = getPinyin(new_name);

        await AppDAO.run(`
        UPDATE commodity 
        SET pinyin=?
        WHERE barcode=?
        ;`, [pinyin, barcode]);
        // 更新商品缩写

        return await AppDAO.run(`
        UPDATE commodity 
        SET name=? 
        WHERE barcode=?
        ;`, [new_name, barcode]);
    }

    static async updateCommodityCategoryID(barcode, new_category_name) {
        // 修改商品所属分类

        const { id: category_id } = await CategoriesTask.getCategoryDetails(new_category_name);
        return await AppDAO.run(`
        UPDATE commodity 
        SET category_id=? 
        WHERE barcode=?
        ;`, [category_id, barcode]);
    }

    static async updateCommodityUnit(barcode, unit) {
        // 修改商品计量单位

        return await AppDAO.run(`
        UPDATE commodity 
        SET unit=? 
        WHERE barcode=?
        ;`, [unit, barcode]);
    }

    static async updateCommoditySize(barcode, size) {
        // 修改商品规格

        return await AppDAO.run(`
        UPDATE commodity 
        SET size=? 
        WHERE barcode=?
        ;`, [size, barcode]);
    }

    static async updateCommodityInPrice(barcode, in_price) {
        // 修改商品进价

        return await AppDAO.run(`
        UPDATE commodity 
        SET in_price=? 
        WHERE barcode=?
        ;`, [in_price, barcode]);
    }

    static async updateCommoditySalePrice(barcode, sale_price) {
        // 修改商品售价

        return await AppDAO.run(`
        UPDATE commodity 
        SET sale_price=? 
        WHERE barcode=?
        ;`, [sale_price, barcode]);
    }

    static async updateCommodityVipPoints(barcode, vip_points) {
        // 修改商品是否积分

        return await AppDAO.run(`
        UPDATE commodity 
        SET vip_points=? 
        WHERE barcode=?
        ;`, [vip_points ? 1 : 0, barcode]);
    }

    static async updateCommodityBarcode(current_barcode, barcode) {
        // 修改商品条码

        return await AppDAO.run(`
        UPDATE commodity 
        SET barcode=? 
        WHERE barcode=?
        ;`, [barcode, current_barcode]);
    }

    static async updateCommodityChangedate(id, time) {
        // 修改商品修改时间 

        return await AppDAO.run(`
        UPDATE commodity 
        SET change_date=? 
        WHERE id=?
        ;`, [time, id]);
    }

    static async updateCommodityIsDelete(barcode, is_delete = false) {
        // 修改商品是否处于禁用状态

        return await AppDAO.run(`
        UPDATE commodity 
        SET is_delete=? 
        WHERE barcode=?
        ;`, [is_delete ? 1 : 0, barcode]);
    }

    static async updateCommoditySupplier(barcode, supplier_name) {
        const { id } = await SuppliersTask.getSupplierDetails(supplier_name);

        return await AppDAO.run(`
        UPDATE commodity 
        SET supplier_id=? 
        WHERE barcode=?
        ;`, [id, barcode]);
    }

    static async updateCommodityValue(update_value) {
        // 修改商品信息

        const { current_barcode } = update_value;
        const handleList = [
            {
                key: "name",
                fn: this.updateCommodityName.bind(this)
            },
            {
                key: "category_name",
                fn: this.updateCommodityCategoryID.bind(this)
            },
            {
                key: "unit",
                fn: this.updateCommodityUnit.bind(this)
            },
            {
                key: "size",
                fn: this.updateCommoditySize.bind(this)
            },
            {
                key: "in_price",
                fn: this.updateCommodityInPrice.bind(this)
            },
            {
                key: "sale_price",
                fn: this.updateCommoditySalePrice.bind(this)
            },
            {
                key: "vip_points",
                fn: this.updateCommodityVipPoints.bind(this)
            },
            {
                key: "is_delete",
                fn: this.updateCommodityIsDelete.bind(this)
            },
            {
                key: "supplier_name",
                fn: this.updateCommoditySupplier.bind(this)
            },
            {
                key: "barcode",
                fn: this.updateCommodityBarcode.bind(this)
            }
        ];
        // 务必将更新条码的函数放到最后执行。

        const snapshot = await this.getCommodityDetails(current_barcode);
        // 商品信息快照

        for (let { key, fn } of handleList) {
            const vl = update_value[key];
            if (vl) {
                await fn(current_barcode, vl);
            }
        }
        // 执行更新

        const update_time = new Date().getTime();
        // 修改商品时的时间



        await this.updateCommodityChangedate(
            snapshot["id"],
            update_time
        );
        // 修改商品的修改时间


        const {
            id, barcode, name, category_id, pinyin, unit, size, vip_points, in_price, sale_price, work_date, change_date, supplier_id
        } = snapshot;

        await this.createCommoditySnapshot({
            create_time: update_time,
            commodity_id: id,
            barcode,
            name,
            category_id,
            pinyin,
            unit,
            size,
            vip_points,
            in_price,
            sale_price,
            work_date,
            change_date,
            supplier_id
        });
        return snapshot["id"];
    }

    static async createCommoditySnapshot({
        create_time,
        commodity_id,
        barcode,
        name,
        category_id,
        pinyin,
        unit,
        size,
        vip_points,
        in_price,
        sale_price,
        work_date,
        change_date,
        supplier_id
    }) {
        return await AppDAO.run(`
        INSERT INTO commodity_snapshot 
        (create_time, commodity_id, barcode, name, category_id, pinyin, unit, size, vip_points, in_price, sale_price, work_date, change_date, supplier_id) 
        VALUES (?${", ?".repeat(13)})
        ;`, [
            create_time,
            commodity_id,
            barcode,
            name,
            category_id,
            pinyin,
            unit,
            size,
            vip_points,
            in_price,
            sale_price,
            work_date,
            change_date,
            supplier_id
        ]);
    }

    static async deleteCommodity(barcode) {
        // 删除商品

        const { id } = await this.getCommodityDetails(barcode);

        await AppDAO.run(`
        DELETE FROM commodity_snapshot WHERE commodity_id=?
        ;`, [id]);
        // 删除商品历史信息镜像

        return await AppDAO.run(`
        DELETE FROM commodity WHERE id=?
        ;`, [id]);
    }
}

export default CommodityTask;