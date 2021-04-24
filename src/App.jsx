import React, {useContext, useState} from 'react'

const appContext = React.createContext(null)


// reducer 规范state的更新流程
const reducer = (state, {type, payload}) => {
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
        user: {name: '张三', age: 123}
    })
    const contextValue = {appState, setAppState};
    return (
        <appContext.Provider value={contextValue}>
            <A1/>
            <Wrapper/>
            <A3/>
        </appContext.Provider>
    );
}

const A1 = () => {
    const {appState} = useContext(appContext);
    return (
        <h1>USER: {appState.user.name}</h1>
    )
}


const Wrapper = ()=>{
    const {appState, setAppState} = useContext(appContext);

    // 使用dispatch规范setState流程
    const dispatch = (action) => {
        setAppState(reducer(appState,action))
    }
    return <A2 dispatch={dispatch} appState={appState}/>
}


const A2 = ({dispatch,appState}) => {
    const onChange = (e) => {
        dispatch({type: 'updateUser', payload: {name: e.target.value}})
    }
    return (
        <input
    value={appState.user.name}
    onChange={onChange}
    />
    )
}
const A3 = () => {
    return (
        <h1>A3</h1>
    )
}

