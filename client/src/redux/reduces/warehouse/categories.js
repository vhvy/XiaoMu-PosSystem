import {
    WARE_CATEGORY_SELECT,
    WARE_CATEGORY_EXPAND,
    WARE_CATEGORY_TREE,
    WARE_CATEGORY_CHECK,
    WARE_CATEGORY_DELETE,
    WARE_CATEGORY_SET_PARENT,
    WARE_CATEGORY_CREATE,
    WARE_CATEGORY_RENAME
} from "../../action/actionType";
import config from "../../../config";

const { DEFAULT_CATEGORIES_PARENT: TREE_BASE_KEY } = config;

const initState = {
    tree: [],
    // 分类节点

    checkedKeys: [],
    // 复选框选中key

    expandedKeys: [TREE_BASE_KEY],
    // 当前展开的分组key数组

    selectKeys: [],
    // 当前鼠标点选选中的节点key

    categoryList: [],
    // 分类节点数组

    currentShowKeys: []
    // 当前需要展示下属商品的所有的商品分类
}



export function categories(state = initState, action) {

    function makeNeedShowKeys(keys) {

        if (keys.includes(TREE_BASE_KEY)) return [TREE_BASE_KEY];

        const show_key_list = [];
        // 需要展示的商品分类key列表

        const child_key_list = [];

        for (let { id, parent_id } of state.categoryList) {
            if (!keys.includes(id)) { continue; }
            // 不在当前keys列表则跳过循环
            if (parent_id) {
                child_key_list.push({
                    id,
                    parent_id
                });
            } else {
                show_key_list.push(id);
            }
        }
        for (let { id, parent_id } of child_key_list) {
            !show_key_list.includes(parent_id) && show_key_list.push(id);

            // 子分类的父分类key不在需要展示列表内时将其入列
        }

        const list = [];
        // 经过排序后的商品分类key列表

        for (let { id, name } of state.categoryList) {
            show_key_list.includes(id) && list.push(name);
        }
        return list;
    }

    function mapDataToTree(data) {
        const tree = [];
        const hasParentList = [];
        const categoryList = [];

        for (let { id, name, parent_id } of data) {

            const item = {
                id: id + "",
                name,
            };

            if (parent_id !== null) {
                item.parent_id = parent_id + "";
                hasParentList.push(item);
            } else {
                tree.push(item);
            }

            categoryList.push(item);
        }

        for (let t of hasParentList) {
            const item = tree.find(({ id }) => id === t.parent_id);
            !item.children && (item.children = []);
            item.children.push(t);
        }

        return {
            tree,
            categoryList
        };
    }


    switch (action.type) {
        case WARE_CATEGORY_TREE:
            return {
                ...initState,
                ...mapDataToTree(action.data)
            };
        case WARE_CATEGORY_EXPAND:
            return {
                ...state,
                expandedKeys: [...action.list]
            };
        case WARE_CATEGORY_CHECK:
            return {
                ...state,
                currentShowKeys: makeNeedShowKeys(action.list),
                checkedKeys: [...action.list]
            };
        case WARE_CATEGORY_SELECT:
            return (() => {
                const { key } = action;

                const value = state.categoryList.find(i => i.id === key[0]);

                if (value && value.parent_id) {

                    return {
                        ...state,
                        expandedKeys: [TREE_BASE_KEY, value.parent_id],
                        currentShowKeys: makeNeedShowKeys(key),
                        checkedKeys: [],
                        selectKeys: key
                    };
                } else {
                    return {
                        ...state,
                        currentShowKeys: makeNeedShowKeys(key),
                        checkedKeys: [],
                        selectKeys: key
                    };
                }
            })();
        case WARE_CATEGORY_DELETE:
            return (() => {

                const { data, keys } = action;

                const checkedKeys = state.checkedKeys.includes(keys) ? state.checkedKeys.filter(i => i !== keys) : state.checkedKeys;

                const selectKeys = state.selectKeys.includes(keys) ? [] : state.selectKeys;

                const currentShowKeys = state.currentShowKeys.includes(keys) ? state.currentShowKeys.filter(i => i !== keys) : state.currentShowKeys;

                return {
                    ...state,
                    ...mapDataToTree(data),
                    checkedKeys,
                    selectKeys,
                    currentShowKeys
                };
            })();
        case WARE_CATEGORY_CREATE:
        case WARE_CATEGORY_RENAME:
        case WARE_CATEGORY_SET_PARENT:
            return {
                ...state,
                ...mapDataToTree(action.data)
            };
        default:
            return state;
    }
}