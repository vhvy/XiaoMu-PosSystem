import React, { useRef, useEffect, useState, useCallback } from "react";
import styled from "../styles/components/virtual-select-list.scss";


export function useSelect() {

    const [selectData, setSelectData] = useState({
        selectId: -1,
        selectType: "origin"
    });

    function handleClickSelect(selectId) {
        setSelectData(s => ({
            ...s,
            selectId,
            selectType: "click"
        }));
    }

    return [selectData, setSelectData, handleClickSelect];
}


export function createRenderItemFn(
    columns,
    handleClickSelect,
    selectFields = "id",
    handleColumnCss
) {

    function getCssName(key, type, center) {
        // 单元格css
        const css = styled[`type${type}`];
        const arr = [css, styled["item"]];
        if (key === "barcode") {
            arr.push(styled["barcode"]);
        }
        if (center) {
            arr.push(styled["center"])
        }
        return arr.join(" ");
    }

    function renderGrid(key, value = "", type, center) {
        // 渲染单元格

        return (
            <span key={key} title={value} className={getCssName(key, type, center)}>{value}</span>
        );
    }

    return (data, index, offset, key, selectRef, select) => {
        let css = [styled["virtual-items"]];

        if (handleColumnCss) {
            css = handleColumnCss(css, styled, data);
        }

        const indexValue = columns.find(({ key }) => key === "index");
        const indexItem = renderGrid("index", index, indexValue.type, indexValue.center);
        const fieldsItem = columns.slice(1).map(({ key, type, center }) => renderGrid(key, data[key], type, center));

        const style = {
            transform: `translateY(${offset}px)`
        };

        if (data[selectFields] === select) {
            css.push(styled["select"]);
            return (
                <div
                    style={style}
                    className={css.join(" ")}
                    key={key}
                    ref={selectRef}
                >
                    {indexItem}
                    {fieldsItem}
                </div>
            );
        }

        function handleClick() {
            handleClickSelect && handleClickSelect(data[selectFields]);
        }

        return (
            <div
                style={style}
                className={css.join(" ")}
                key={key}
                onClick={handleClick}
            >
                {indexItem}
                {fieldsItem}
            </div>
        );
    };
}

export function VirtualSelectListHeader({ data }) {
    return (
        <div className={styled["virtual-header"]}>{
            data.map(({ title, type, key, center }) => {
                const css = [styled["column"], styled[`type${type}`]];
                if (key === "barcode") {
                    css.push(styled["barcode"]);
                }
                if (center) {
                    css.push(styled["center"]);
                }
                return (
                    <span
                        className={css.join(" ")}
                        key={title}
                    >
                        {title}
                    </span>
                );
            })
        }</div>
    );
}

export function VirtualSelectListFooter({ data, style = {} }) {
    return (
        <div
            className={styled["virtual-footer"]}
            style={{
                left: 10,
                right: 10,
                bottom: 10,
                ...style
            }}
        >
            {
                data.map(({ title, type, value, center }) => {
                    const css = [styled["column"], styled[`type${type}`]];
                    if (center) {
                        css.push(styled["center"]);
                    }
                    return (
                        <span key={title} className={css.join(" ")} >{value}</span>
                    );
                })
            }
        </div>
    );
}

export function VirtualSelectList({
    itemHeight = 40,
    // 虚拟列表项目单行高度

    header,
    // 表头组件

    footer,
    // 底部组件

    renderItem,
    data,
    // 数据源

    select = 0,
    // 当前选中的项目id

    selectType,
    // 选中类型

    wrapCss,
    // 最外层容器css

    wrapStyle = {},
    // 最外层内嵌样式

    scrollCss,
    // 滚动容器css

    scrollStyle = {},
    // 滚动容器外层css

    innerCss,
    // 内层容器css

    innerStyle,
    selectFields = "id"
}) {
    /**
     * itemHeight: 单元行的高度，可选，默认40
     * header: 头部组件，可选
     * footer: 尾部组件，可选
     * renderItem: 子元素渲染函数，接受两个参数，data和firstIndex
     * data: 当前虚拟列表数据
     * firstIndex: 虚拟列表中第一行数据在完整列表中的索引，可用来计算单元行的偏移位置和序号
     */

    const scrollRef = useRef(null);
    // 外部滚动容器ref

    const selectRef = useRef(null);
    // 当前select单元行ref

    const innerRef = useRef(null);
    // 单元行容器ref

    const [virtualData, setData] = useState({
        list: [],
        firstIndex: 0
    });

    const handleShowItem = useCallback(() => {
        const { current } = scrollRef;
        const { height } = current.getBoundingClientRect();
        const { scrollTop, scrollHeight } = current;

        const showLength = Math.ceil(height / itemHeight);
        // 容器可视窗口内可展示的单元行数量，向上取整防止留下空隙

        const firstIndex = Math.floor(data.length * (scrollTop / scrollHeight));
        /**
         * scrollTop / scrollHeight 为当前Y轴滚动值占整个可滚动高度的相应比例
         * 用这个比例乘以列表数据可得出虚拟列表的首索引
         */

        const showData = data.slice(firstIndex, firstIndex + showLength);
        // 通过对列表数据的切片可得出虚拟列表

        setData({
            list: showData,
            firstIndex
        });

    }, [data]);

    useEffect(() => {
        const { current } = scrollRef;
        current.addEventListener("scroll", handleShowItem);

        handleShowItem();

        return () => current.removeEventListener("scroll", handleShowItem);
    }, [handleShowItem]);

    useEffect(() => {
        if (select <= 0) return;
        // 没有商品时不做任何动作
        const { current: wrapDom } = scrollRef;

        const { scrollHeight } = wrapDom;
        const { top, bottom, height } = wrapDom.getBoundingClientRect();
        // 容器坐标

        const result = virtualData.list.find(item => item[selectFields] === select);
        // 当单元行位于虚拟列表数组中时

        function scrollY(top_diff, bottom_diff) {
            const index = data.findIndex(item => select === item[selectFields]);
            // 查找选中行在数据列表中的索引

            let posY = height;

            if (selectType === "up") {
                posY = index * itemHeight;
            } else if (selectType === "down") {
                const showLength = Math.ceil(height / itemHeight);
                // 容器当前窗口可以展示的最大单元行数量

                const firstIndex = index + 2 - showLength;
                /**
                 * 当通过键盘下箭头键修改select时，需要将select完整展示在容器可视窗口最下面。
                 * 如果是虚拟列表的倒数第一个单元格，那么可能只展现出来一半单元格。
                 * 所以至少是虚拟列表的倒数第二个单元格，瑕疵是当通过下箭头键滚动到最后一个元素时，会有几个像素的跳动。
                 * 通过所选单元格索引反算出所选单元格在虚拟列表的位置为 -2时的虚拟列表首个单元格的索引。
                 */

                posY = firstIndex / data.length * scrollHeight
                // 通过首索引反算出虚拟列表对应的y轴滚动值。
            } else if (selectType === "click") {
                posY = wrapDom.scrollTop + (top_diff < 0 ? top_diff : bottom_diff);
                // 如果选中单元格未完整展示，则滚动相应差值
            } else if (selectType === "ondata") {
                posY = 0;
            }
            wrapDom.scrollTo(0, posY);
        }

        if (result) {
            // 当单元行位于虚拟列表数组中时
            const { top: s_top, bottom: s_bottom } = selectRef.current.getBoundingClientRect();

            const top_diff = s_top - top;
            const bottom_diff = s_bottom - bottom;
            (top_diff < 0 || bottom_diff > 0) && scrollY(top_diff, bottom_diff);
            /**
             * 如果当前选中单元行的top坐标小于容器的top坐标，或者bottom坐标大于容器bottom坐标
             * 证明当前中选单元行并没有在容器可视部分展现出来(或者没有完全展现出来)
             * 执行滚动函数
             */
        } else {
            // 当单元行不在虚拟列表数组中时
            select === data[data.length - 1][selectFields] ? (() => {
                wrapDom.scrollTo(0, scrollHeight - height);
                // 如果当前选中单元行是数据列表中最后一列，那么直接滚动到末尾

            })() : scrollY();
        }
    }, [select]);

    function renderBody() {

        const { list, firstIndex } = virtualData;
        let i = firstIndex;
        return (
            <div
                className={[styled["virtual-scroll"], scrollCss].join(" ")}
                style={{
                    top: 50,
                    right: 10,
                    bottom: 50,
                    left: 10,
                    ...scrollStyle,
                }}
                ref={scrollRef}
            >
                <div
                    className={innerCss}
                    style={{
                        ...innerStyle,
                        height: data.length * itemHeight
                    }}
                    ref={innerRef}
                >
                    {
                        list.map((t, index) => renderItem(t, i + 1, i++ * itemHeight, index, selectRef, select))
                    }
                </div>
            </div>
        );
    }

    return (
        <div
            className={[wrapCss, styled["virtual-wrap"]].join(" ")}
            style={{
                ...wrapStyle
            }}
        >
            {header && header}
            {renderBody()}
            {footer && footer}
        </div>
    );
}