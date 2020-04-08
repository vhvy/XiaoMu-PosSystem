// Modules to control application life and create native browser windo
const path = require("path");
const url = require("url");
const fs = require("fs").promises;
const { app, BrowserWindow, protocol, globalShortcut, Menu } = require("electron");
// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;



Menu.setApplicationMenu(null);

function createWindow() {
    // Create the browser window.

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            webSecurity: false
        },
    });

    // 加载应用----适用于 react 项目
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "./client/dist/index.html"),
        protocol: "file",
        slashes: true
    }));

    // 打开开发者工具，默认不打开
    // mainWindow.webContents.openDevTools()

    process.env.NODE_ENV === "development" && mainWindow.webContents.openDevTools({ mode: "right" });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

function startServer() {

    const pathname = process.env.NODE_ENV === "development" ?
        path.join(__dirname, ".noserver") : path.join(__dirname, "../../.noserver");
// 生产环境下__dirname是asar文件所在的目录

    fs.readFile(pathname)
        .then(v => console.log("检查到不启动服务器的flag，不启动服务器！"))
        .catch(error => {
            require("./public/bundle.cjs");
            // 没有不启动服务器的flag，启动服务器!
        });
}

app.on("ready", () => {

    startServer();

    protocol.registerFileProtocol("images", (req, cb) => {
        const url = req.url.substr(9);

        cb({
            path: path.normalize(`${__dirname}/client/dist/${url}`)
        })
    });
    protocol.registerFileProtocol("icon", (req, cb) => {
        const url = req.url.substr(7);

        cb({
            path: path.normalize(`${__dirname}/client/dist/${url}`)
        })
    });

    globalShortcut.register("CmdOrCtrl+R", () => { });

    createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

// app.on("activate", function () {
//     // On macOS it"s common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (mainWindow === null) createWindow();
// });

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
