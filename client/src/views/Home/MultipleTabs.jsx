import React, { useRef, useEffect, useState } from "react";
import { Icon } from "antd";
import { useTabs } from "./TabsProvider";
import styled from "../../styles/tabs.scss";
import { useHistory } from "react-router-dom";

function CloseBtn({ path, close }) {

    return (
        <div onClick={() => close(path)}>
            &nbsp;&nbsp;<Icon type="close" style={{
                fontSize: 12
            }} />
        </div>
    );
}

function Tab({ value, active }) {

    const history = useHistory();
    const { closeTab, tabs } = useTabs();
    const { currentPath, openTabs } = tabs;


    const { title, path } = value;
    const css = [styled["tabs"]];
    if (active) {
        css.push(styled["active"])
    }

    function handleClick(e) {
        if (e.target.nodeName === "ARTICLE") {
            history.push(path);
        }
    }

    function handleClose(path) {
        closeTab(path);
        if (currentPath === path) {
            const index = openTabs.findIndex(t => t.path === path);
            if (index + 1 === openTabs.length) {
                // 如果要关闭的tab是最后一个tab，那么切换当前tab到前一个tab
                history.push(openTabs[openTabs.length - 2].path);
            } else {
                // 如果要关闭的tab后面还有tab，那么切换当前tab为下一个tab
                history.push(openTabs[index + 1].path);
            }
        }
    }

    return (
        <article className={css.join(" ")} onClick={handleClick}>
            {title}
            {path !== "/home" && <CloseBtn path={path} close={handleClose} />}
        </article>
    );
}

export function _MultipleTabs({ fref }) {

    const { tabs } = useTabs();
    const { currentPath, openTabs } = tabs;

    return (
        <div className={styled["tabs-wrapper"]} ref={fref} >
            {
                openTabs.map(t => <Tab key={t.path} value={t} active={currentPath === t.path} />)
            }
        </div>
    );
}

function withScrollbar(Component, ...args) {
    let mouseDownFlag = false;

    let mouseOnBarPosX;
    let wrapPosXLeft;
    let wrapWidth;
    let barWidth;
    let boxWidth;
    let boxScrollWidth;
    return function () {

        const [showBar, setShow] = useState(false);

        const boxEle = useRef(null);
        const barEle = useRef(null);
        const wrapEle = useRef(null);

        function updateBarPos({ clientX }) {
            if (!mouseDownFlag) return;
            const { current: barDom } = barEle;
            const { current: boxDom } = boxEle;

            const posX = clientX - mouseOnBarPosX - wrapPosXLeft;

            if (posX <= 0 || posX >= wrapWidth - barWidth) return;

            barDom.style.left = `${posX}px`;

            const ratio = posX / (wrapWidth - barWidth);
            boxDom.scrollTo((boxScrollWidth - boxWidth) * ratio, boxDom.scrollY);
        }

        function saveFlag(e) {
            mouseOnBarPosX = e.offsetX;
            const { current: wrapDom } = wrapEle;
            const { current: barDom } = barEle;
            const { current: boxDom } = boxEle;
            const { left, width } = wrapDom.getBoundingClientRect();
            const { width: _barWidth } = barDom.getBoundingClientRect();
            const { width: _boxWidth, } = boxDom.getBoundingClientRect();
            wrapWidth = width;
            barWidth = _barWidth;
            wrapPosXLeft = left;
            boxWidth = _boxWidth;
            boxScrollWidth = boxDom.scrollWidth;
            mouseDownFlag = true;
        }

        function cancelFlag() {
            mouseDownFlag = false;
        }

        function checkScroll() {
            const { clientWidth, scrollWidth } = boxEle.current;
            const _showBar = scrollWidth > clientWidth;
            if (_showBar !== showBar) setShow(_showBar);
        }


        useEffect(checkScroll);

        useEffect(() => {
            const { current: wrapDom } = wrapEle;
            const { current: barDom } = barEle;

            barDom.addEventListener("mousedown", saveFlag);
            // 鼠标按下时设flag为true

            barDom.addEventListener("mouseup", cancelFlag);
            // 鼠标松开时设flag为false

            wrapDom.addEventListener("mousemove", updateBarPos);
            // 在滚动条上移动鼠标时更新滚动条的坐标

            window.addEventListener("mouseup", cancelFlag);
            // 松开鼠标时将flag设为false

            window.addEventListener("resize", checkScroll);
            // 调整窗口大小时判断是否需要显示滚动条

            return () => {

                barDom.removeEventListener("mousedown", saveFlag);
                // 取消监听滚动条上的鼠标按下事件

                barDom.removeEventListener("mouseup", cancelFlag);
                // 取消监听滚动条伤的鼠标松开事件

                wrapDom.removeEventListener("mousemove", updateBarPos);
                // 取消监听滚动条鼠标移动事件

                window.removeEventListener("resize", checkScroll);
                window.removeEventListener("mouseup", cancelFlag);
            };
        }, []);

        const barStyle = {
            display: showBar ? "block" : "none"
        };

        return (
            <div className={styled["scrollbar-wrap"]} ref={wrapEle}>
                <Component {...args} fref={boxEle} />
                <div style={barStyle} className={styled["scrollbar"]} ref={barEle}></div>
            </div>
        );
    }
}

export const MultipleTabs = withScrollbar(_MultipleTabs);