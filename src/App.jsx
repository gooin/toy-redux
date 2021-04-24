import React, {useContext, useEffect, useMemo, useState} from 'react'

const appContext = React.createContext(null)

const store = {
    state: {
        user: {name: '张三', age: 123}
    },
    setState(newState) {
        console.log('newState', newState);
        store.state = newState
        store.listeners.map(fn => fn(store.state))
    },
    listeners: [],
    subscribe(fn) {
        store.listeners.push(fn)
        return () => {
            const index = store.listeners.indexOf(fn);
            store.listeners.splice(index, 1);
        }
    }
}

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

const connect = (Component) => {

    return (props) => {
        const {state, setState} = useContext(appContext);
        const [, update] = useState({});
        // 使用dispatch规范setState流程
        useEffect(() => {
            store.subscribe(() => {
                update({})
            })
        }, [])
        const dispatch = (action) => {
            setState(reducer(state, action))
            // update({})
        }

        return <Component {...props} dispatch={dispatch} appState={state}/>
    };
};

export const App = () => {

    // 只要APP组件的的状态改变了，这个组件会重新渲染，会导致没有状态的A3也会重新渲染。
    // 使用 useMemo 将将A3缓存起来。
    let cachedA3 = useMemo(() => <A3/>, [])

    // 将状态写在外部，即redux。仅更新需要的组件。
    return (
        <appContext.Provider value={store}>
            <A1/>
            <UserModifier x={'xx'}>
                <h1>XXX</h1>
            </UserModifier>
            {/*{cachedA3}*/}
            <A3/>
        </appContext.Provider>
    );
}

const A1 = connect(({appState, dispatch}) => {
    console.log("A1 执行了" + new Date());
    return (
        <h1>USER: {appState.user.name}</h1>
    )
})


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

