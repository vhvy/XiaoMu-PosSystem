export default function copyObj(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(i => copyObj(i));
    } else if (obj.constructor === Object) {
        let new_obj = {};
        const keys = Object.keys(obj);
        for (let key of keys) {
            const value = obj[key];
            new_obj[key] = copyObj(value);
        }
        return new_obj;
    } else {
        return obj;
    }
}

