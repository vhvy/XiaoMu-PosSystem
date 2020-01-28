import React, { useState, useEffect, useMemo } from "react";
import styled from "../../../../../styles/warehouse/commodity.scss";
import { Tree, Icon, Modal, Form, Input, message, TreeSelect } from "antd";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
    setCategorySelectAction,
    setCategoryExpandAction,
    setCategoryCheckAction,
    setCategoryInitTreeAction,
    deleteCategoryAction,
    createCategoryAction,
    updateCategoryNameAction,
    setCategoryParentAction
} from "../../../../../redux/action";
import { useAjax } from "../../../../AjaxProvider";
import { CategoriesTask } from "../../../../../tasks/categories";
import config from "../../../../../config";
import { CustomSelectTree } from "../../../../../components/CustomSelectTree";

const { DEFAULT_CATEGORIES_PARENT: BASE_TREE } = config;

const { TreeNode } = Tree;

function renderNodes(tree, isSelect = false) {
    if (isSelect) {
        return tree.map(({ id, name }) => (
            <TreeSelect.TreeNode icon={<Icon type="tags" />} value={name} title={name} key={id} />
        ));
    }
    return tree.map(({ id, name, children }) => {
        if (children) {
            return (
                <TreeNode icon={<Icon type="tags" />} title={name} key={id} >
                    {
                        renderNodes(children)
                    }
                </TreeNode>
            )
        } else {
            return (
                <TreeNode icon={<Icon type="tag" />} title={name} key={id} />
            );
        }
    });
}

export function Categories() {
    const { tree, checkedKeys, expandedKeys, selectKeys, categoryList } = useSelector(state => state.warehouse.categories);

    const dispatch = useDispatch();

    const ajax = useAjax();

    async function initTree(action = setCategoryInitTreeAction, ...args) {
        // 初始化分类树

        try {
            const { data } = await CategoriesTask.getCategoriesTree(ajax);
            dispatch(action(data, ...args));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        initTree(setCategoryInitTreeAction);
    }, []);

    function handleCheck(keys) {
        dispatch(setCategoryCheckAction(keys));
    }

    function handleExpand(keys) {
        dispatch(setCategoryExpandAction(keys));
    }

    function handleSelect(keys) {
        keys[0] && dispatch(setCategorySelectAction(keys));
    }


    const [rightMenu, setRightMenu] = useState(null);
    const [modalStatus, setModalStatus] = useState({
        status: false,
        type: "change_name"
    });

    function hideModal() {
        setModalStatus(s => ({
            ...s,
            status: false
        }));
    }

    function handleRightClick({ event, node }) {
        const { eventKey } = node.props;
        const { pageX, pageY } = event;

        let data = {};
        if (eventKey === BASE_TREE) {
            data = {
                left: pageX,
                top: pageY,
                isBaseTree: true,
                key: eventKey
            }
        } else {
            const isParent = !categoryList.find(i => i.id === eventKey).parent_id;
            // 是否是一级分类

            data = {
                left: pageX,
                top: pageY,
                isParent,
                key: eventKey
            };
        }


        setRightMenu(data);
        // 设置右键菜单的坐标和相应信息
    }

    useEffect(() => {

        function clearRightMenu() {
            // 清理右键菜单

            setRightMenu(null);
        }

        if (rightMenu) {
            window.addEventListener("click", clearRightMenu);

            return () => window.removeEventListener("click", clearRightMenu);
        }
    }, [rightMenu]);

    const RightMenu = useMemo(() => {

        if (rightMenu === null) return null;

        const { top, left, isParent, key, isBaseTree } = rightMenu;

        function handleCreateCategory() {
            setModalStatus(() => ({
                status: true,
                type: "create_category"
            }));
        }

        function handleCreateChild() {
            setModalStatus(() => ({
                status: true,
                type: "create_child"
            }));
        }

        function handleChangeName() {
            setModalStatus(() => ({
                status: true,
                type: "change_name"
            }));
        }

        function handleEditParent() {
            setModalStatus(() => ({
                status: true,
                type: "edit_parent"
            }));
        }

        function handleDelete() {

            const { name } = categoryList.find(i => i.id === key);

            async function del(cb) {
                try {
                    await CategoriesTask.deleteCategory(ajax, name);
                    message.success("分类删除成功!");
                    initTree(deleteCategoryAction, key);
                } catch (error) {
                    console.log(error);
                }
                cb();
            }

            Modal.confirm({
                title: `确定要删除${name}分类吗?`,
                okType: "danger",
                okText: "删除",
                onOk: del
            });
        }

        const baseItems = [
            {
                title: "修改名称",
                fn: handleChangeName
            },
            {
                title: "删除分类",
                fn: handleDelete,
                check_css: true
            },
            {
                title: "修改父分类",
                fn: handleEditParent,
                not_parent: true
            },
            {
                title: "创建子分类",
                fn: handleCreateChild,
                not_child: true
            },
            {
                title: "创建新分类",
                fn: handleCreateCategory,
                not_child: true,
                base_tree: true
            }
        ];

        const items = isBaseTree ? (baseItems.filter(i => i.base_tree)) : (baseItems.filter(i => (isParent ? !i.not_parent : !i.not_child)));
        // 根据触发右键菜单的节点是否是一级分类筛选出需要的菜单

        const isDisabled = !!(isParent && categoryList.find(i => i.parent_id === key));
        // 删除菜单是否禁用的flag

        const menuHeight = items.length * 41;
        // 右键菜单的高度

        const diff = window.innerHeight - (top + menuHeight);
        // 鼠标点击位置的坐标加上右键菜单高度是否超出了屏幕范围

        const topOffset = diff < 0 ? Math.abs(diff) : 0;
        // 右键菜单固定定位top值的偏移值

        const menu = (
            <div
                className={styled["right-menu"]}
                style={{
                    top: top - topOffset,
                    left: left + 10
                    // left向右偏移10个像素，防止误点
                }}
            >
                {
                    items.map(({ title, fn, check_css }) => {
                        const css = [styled["menu-item"]];

                        const event = {};

                        check_css && isDisabled ? css.push(styled["disable"]) : (event["onClick"] = fn);

                        return (
                            <div
                                className={css.join(" ")}
                                key={title}
                                {...event}
                            >
                                {title}
                            </div>
                        )
                    })
                }
            </div>
        );

        return menu;
    }, [rightMenu]);

    return (
        <div className={styled["categories"]}>
            <Tree
                checkable
                showIcon={true}
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                selectedKeys={selectKeys}
                onCheck={handleCheck}
                onExpand={handleExpand}
                onSelect={handleSelect}
                onRightClick={handleRightClick}
            >
                <TreeNode
                    title="全部分类"
                    key={BASE_TREE}
                    icon={<Icon type="folder" />}
                >
                    {
                        renderNodes(tree)
                    }
                </TreeNode>
            </Tree>
            {RightMenu}
            <RightMenuModal
                {...modalStatus}
                hideModal={hideModal}
                categoryList={categoryList}
                selectKey={rightMenu && rightMenu.key || ""}
                ajax={ajax}
                initTree={initTree}
                tree={tree}
            />
        </div>
    );
}

function RightMenuModal({ status, type, hideModal, selectKey, tree, categoryList, ajax, initTree }) {


    const [newCateValue, setNewCateValue] = useState("");
    const [newChildValue, setNewChildValue] = useState({
        parent: "",
        child: ""
    });

    const { parent, child } = newChildValue;

    const [renameValue, setNewName] = useState({
        old_name: "",
        new_name: ""
    });

    const { old_name, new_name } = renameValue;

    const [changeParent, setParent] = useState({
        child_name: "",
        old_parent_name: "",
        new_parent_name: ""
    });

    const { child_name, old_parent_name, new_parent_name } = changeParent;

    function check(value, fn) {
        const v = value.trim();
        if (v === "") {
            return message.error("请输入正确的分类名!");
        }

        if (v.length > 6) {
            return message.error("分类名最长不能超过6个字!");
        }

        for (let { name } of categoryList) {
            if (name === v) return message.error(`分类${v}已存在!`)
        }

        return fn(v);
    }

    async function createCategory() {
        async function run(v) {
            try {
                await CategoriesTask.createCategory(ajax, v);
                message.success(`分类${v}创建成功!`);
                hideModal();
                initTree(createCategoryAction);
            } catch (error) {
                console.log(error);
            }
        }

        await check(newCateValue, run);
    }

    async function createChildCategory() {
        async function run(v) {
            try {
                await CategoriesTask.createChildCategory(ajax, v, parent);
                message.success(`分类${v}创建成功!`);
                hideModal();
                initTree(createCategoryAction);
            } catch (error) {
                console.log(error);
            }
        }

        await check(child, run);
    }

    async function changeCateName() {
        async function run(v) {
            try {
                await CategoriesTask.updateCategoryName(ajax, old_name, v);
                message.success(`分类${old_name}已更名为${new_name}!`);
                hideModal();
                initTree(updateCategoryNameAction);
            } catch (error) {
                console.log(error);
            }
        }

        await check(new_name, run);
    }

    async function changeCateParent() {
        try {
            await CategoriesTask.updateCategoryParent(ajax, child_name, new_parent_name);
            message.success(`分类${child_name}的父分类已更改为${new_parent_name}`);
            hideModal();
            initTree(setCategoryParentAction);
        } catch (err) {
            console.log(err);
        }

    }

    const config = [
        {
            type: "create_category",
            title: "创建新分类",
            okText: "创建",
            onOk: createCategory
        },
        {
            type: "create_child",
            title: "创建子分类",
            okText: "创建",
            onOk: createChildCategory
        },
        {
            type: "change_name",
            title: "修改分类名称",
            okText: "修改",
            onOk: changeCateName
        },
        {
            type: "edit_parent",
            title: "修改父分类",
            okText: "修改",
            onOk: changeCateParent
        }
    ];

    const { title, okText, onOk, type: _type } = config.find(i => i.type === type);

    const formItemLayout = {
        labelCol: {
            xs: {
                span: 4
            }
        },
        wrapperCol: {
            xs: {
                span: 20
            }
        }
    };

    function handleNewCateInput({ target }) {
        setNewCateValue(target.value);
    }

    function handleNewChildParent(parent) {
        setNewChildValue(s => ({
            ...s,
            parent
        }));
    }

    function handleNewChild({ target }) {
        setNewChildValue(s => ({
            ...s,
            child: target.value
        }));
    }

    function handleNewName({ target }) {
        setNewName(s => ({
            ...s,
            new_name: target.value
        }));
    }

    function handleNewParent(new_parent_name) {
        setParent(s => ({
            ...s,
            new_parent_name
        }));
    }

    useEffect(() => {
        status && (() => {
            switch (_type) {
                case "create_child":
                    setNewChildValue(() => ({
                        child: "",
                        parent: categoryList.find(i => i.id === selectKey).name
                    }));
                    break;
                case "create_category":
                    setNewCateValue("");
                    break;
                case "change_name":
                    setNewName(() => ({
                        old_name: categoryList.find(i => i.id === selectKey).name,
                        new_name: ""
                    }));
                    break;
                case "edit_parent":
                    (() => {
                        let { name: child_name, parent_id } = categoryList.find(i => i.id === selectKey);
                        setParent(() => ({
                            child_name,
                            old_parent_name: parent_id ? categoryList.find(i => i.id === parent_id).name : "",
                            new_parent_name: ""
                        }));
                    })();
                    break;
                default:
                    return;
            }
        })();
    }, [status]);


    const isCreateCate = _type === "create_category";
    const isCreateChild = _type === "create_child";
    const isChangeName = _type === "change_name";
    const isEditParent = _type === "edit_parent";

    return (
        <Modal
            visible={status}
            title={title}
            okText={okText}
            onCancel={hideModal}
            onOk={onOk}
        >
            <Form
                {...formItemLayout}
            >
                {
                    isCreateCate && (
                        <Form.Item label="名称">
                            <Input
                                value={newCateValue}
                                placeholder="请输入新分类的名称"
                                onChange={handleNewCateInput}
                            />
                        </Form.Item>
                    )
                }
                {
                    isCreateChild && (
                        <Form.Item label="父分类">
                            <TreeSelect
                                showSearch
                                treeIcon={true}
                                value={parent}
                                placeholder="请选择父分类"
                                allowClear
                                treeDefaultExpandAll
                                onChange={handleNewChildParent}
                            >
                                {
                                    renderNodes(tree, true)
                                }
                            </TreeSelect>
                        </Form.Item>
                    )
                }
                {
                    isCreateChild && (
                        <Form.Item label="名称">
                            <Input
                                value={child}
                                placeholder="请输入新分类的名称"
                                onChange={handleNewChild}
                            />
                        </Form.Item>
                    )
                }
                {
                    isChangeName && (
                        <Form.Item label="旧分类名称">
                            <Input
                                value={old_name}
                                disabled
                            />
                        </Form.Item>
                    )
                }
                {
                    isChangeName && (
                        <Form.Item label="新分类名称">
                            <Input
                                value={new_name}
                                onChange={handleNewName}
                            />
                        </Form.Item>
                    )
                }
                {
                    isEditParent && (
                        <Form.Item label="子分类名称">
                            <Input
                                value={child_name}
                                disabled
                            />
                        </Form.Item>
                    )
                }
                {
                    isEditParent && (
                        <Form.Item label="旧父分类">
                            <Input
                                value={old_parent_name}
                                disabled
                            />
                        </Form.Item>
                    )
                }
                {
                    isEditParent && (
                        <Form.Item label="新父分类">
                            <CustomSelectTree
                                value={new_parent_name}
                                onChange={handleNewParent}
                                placeholder="请选择父分类"
                                tree={tree}
                            />
                        </Form.Item>
                    )
                }
            </Form>
        </Modal>
    );
}