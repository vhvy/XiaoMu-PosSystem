import dayjs from "dayjs";
import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";


@Table({
    tableName: "product_category"
})
export class ProductCategory extends Model<ProductCategory> {

    @PrimaryKey
    @Column
    declare id: number;

    @Column
    declare name: string;

    @Column
    get created_at(): string {
        const value = this.getDataValue("created_at");
        return dayjs(value).format("YYYY/MM/DD HH:mm:ss");
    }

    @Column
    get updated_at(): string {
        const value = this.getDataValue("updated_at");
        return dayjs(value).format("YYYY/MM/DD HH:mm:ss");
    }
}

export default ProductCategory;