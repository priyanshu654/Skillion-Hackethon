import { createSlice } from "@reduxjs/toolkit"

const initialState={
    token:localStorage.getItem('token')||null,
    loading:false,
    signupData:null,
    user:null
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setToken(state,action){
            state.token=action.payload
        },
        setLoading(state,action){
            state.loading=action.payload
        },
        setSignupData(state,action){
            state.signupData=action.payload
        },
        setUser(state,action){
            state.user=action.payload
        }
    }
})

export const{setToken,setLoading,setSignupData,setUser}=authSlice.actions;
export default authSlice.reducer