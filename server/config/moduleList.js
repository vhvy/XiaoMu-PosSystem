const list = [
    {
        admin: false,
        type: "修改密码"
    }
];
// 默认都需要管理员权限，当admin为false时收银员组也可以拥有此权限


const moduleList = list.map(({ type }) => type);

const posModuleList = list.filter(({ admin = true }) => admin).map(({ type }) => type);

export {
    moduleList,
    posModuleList
}

export default moduleList