import { useState, useEffect } from "react";
import { PromotionManage } from "../../../../tasks/promotion";

export function usePromoType(ajax) {

    const [promoTypeList, setPromoType] = useState([]);

    async function getPromoType() {
        try {
            const { data } = await PromotionManage.getPromotionType(ajax);

            const list = data.map(({ name }) => name);

            setPromoType(list);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPromoType();
    }, []);

    return [promoTypeList];
}

export function usePromo(ajax, onMount) {

    const [promoList, setPromoList] = useState([]);
    // 促销活动列表

    async function getPromotion(fn) {
        try {
            const { data } = await PromotionManage.getAllPromotion(ajax);

            setPromoList(data);

            fn && fn(data);
        } catch (error) {
            console.log(error);
        }
    }

    function flushList(onUpdate) {
        getPromotion(onUpdate);
    }

    useEffect(() => {
        getPromotion(onMount);
    }, []);

    return [promoList, setPromoList, flushList];
}