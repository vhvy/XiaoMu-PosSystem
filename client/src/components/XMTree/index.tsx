import classNames from "classnames";
import { Checkbox, CheckboxOnChangeData } from "@fluentui/react-components";
import { CaretRight12Filled } from "@fluentui/react-icons";
import { CSSProperties, useMemo, useState } from "react";
import type { MouseEvent } from "react";

import classes from "./index.module.scss";

export interface XMTreeItem {
    id: number,
    pid: number,
    name: string
}

interface XMTreeProps {
    config: XMTreeItem[]
}

const CheckType = {
    CHECKED: true,
    UNCHECKED: false,
    MIXED: "mixed"
} as const;

const createNumMap = (list: number[]) => {
    return list.reduce((o: Record<number, true>, n) => {
        o[n] = true;
        return o;
    }, {});
}


interface InternalXMTreeItem extends XMTreeItem {
    checked: typeof CheckType[keyof typeof CheckType];
    children?: InternalXMTreeItem[]
}

const XMTree = ({ config }: XMTreeProps) => {

    const defaultId = 0;

    const [checkedIdList, setCheckedIdList] = useState<number[]>([]);

    const [expandIdList, setExpandIdList] = useState<number[]>([defaultId]);

    type IdMap = Record<number, number[]>;

    type IdList = number[];

    const expandIdMap = useMemo(() => createNumMap(expandIdList), [expandIdList]);

    const [fullChildrenIdMap, fullIdList] = useMemo<[IdMap, IdList]>(() => {
        const map: IdMap = {};

        for (let item of config) {
            if (!map[item.pid]) map[item.pid] = [];
            map[item.pid].push(item.id);
        }

        const fullIdList = config.map(i => i.id);

        return [map, fullIdList];
    }, [config]);



    const configTree = useMemo<InternalXMTreeItem[]>(() => {
        const checkedIdMap = createNumMap(checkedIdList);

        const childConfigMap: Record<number, InternalXMTreeItem[]> = {};

        const topConfigList: InternalXMTreeItem[] = [];

        const defaultConfigItem: XMTreeItem = {
            id: defaultId,
            pid: -1,
            name: "全部",
        }

        for (let item of [defaultConfigItem, ...config]) {
            const nextItem: InternalXMTreeItem = {
                ...item,
                checked: item.id in checkedIdMap
            }

            if (item.pid >= defaultId) {
                let children = childConfigMap[item.pid];
                if (!children) {
                    children = childConfigMap[item.pid] = [];
                }
                children.push(nextItem);
            } else {
                topConfigList.push(nextItem);
            }
        }

        const handleParentList = (list: InternalXMTreeItem[]) => {
            return list.map(item => {
                const nextItem = {
                    ...item
                };

                if (item.id in childConfigMap) {
                    const children = handleParentList(childConfigMap[item.id]);
                    const checkedChildren = children.filter(i => i.checked === CheckType.CHECKED);

                    if (checkedChildren.length) {
                        nextItem.checked = checkedChildren.length === children.length ? CheckType.CHECKED : CheckType.MIXED;
                    } else {
                        nextItem.checked = CheckType.UNCHECKED;
                    }

                    nextItem.children = children;
                }

                return nextItem;
            });
        }

        return handleParentList(topConfigList);
    }, [config, checkedIdList]);

    const getFullChildId = (id: number): number[] => {

        if (id === defaultId) return fullIdList;

        const result: number[] = [];

        const getId = (pid: number) => {
            const childrenId = fullChildrenIdMap[pid];
            if (childrenId) {
                result.push(...childrenId);
                childrenId.forEach(id => {
                    getId(id);
                });
            }
        }

        getId(id);

        return result;
    }

    const handleExpandChange = (config: InternalXMTreeItem) => {
        if (!config.children) return;
        const childrenIdList = getFullChildId(config.id);
        const idMap = createNumMap([...childrenIdList, config.id]);
        if (expandIdList.includes(config.id)) {
            setExpandIdList(list => list.filter(id => !(id in idMap)));
        } else {
            setExpandIdList(list => [...list, config.id]);
        }
    }

    const handleCheckedChange = (config: InternalXMTreeItem) => {
        if (config.children && config.children.length) {
            const childrenIdList = getFullChildId(config.id);

            if (config.checked === CheckType.CHECKED) {
                const childrenIdMap = createNumMap([...childrenIdList, config.id]);

                setCheckedIdList(list => list.filter(id => !childrenIdMap[id]));
            } else if (config.checked === CheckType.UNCHECKED) {
                setCheckedIdList(list => [...list, ...childrenIdList, config.id]);
            } else if (config.checked === CheckType.MIXED) {
                setCheckedIdList(list => {
                    const nextList = [...list, ...childrenIdList, config.id];
                    return Array.from(new Set(nextList));
                });
            }
        } else {
            if (checkedIdList.includes(config.id)) {
                setCheckedIdList(list => list.filter(i => i !== config.id));
            } else {
                setCheckedIdList(list => [...list, config.id]);
            }
        }
    }

    const handleTreeRightClick = (e: MouseEvent<HTMLInputElement>) => {
        console.log(e);
        e.preventDefault();
    }

    const renderTreeItem = (config: InternalXMTreeItem, level: number = 0, parentExpand: boolean = true) => {

        const hasChildren = config.children && config.children.length !== 0;

        const result: JSX.Element[] = [];

        const styles: CSSProperties = {
            '--level': level
        };

        const isExpand = config.id in expandIdMap;

        const baseTree = (
            <div
                style={styles}
                className={classNames(classes.xm_tree_item, {
                    active: parentExpand
                }, "flex", "flex-align-center")}
                key={config.id}
            >
                <CaretRight12Filled
                    onClick={() => handleExpandChange(config)}
                    className={classNames("pointer", classes.xm_tree_item_caret, { notvisible: !hasChildren, expand: isExpand })}
                />
                <div onContextMenu={handleTreeRightClick} className={classes.xm_tree_item_checkbox}>
                    <Checkbox
                        onChange={() => handleCheckedChange(config)}
                        checked={config.checked}
                        label={config.name}
                    />
                </div>
            </div>
        );

        result.push(baseTree);

        if (hasChildren) {
            const children = config.children!.map(item => renderTreeItem(item, level + 1, isExpand));
            result.push(...children.flat());
        }

        return result;
    }

    return (
        <div className={classes.xm_tree}>
            {renderTreeItem(configTree[0], 0, true)}
        </div>
    );
}

export default XMTree;