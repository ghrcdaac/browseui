import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value: null
}

export const rowDataSlice = createSlice({
    name: 'rowData',
    initialState,
    reducers: {
        setRowDataRedux: (state, action) => {
            //sets state to given value
            state.value = action.payload
        },
    },
})

export const { setRowDataRedux } = rowDataSlice.actions

export default rowDataSlice.reducer