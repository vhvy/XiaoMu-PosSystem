export const getPageParams = (query: AnyObj) => {
    let { page, limit, ...args } = query;
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    return {
        ...args,
        limit,
        offset: (page - 1) * limit
    }
}