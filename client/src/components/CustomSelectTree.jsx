import React from "react";
import { Icon, TreeSelect } from "antd";


function renderSelectNodes(tree, onlyParent = false) {
    const { TreeNode } = TreeSelect;

    if (onlyParent) {
        return tree.map(({ id, name }) => (
            <TreeNode icon={<Icon type="tags" />} value={name} title={name} key={id} />
        ));
    }
    return tree.map(({ id, name, children }) => {
        if (children) {
            return (
                <TreeNode icon={<Icon type="tags" />} value={name} title={name} key={id} >
                    {
                        renderSelectNodes(children)
                    }
                </TreeNode>
            )
        } else {
            return (
                <TreeNode icon={<Icon type="tag" />} value={name} title={name} key={id} />
            );
        }
    });
}

export function CustomSelectTree({
    value,
    onChange,
    tree,
    onlyParent = false,
    placeholder,
    expandAll = false
}) {
    return (
        <TreeSelect
            showSearch
            treeIcon={true}
            value={value}
            placeholder={placeholder}
            allowClear
            treeDefaultExpandAll={expandAll}
            onChange={onChange}
        >
            {
                renderSelectNodes(tree, onlyParent)
            }
        </TreeSelect>
    );
}