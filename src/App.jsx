import React, {useContext, useMemo, useState} from 'react'

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

    //


    const contextValue = {appState, setAppState};

    // 只要APP组件的的状态改变了，这个组件会重新渲染，会导致没有状态的A3也会重新渲染。
    // 使用 useMemo 将将A3缓存起来。
    let cachedA3 = useMemo(() => <A3/>, [])
    return (
        <appContext.Provider value={contextValue}>
            <A1/>
            <UserModifier x={'xx'}>
                <h1>XXX</h1>
            </UserModifier>
            {cachedA3}
        </appContext.Provider>
    );
}

const A1 = () => {
    console.log("A1 执行了" + new Date());

    const {appState} = useContext(appContext);
    return (
        <h1>USER: {appState.user.name}</h1>
    )
}

const connect = (Component) => {
    return (props) => {
        const {appState, setAppState} = useContext(appContext);

        // 使用dispatch规范setState流程
        const dispatch = (action) => {
            setAppState(reducer(appState, action))
        }
        return <Component {...props} dispatch={dispatch} appState={appState}/>
    };
};


const UserModifier = connect((props) => {
    console.log("UserModifier 执行了" + new Date());
    const {dispatch, appState, children} = props;
    const onChange = (e) => {
        dispatch({type: 'updateUser', payload: {name: e.target.value}})
    }
    return (
        <>
            {children}
            <input
                value={appState.user.name}
                onChange={onChange}
            />
        </>

    )
});

const A3 = () => {
    console.log("A3 执行了" + new Date());
    return (
        <h1>A3</h1>
    )
}

