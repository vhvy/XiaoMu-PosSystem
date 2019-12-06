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

