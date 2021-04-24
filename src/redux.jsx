import React, {useContext, useEffect, useState} from "react";

export const store = {
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
export const reducer = (state, {type, payload}) => {
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

export const connect = (selector) => (Component) => {

    return (props) => {
        const {state, setState} = useContext(appContext);
        const [, update] = useState({});
        const data = selector ? selector(state) : state;
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

        return <Component {...props} {...data} dispatch={dispatch}/>;
    };
};

export const appContext = React.createContext(null);
