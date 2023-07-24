import classNames from "classnames";

import XMTree from "@/components/XMTree";
import type { XMTreeItem } from "@/components/XMTree";

import classes from "./index.module.scss";

const ProductList = () => {

    const categoryData: XMTreeItem[] = [
        {
            id: 1,
            pid: 0,
            name: "一级分类"
        },
        {
            id: 2,
            pid: 0,
            name: "一级分类"
        },
        {
            id: 3,
            pid: 0,
            name: "一级分类"
        },
        {
            id: 4,
            pid: 0,
            name: "一级分类"
        },
        {
            id: 5,
            pid: 0,
            name: "一级分类"
        },
        {
            id: 6,
            pid: 1,
            name: "二级分类"
        },
        {
            id: 7,
            pid: 1,
            name: "二级分类"
        },
        {
            id: 8,
            pid: 1,
            name: "二级分类"
        },
        {
            id: 9,
            pid: 8,
            name: "三级分类"
        }
    ];

    return (
        <div className={classNames("common-card", "full-height", classes.product_container)}>
            <XMTree config={categoryData} />
            {/* ProductList */}
        </div>
    );
}

export default ProductList;