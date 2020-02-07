import React, { useState, useEffect } from "react";
import { SupplierTask } from "../tasks/supplier";
import { CustomSelectTree } from "./CustomSelectTree";

export function SupplierSelect({ value = "", handleChange, ajax }) {

    const [supplierList, setSupplierList] = useState([]);

    async function getSupplierList() {
        try {
            const { data } = await SupplierTask.getSupplier(ajax);
            setSupplierList(data);
            if (value === null) {
                // 如果为null 则设置为默认供货商
                handleChange(data[0].name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSupplierList();
    }, []);

    return (
        <CustomSelectTree
            placeholder="选择供应商"
            tree={supplierList}
            onChange={handleChange}
            value={value}
        />
    )
}
