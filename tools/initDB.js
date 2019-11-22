const AppDAO = require("../src/server/data/AppDAO");
const GroupTask = require("../src/server/tasks/groups");


async function init() {
    const dao = new AppDAO();
    await dao.run(`
        CREATE TABLE user_groups(
            ID INT PRIMARY KEY NOT NULL,
            NAME TEXT NOT NULL UNIQUE,
            INTRO TEXT
        )
    `);
    dao.close();
    // 创建默认群组表

    const groups = new GroupTask();
}

init();