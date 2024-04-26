import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from './reducers/user'

import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';


const reducers = combineReducers({
    user: userSlice,
})

// config
const persistConfig = {
    key: "root", // localStorage key
    storage,
    whilelist: ["user"],

}

const persistedReducer = persistReducer(persistConfig, reducers)

//  여러 reducer를 사용하는 경우 reducer를 하나로 묶어주는 메소드
// store에 저장되는 리듀서는 오직 1개
export const store = configureStore({ 
    reducer: {
        user: persistedReducer
    },
    // 다음이 middleware 추가 코드이다.
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
    // 기본 값이 true지만 배포할때 코드를 숨기기 위해서 false로 변환하기 쉽게 설정에 넣어놨다.
    devTools: true,
});