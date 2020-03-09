import { useState, useEffect } from "react";
import { CategoriesTask } from "../tasks/categories";

export function useCategories({
    ajax,
    onlyParent = false,
    onlyHasChild = false
}) {

    const [categories, setCategories] = useState([]);

    async function getCategories() {

        try {
            const { data } = await CategoriesTask.getCategoriesTree(ajax);

            if (onlyParent) {
                // 只需要父分类
                return setCategories(data.filter(i => !i.parent_id));
            }

            if (onlyHasChild) {
                // 拥有子分类的父分类

                const hasChildIdList = data.filter(i => i.parent_id)
                    .reduce((list, { parent_id }) => {
                        !list.includes(parent_id) && list.push(parent_id);

                        return list;
                    }, []);

                return setCategories(data.filter(({ parent_id }) => hasChildIdList.includes(parent_id)));
            }


            // 全部分类
            return setCategories(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return [categories];
}