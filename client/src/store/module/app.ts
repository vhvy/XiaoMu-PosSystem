import { createSlice } from "@reduxjs/toolkit";
import storage from "@/utils/storage";
import StorageKeys from "@/constants/storage";
import { UserInfo } from "@/types/user";

interface AppBaseState {
    isLogin: boolean,
    userInfo: UserInfo,
    token: string | null
}

function createEmptyUserInfo(): UserInfo {
    return {
        uid: 0,
        account: "",
        username: ""
    }
}

function createInitialState(): AppBaseState {
    const token = storage.getItem(StorageKeys.TOKEN);
    const isLogin = !!token;
    let userInfo = storage.getItem<UserInfo>(StorageKeys.USER_INFO);

    if (!userInfo) {
        userInfo = createEmptyUserInfo();
    }

    return {
        isLogin,
        token,
        userInfo
    }
}

export const appState = createSlice({
    name: "app",
    initialState: createInitialState(),
    reducers: {
        updateUserInfo(state, action) {
            state.userInfo = action.payload;
            storage.setItem(StorageKeys.USER_INFO, action.payload);
        },
        saveLoginInfo(state, action) {
            const { userInfo, token } = action.payload;
            state.userInfo = userInfo;
            storage.setItem(StorageKeys.USER_INFO, userInfo);

            state.token = token;
            storage.setItem(StorageKeys.TOKEN, token);

            state.isLogin = true;
        },
        clearLoginInfo(state) {
            state.isLogin = false;
            state.token = "";
            state.userInfo = createEmptyUserInfo();

            storage.clear();
        }
    }
});

export const { updateUserInfo, saveLoginInfo, clearLoginInfo } = appState.actions;

export default appState.reducer;