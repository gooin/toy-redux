import React, { useContext, useState } from 'react'

const appContext = React.createContext(null)


const reducer = (state, { type, payload }) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
        return state
    }
}


export const App = () => {
    const [appState, setAppState] = useState({
        user: { name: '张三', age: 123 }
    })
    const contextValue = { appState, setAppState };
    return (
        <appContext.Provider value={contextValue}>
            <A1></A1>
            <A2></A2>
            <A3></A3>
        </appContext.Provider>
    )
}

const A1 = () => {
    const { appState } = useContext(appContext);
    return (
        <h1>USER: {appState.user.name}</h1>
    )
}


const A2 = () => {
    const { appState, setAppState } = useContext(appContext);
    const onChange = (e) => {
        setAppState(reducer(appState, { type: 'updateUser', payload: { name: e.target.value } }))
    }
    return (
        <input
            value={appState.user.name}
            onChange={onChange}
        ></input>
    )
}
const A3 = () => {
    return (
        <h1>A3</h1>
    )
}

