import {configureStore } from "@reduxjs/toolkit"
import { authActions } from "./auth"

const store=configureStore({
    reducers:{
        authentication : authActions
    }
})

export default store