export function merge(obj1, ...objList) {
    let result = { ...obj1 };

    for (let obj of objList) {
        result = {
            ...result,
            ...obj
        };
    }

    return result;
}

export default merge;