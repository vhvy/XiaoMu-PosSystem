除了login接口之外所有API都需要带上token去访问

## 登录

```
/api/login
登录接口

方法: post
参数: {
    username: "username",
    password: "password"
}
```
---

## 用户


```
/api/users
获取所有的用户信息

方法: get
```

```
/api/users/updatepwd
修改密码

方法: post
参数: {
    username: "username",
    new_password: "new_password"
}
```

```
/api/users/updateusergroup
修改用户所属分组

方法: post
参数: {
    username: "username",
    new_group: "管理员组"
}
```

```
/api/users/updateusername
修改用户名

方法: post
参数: {
    old_username: "old_username",
    new_username: "new_username"
}
```

```
/api/users/createuser
创建新用户

方法: post
参数: {
    new_username: "username",
    password: "password",
    group: "管理员组"
}
```

```
/api/users/updateuserstatus
设置用户是否被禁用

方法: post
参数: {
    username: "username",
    status: false
}
```
---

## 用户组

```
/api/groups
获取所有用户组以及权限详情

方法: get
```

---

## 商品分类

```
/api/warehouse/categories
获取所有商品分类

方法: get
```

```
/api/warehouse/categories/create
创建新的商品分类

方法: post
参数: {
    name: "name",
    parent_name: "parent_name" // 可选
}
```

```
/api/warehouse/categories/updatename
修改商品分类名称

方法: post
参数: {
    old_name: "old_name",
    new_name: "new_name"
}
```

```
/api/warehouse/categories/updateparent
修改子分类所属的父分类

方法: post
参数: {
    name: "name",
    parent_name: "parent_name"
}
```

```
/api/warehouse/categories/delete
删除分类

方法: post
参数: {
    name: "name"
}
```

---

## 商品

```
/api/warehouse/commodity
获取所有商品的全部详细信息

方法: get
```

```
/api/warehouse/commodity/create
创建新的商品

方法: post
参数: {
    barcode: "00000068", // 可选
    name: "绿箭口香糖",
    category_name: "糖果",
    unit: "克", // 可选
    size: "500", // 可选
    in_price: 1, // 可选
    sale_price: 1.5, // 可选
    vip_points: true, // 可选
    is_delete: false, //可选
}
```

```
/api/warehouse/commodity/update
更新商品信息

方法: put
参数: {
    current_barcode: "00000068",
    update_value: {
        barcode: "00000068", // 可选
        name: "绿箭口香糖", // 可选
        category_name: "糖果", // 可选
        unit: "克", // 可选
        size: "500", // 可选
        in_price: 1, // 可选
        sale_price: 1.5, // 可选
        vip_points: true, // 可选
        is_delete: false, //可选
    } // 至少填写一个属性
}
```

```
/api/warehouse/commodity/delete
删除商品

方法: delete
参数: {
    barcode: "00000068"
}
```
---

## 供货商信息

```
/api/warehouse/suppliers
获取所有供货商

方法: get
```

```
/api/warehouse/suppliers/create
创建新的供货商

方法: post
参数: {
    name: "旺财商贸",
    phone: "1008611", // 可选
    description: "主要批发xxxxxxxx" // 可选
}
```

```
/api/warehouse/suppliers/update
修改供货商信息

方法: put
参数: {
    name: "旺财商贸",
    update_value: {
        new_name: "大旺财商贸", // 可选
        new_phone: "10010", // 可选
        new_description: "主要批发xxxx" // 可选
    } // 至少填写一个字段
}
```

```
/api/warehouse/suppliers/delete
删除供货商

方法: delete
参数: {
    name: "旺财商贸"
}
```

---

## 会员卡

```
/api/vip/members
获取所有会员信息

方法: get
```

```
/api/vip/members/create
创建新会员

方法: post
参数: {
    code: "0001",
    name: "马大帅",
    vip_type: "积分卡", // 可选
    sex: "男", // 可选
    phone: "10086", // 可选
    is_disable: false // 可选
}
```

```
/api/vip/members/update
修改会员信息

方法: put
参数: {
    code: "0001",
    update_value: {
        name: "马大虎", // 可选
        sex: "男", // 可选
        phone: "10010", // 可选
        is_disable: true // 可选
    } // 至少填写一个字段
}
```

```
/api/vip/members/delete
删除会员

方法: delete
参数: {
    code: "0001"
}
```

```
/api/vip/members/change
会员补换卡

方法: post
参数: {
    old_code: "0001",
    new_code: "0002",
    description: "测试" // 可选
}
```

---

## 促销活动

```
/api/market/promotion
获取所有促销活动

方法: get
```

```
/api/market/promotion/type
获取所有促销类型

方法: get
```

```
/api/market/promotion/create
创建促销活动

方法: post
参数: {
    name: "春节促销活动",
    start_date: 1576030345903,
    end_date: 1576030345904,
    description: "值此新春佳节来临之际....", // 可选
    is_disable: false // 可选
}
```

```
/api/market/promotion/update
修改促销活动时间、名称简介等

方法: put
参数: {
    name: "春节促销活动",
    update_value: {
        new_name: "国庆促销活动", // 可选
        start_date: 1576030345906, // 可选
        end_date: 1576030345909, // 可选
        description: "促销的一些简介xxxx", // 可选
        is_disable: true // 可选
    } // 至少填写任意一个字段
}
```

```
/api/market/promotion/delete
删除促销活动

方法: delete
参数: {
    name: "春节促销活动"
}
```

```
/api/market/promotion/details
设置参加促销活动的商品详情

方法: post
参数: {
    promotion_name: "春节促销活动",
    commodity_list: [
        {
            barcode: "69019388",
            promotion_type: 下方说明里的键,
            下方说明里的值: value
        }
    ]
}
说明: {
        "单品特价": "single_off_price",
        "单品打折": "single_discount"
    }
```

```
/api/market/promotion/details/:query
获取促销活动的详情

方法: get
参数: query = 活动名称
```

---

## 仓库-进货单

```
/api/warehouse/stock
获取所有的进货单

方法: get
```

```
/api/warehouse/stock/:query
获取进货单详细信息

方法: get
参数: query = 进货单编号(时间戳)
```

```
/api/warehouse/stock/create
创建进货单

方法: post
参数: {
    supplier_name: "默认供货商",
    description: "年过时节囤货", // 可选
    commodity_list: [
        {
            barcode: "69019388",
            count: "12板*10条",
            in_price: 12
        },
        {
            barcode: "6954432710645",
            count: "1箱*10瓶",
            in_price: 80
        }
    ]
}
```

---

## 前台-提交订单

```
/api/front/order/:id
获取订单详细信息

方法: get
参数: id, 订单编号
```

```
/api/front/order/submit
提交订单

方法: post
参数: {
    vip_code: "0001", // 可选
    pay_type: "现金",
    origin_price: 1.5,
    sale_price: 1.2,
    client_pay: 2,
    change: 0.8,
    commodity_list: [
        {
            barcode: "000001",
            sale_price: 1.2,
            origin_price: 1.5,
            count: 1,
            status: "销售"
        }
    ]
}
```