import { Table, Column, Model } from "sequelize-typescript";


@Table({
    tableName: "product",
    timestamps: false
})
export class Product extends Model<Product> {

    @Column
    declare name: string;

    @Column
    declare price: number;
}

export default Product;