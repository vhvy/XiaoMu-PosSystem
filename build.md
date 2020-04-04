```
windows下需要编译工具
npm i -g windows-build-tools
```

如果出现如下报错，打开`Visual Studio Installer`，点击`Visual Studio 15生成工具2017`下的`修改`，勾选右侧的`适用于桌面的VC++ 2015.3 v14.00(v140)工具集`，并点击`修改`，耐心等待即可.

```
若要使用 v140 生成工具进行生成，请安装 v140 生成工具。或者，可以升级到当前 Visual Studio 工具，方式是通过选择“项目”菜单或右键单击该解决方案，然后选择“重定解决方案目标”
```

### 前端
```
cd client
npm i
npm run build:electron
```

### 后端
```
cd server

npm run initdb
// 初始化数据库

npm i
npm run build
```

### Electron
```
npm i

npm run postinstall
// 重新为目标平台编译依赖C/C++的模块

npm build
// 开始编译
```