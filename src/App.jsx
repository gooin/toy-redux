import React, {useContext, useEffect, useMemo, useState} from 'react'

import {appContext, connect, store} from "./redux.jsx";


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

