export const LOGIN_SET_API_URL = "LOGIN_SET_API_URL";
// 设置服务器API地址

export const LOGIN_SET_CURRENT_USERNAME = "SET_CURRENT_USERNAME";
// 设置当前用户的用户名

export const LOGIN_SET_CURRENT_USER_AUTHORITY = "SET_CURRENT_USERNAME_AUTHORITY";
// 设置当前用户所拥有的权限

export const USER_SET_IS_ADMIN = "USER_SET_IS_ADMIN";
// 设置用户是否为管理员

export const LOGIN_SET_USER_IS_LOGIN = "LOGIN_SET_USER_IS_LOGIN";
// 设置用户登录状态

export const CLEAR_USER_STATE = "CLEAR_USER_STATE";
// 清除用户登录状态

export const SET_USER_DETAILS = "SET_USER_DETAILS";
// 设置用户信息

export const TABS_SET_CURRENT_TAB = "TABS_SET_CURRENT_TAB";
// 设置当前展示的栏目

export const TABS_ADD_TAB = "TABS_ADD_TAB";
// 打开新栏目

export const TABS_CLOSE_TAB = "TABS_CLOSE_TAB";
// 关闭一个栏目

export const TOGGLE_TABS_STATUS = "TOGGLE_TABS_STATUS";
// 设置是否使用多栏目功能

export const CASH_HOTKEY_STATUS = "CASH_HOTKEY_STATUS";
// 设置是否显示前台销售的热键列表

export const CASH_ORDER_ADD_COMMODITY = "CASH_ORDER_ADD_COMMODITY";
// 增加商品到当前订单

export const CASH_ORDER_DELETE_COMMODITY = "CASH_ORDER_DELETE_COMMODITY";
// 从当前订单删除商品

export const CASH_ORDER_SET_SELECT_COMMODITY = "CASH_ORDER_SET_SELECT_COMMODITY";
// 设置当前被选中的商品

export const CASH_ORDER_SET_COMMODITY_COUNT = "CASH_ORDER_SET_COMMODITY_COUNT";
// 设置当前选中商品的数量

export const CASH_ORDER_SET_COMMODITY_PRICE = "CASH_ORDER_SET_COMMODITY_PRICE";
// 设置当前选中商品的单价

export const CASH_ORDER_SET_COMMODITY_STATUS_GIVE = "CASH_ORDER_SET_COMMODITY_STATUS_GIVE";
// 设置当前选中商品状态为赠送

export const CASH_ORDER_SET_COMMODITY_STATUS_RETURN = "CASH_ORDER_SET_COMMODITY_STATUS_RETURN";
// 设置当前选中商品状态为赠送

export const CASH_ORDER_SET_VIP = "CASH_ORDER_SET_VIP";
// 设置当前订单的VIP信息

export const CASH_ORDER_CLEAR_VIP = "CASH_ORDER_CLEAR_VIP";
// 清除当前订单的VIP信息

export const CASH_ORDER_RESET_STATUS = "CASH_ORDER_RESET_STATUS";
// 清空当前订单

export const CASH_ORDER_HANGUP = "CASH_ORDER_HANGUP";
// 挂起当前订单

export const CASH_ORDER_HANGWUP_GET = "CASH_ORDER_HANGWUP_GET";
// 取出已挂起订单

export const CASH_HISTORY_ORDER_INIT = "CASH_HISTORY_ORDER_INIT";
// 初始化历史订单

export const CASH_HISTORY_ORDER_ADD = "CASH_HISTORY_ORDER_ADD";
// 添加新的已完成订单到历史订单

export const CASH_HISTORY_ORDER_UNDO = "CASH_HISTORY_ORDER_UNDO";
// 撤销已完成订单

export const CASH_HISTORY_ORDER_ADDVIP = "CASH_HISTORY_ORDER_ADDVIP";
// 为已完成订单追加vip

export const CASH_HISTORY_ORDER_IMPORT = "CASH_HISTORY_ORDER_IMPORT";
// 将已完成订单内商品导入前台收款界面

export const WARE_CATEGORY_TREE = "WARE_CATEGORY_TREE";
// 填充仓储管理商品分类

export const WARE_CATEGORY_SELECT = "WARE_CATEGORY_SELECT";
// 设置通过点击节点选择的节点

export const WARE_CATEGORY_CHECK = "WARE_CATEGORY_CHECK";
// 设置当前通过复选框选中的多个节点

export const WARE_CATEGORY_EXPAND = "WARE_CATEGORY_EXPAND";
// 设置当前展开的节点

export const WARE_CATEGORY_DELETE = "WARE_CATEGORY_DELETE";
// 删除一个节点

export const WARE_CATEGORY_SET_PARENT = "WARE_CATEGORY_SET_PARENT";
// 修改一个节点的父节点

export const WARE_CATEGORY_CREATE = "WARE_CATEGORY_CREATE";
// 创建一个新的分类

export const WARE_CATEGORY_RENAME = "WARE_CATEGORY_RENAME";
// 修改分类名称

export const WARE_COMMODITY_SELECT = "WARE_COMMODITY_SELECT";
// 当前选中的商品

export const WARE_COMMODITY_CREATE = "WARE_COMMODITY_CREATE";
// 创建新商品

export const WARE_COMMODITY_DELETE = "WARE_COMMODITY_DELETE";
// 删除商品

export const WARE_COMMODITY_UPDATE = "WARE_COMMODITY_UPDATE";
// 更新商品信息

export const WARE_STOCK_INIT = "WARE_STOCK_INIT";
// 设置进货单商品详情

export const WARE_STOCK_ADD = "WARE_STOCK_ADD";
// 向进货单中添加商品

export const WARE_STOCK_REMOVE = "WARE_STOCK_REMOVE";
// 从进货单中删除选中商品

export const WARE_STOCK_CLEAN = "WARE_STOCK_CLEAN";
// 清空当前订货单中商品

export const WARE_STOCK_SELECT = "WARE_STOCK_SELECT";
// 设置当前选中商品