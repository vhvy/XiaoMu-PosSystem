export const getUrlParamsObj = (search: string): Record<string, string> => {
    const searchParams = new URLSearchParams(search);
    if (!searchParams.size) return {};
    return Object.fromEntries(searchParams);
}