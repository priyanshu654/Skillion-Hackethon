import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../slice/authSilce"
const rootReducer=combineReducers({
    auth:authReducer
})

export default rootReducer;