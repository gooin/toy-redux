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
            <UserModifier x={'xx'}>
                <h1>XXX</h1>
            </UserModifier>
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

const connect = (Component)=>{
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
    console.log('props', props);

    const {dispatch,appState,children} = props;
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
    return (
        <h1>A3</h1>
    )
}

