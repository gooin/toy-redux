import React, {useContext, useEffect, useState} from "react";


const store = {
    state: undefined,
    reducer: undefined,
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
    },
}

export const createStore = (reducer, initState) => {
    store.state = initState;
    store.reducer = reducer;
    return store;
};


function isChanged(oldState, newState) {
    let isChanged = false;
    for (const key in oldState) {
        if (oldState[key] !== newState[key]) {
            isChanged = true
        }
    }
    return isChanged;
}

export const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {

    return (props) => {
        const {state, setState} = useContext(appContext);
        const [, update] = useState({});
        const dispatch = (action) => {
            setState(store.reducer(state, action))
        }
        // 筛选出状态的一部分数据。 状态树可能很大，没有必要全部传过来。只提取需要的一部分就行。
        const data = mapStateToProps ? mapStateToProps(state) : state;
        // 简化dispatch。用户只需要传入数据就可以了
        const dispatchers = mapDispatchToProps ? mapDispatchToProps(dispatch) : dispatch

        // 使用dispatch规范setState流程
        useEffect(() =>
                // 当selector有变化的时候。取消订阅
                store.subscribe(() => {
                    const newData = mapStateToProps ? mapStateToProps(store.state) : store.state;
                    if (isChanged(data, newData)) {
                        console.log('update');
                        // 当组件的状态有更新，会刷新组件
                        update({})
                    }
                })
            , [mapStateToProps])

        return <Component
            {...props}
            {...data}
            {...dispatchers}
        />;
    };
};

export const appContext = React.createContext(null);

export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}