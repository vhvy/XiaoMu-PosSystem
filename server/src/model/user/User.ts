import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";


@Table({
    tableName: "user",
    timestamps: false
})
export class User extends Model<User> {

    @PrimaryKey
    @Column
    declare uid: number;

    @Column
    declare account: string;

    @Column
    declare password: string;

    @Column
    declare username: string;
}

export default User;