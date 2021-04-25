import React, {useContext, useEffect, useMemo, useState} from 'react'

import {appContext, connect, createStore, Provider} from "./redux.jsx";
import {connectToUser} from "./connecters/connectToUser";


const initState = {
    user: {name: '张三', age: 123},
    group: {name: '大大组'}
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

let store = createStore(reducer, initState)

export const App = () => {

    // 只要APP组件的的状态改变了，这个组件会重新渲染，会导致没有状态的A3也会重新渲染。
    // 使用 useMemo 将将A3缓存起来。
    let cachedA3 = useMemo(() => <A3/>, [])


    // 将状态写在外部，即redux。仅更新需要的组件。
    return <Provider store={store}>
        <A1/>
        <UserModifier x={'xx'}>
            <h1>XXX</h1>
        </UserModifier>
        {/*{cachedA3}*/}
        <A3/>
    </Provider>
}


// select不传入参数。 用默认的数据
const A1 = connectToUser(({user, dispatch}) => {
    console.log("A1 执行了" + new Date());
    return (
        <h1>USER: {user.name}</h1>
    )
})


// select 传入参数。 筛选出数据。 可以避免下面用的时候 aa.bb.cc.dd 点很长一串。
const UserModifier = connectToUser((props) => {
    console.log("UserModifier 执行了" + new Date());
    console.log('UserModifier props', props);

    const {updateUser, user, children} = props;
    const onChange = (e) => {
        updateUser({name: e.target.value})
    }
    return (
        <>
            {children}
            <input
                value={user.name}
                onChange={onChange}
            />
        </>
    )
});

const A3 = connect(
    state => {
        return {group: state.group}
    })(({group}) => {
    console.log("A3 执行了" + new Date());
    return (
        <h1>A3 group: {group.name}</h1>
    )
})

