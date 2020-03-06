import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useAjax } from "../../../../AjaxProvider";
import { SearchFn } from "./SearchFn";
import { Categories } from "./Categories";
import { CommodityList } from "./CommodityList";
import { CommodityForm } from "./CommodityForm";
import { CommodityTasks } from "../../../../../tasks/commodity";
import {
    setWareSelectCommodityAction,
    createWareCommodityAction,
    setCategorySelectAction,
} from "../../../../../redux/action";
import { getFormatTime } from "../../../../../tools/time";
import config from "../../../../../config";
import { Modal, message } from "antd";

const { DEFAULT_CATEGORIES_PARENT: base_tree } = config;

const selector = ({ warehouse }) => ({
    showKeys: warehouse.categories.currentShowKeys,
    selectId: warehouse.commodity.selectId,
    selectType: warehouse.commodity.selectType,
    categoryList: warehouse.categories.categoryList
});

let newCommodityIdFlag = null;
let queryCommodityIdFlag = null;

export function Commodity() {

    const ajax = useAjax();
    const dispatch = useDispatch();

    const [spinStatus, setSpinStatus] = useState(false);

    const setSelect = useCallback((data) => {
        dispatch(setWareSelectCommodityAction(data));
    }, [dispatch]);

    const { showKeys, selectId, selectType, categoryList } = useSelector(selector, shallowEqual);

    const [originList, setOriginList] = useState([]);
    // 当前要展示的所有商品

    async function updateCommodity(id, new_data) {
        const list = originList.map(i => {
            if (i.id === id) {
                return new_data;
            }
            return i;
        });
        setOriginList(list);
    }

    async function getCommodity(id) {


        try {
            const { data } = await CommodityTasks.queryByCategory(ajax, showKeys);
            setOriginList(data);


            if (data.length === 0) return;
            // 切换需要展示的商品
            if (id) {
                dispatch(createWareCommodityAction(id));
            } else if (newCommodityIdFlag) {
                dispatch(createWareCommodityAction(newCommodityIdFlag));
            } else if (queryCommodityIdFlag) {


                let selectId = queryCommodityIdFlag;
                setTimeout(() => {
                    setSelect({
                        selectId,
                        selectType: "down"
                    });
                });

                queryCommodityIdFlag = null;
            } else {
                setSelect({
                    selectId: data[0] && data[0].id || -1,
                    selectType: "origin"
                });
            }

            setSpinStatus(false);
        } catch (err) {
            console.log(err);
        }
    }

    function createCommodityFlush(new_data) {
        // 新商品信息参数可选

        if (!showKeys.includes(new_data.category)) {
            // 如果新建商品所在分类不在需要展示的分类列表里
            // 或者当前没有选择任何分类
            // 将分类设置为新建商品所属分类

            newCommodityIdFlag = new_data.id;
            dispatch(setCategorySelectAction([new_data.category_id + ""]));
        } else {
            setSpinStatus(true);
            getCommodity(new_data.id);
        }
    }

    const commodityList = useMemo(() => {
        return originList.map(({ work_date, change_date, ...args }) => ({
            ...args,
            work_date: getFormatTime(work_date),
            change_date: getFormatTime(change_date)
        }));
    }, [originList]);
    // 经过处理的商品列表

    useEffect(() => {
        if (showKeys.length === 0) return;
        setSpinStatus(true);
        getCommodity();
    }, [showKeys]);




    useEffect(() => {
        return () => setSelect({
            selectId: -1,
            selectType: "origin"
        });
    }, []);

    async function handleSearch(_query) {
        const query = _query.trim();
        if (query === "") return;

        try {
            const { data } = await CommodityTasks.query(ajax, query, true);
            if (data.length === 0) return;

            const { id, category_id } = data[0];

            queryCommodityIdFlag = id;
            dispatch(setCategorySelectAction([category_id + ""]));
        } catch (error) {
            console.log(error);
        }
    }

    const selectCommodity = useMemo(() => {
        const result = originList.find(i => i.id === selectId);


        if (!result) return result;
        const { category, ...keys } = result;

        return {
            ...keys,
            category_name: category
        };
    }, [originList, selectId]);

    const _Categories = useMemo(() => (<Categories />), []);
    // 左侧分类管理界面

    const value = useMemo(() => {
        const length = commodityList.length;
        const index = commodityList.findIndex(i => i.id === selectId);
        const lastItemIndex = commodityList[length - 1] && length - 1 || -1;

        function getId(index) {
            return commodityList[index].id;
        }

        function handleUpSelect() {
            if (length < 2 || index === 0) return;
            setSelect({
                selectId: getId(index - 1),
                selectType: "up"
            });
        }

        function handleDownSelect() {
            if (length < 2 || index === lastItemIndex) return;
            setSelect({
                selectId: getId(index + 1),
                selectType: "down"
            });
        }

        return {
            handleUpSelect,
            handleDownSelect,
            can_edit: length !== 0 && selectId !== -1
        };
    }, [commodityList, selectId]);

    const categories = useMemo(() => {
        if (!showKeys[0]) return undefined;
        if (showKeys[0] === base_tree) return undefined;
        const result = categoryList.find(i => i.name === showKeys[0]);

        return result && result.name || undefined;
    }, [categoryList, showKeys]);

    const [drawerData, setDrawerData] = useState({
        status: false,
        type: "add"
    });

    function addCommodity() {
        setDrawerData({
            status: true,
            type: "add"
        });
    }

    function editCommodity() {
        setDrawerData({
            status: true,
            type: "edit"
        });
    }

    function closeAddDrawer() {
        setDrawerData(s => ({
            ...s,
            status: false
        }));
    }

    function handleDelCommodity() {

        const name = selectCommodity && selectCommodity.name || "此商品";

        async function del(cb) {
            try {
                await CommodityTasks.deleteCommodity(ajax, selectCommodity.barcode);
                message.success(`${name}删除成功!`);

                let sel = {
                    selectType: "origin"
                };

                const index = commodityList.findIndex(i => i.id === selectId);
                const length = commodityList.length;
                if (index === length - 1 && length >= 2) {
                    // 当前商品列表长度大于等于2且当前选中商品是最后一个商品时
                    // 将倒数第二个商品设置为当前选中商品
                    sel.selectId = commodityList[length - 2].id;
                } else if (index < length - 1 && length >= 2) {
                    // 当前商品列表长度大于等于2且当前选中商品不是最后一个商品时
                    // 将当前选中商品的下一个商品设置为当前选中商品

                    sel.selectId = commodityList[index + 1].id;
                } else {
                    // 否则就不选中任何商品

                    sel.selectId = -1;
                }

                setSelect(sel);
                setOriginList(list => list.filter(i => i.id !== selectId));
            } catch (error) {
                console.log(error);
            }
            cb();
        }

        Modal.confirm({
            okText: "删除",
            okType: "danger",
            title: `确认要删除${name}吗?`,
            onOk: del
        });
    }

    return (
        <div className={styled["commodity-wrap"]}>
            <SearchFn
                value={value}
                handleAdd={addCommodity}
                handleEdit={editCommodity}
                handleDel={handleDelCommodity}
                handleSearch={handleSearch}
            />
            <div className={styled["bottom-wrap"]}>
                {_Categories}
                <CommodityList
                    commodityList={commodityList}
                    setSelect={setSelect}
                    selectId={selectId}
                    selectType={selectType}
                    spinStatus={spinStatus}
                />
            </div>
            <CommodityForm
                status={drawerData.status}
                type={drawerData.type}
                hideFn={closeAddDrawer}
                selectCommodity={selectCommodity}
                categories={categories}
                flushFn={createCommodityFlush}
                updateFn={updateCommodity}
            />
        </div>
    );
}