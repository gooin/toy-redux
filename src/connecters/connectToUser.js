import {connect} from '../redux.jsx'

// 将通用的用到User的地方提取出来
const userSelector = (state) => {
    return {user: state.user}
}
// 将通用的用到User的地方提取出来
const userDispatcher = (dispatch) => {
    return {
        updateUser: (attrs) => dispatch({type: 'updateUser', payload: attrs})
    }
}

// // 将通用的用到User的地方提取出来，简化connect创建
export const connectToUser = connect(userSelector, userDispatcher);