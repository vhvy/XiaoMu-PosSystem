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

```
/api/groups/create
创建新的用户组

方法: post
参数: {
    name: "name",
    authority: ["系统主页"]
}
```

```
/api/groups/updatename
修改用户组名称

方法: post
参数: {
    name: "name",
    new_name: "new_name"
}
```

```
/api/groups/updateauthority
修改用户组权限

方法: post
参数: {
    name: "name",
    new_authority: ["系统主页"]
}
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