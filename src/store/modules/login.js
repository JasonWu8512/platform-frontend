import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'

const SET_TOKEN = 'SET_TOKEN'
const CLEAR_TOKEN = 'CLEAR_TOKEN'
const FLASH_TOKEN = 'FLASH_TOKEN'
const SET_ROLE = 'SET_ROLE'
// const SET_PICTURE = 'SET_PICTURE'

// eslint-disable-next-line no-unused-vars
const COOKIE_EXPIRED = process.env.VUE_APP_COOKIE_EXPIRED
const COOKIE_DOMAIN = process.env.VUE_APP_COOKIE_DOMAIN
const COOKIE_SUFFIX = process.env.VUE_APP_COOKIE_SUFFIX

// console.log("COOKIE_DOMAIN", COOKIE_DOMAIN)

const JWT_TOKEN = `JWT_TOKEN${COOKIE_SUFFIX}`

export default {
    state: {
        uid: 0,
        userid: 0,
        username: '',
        email: '',
        picture: '',
        exp: 0,
        role: [],
        permissions: [],
        JWT_TOKEN: ''
    },
    getters: {
        isLogin: state => {
            return state.JWT_TOKEN !== ''
        },
        // isAdmin: state => {
        //     console.log('userstate',state.role)
        //     let admin = false
        //     state.role.forEach(item => {
        //         if(item.id == 1){
        //             admin = true
        //         }
        //     })
        //     console.log('admin',admin)
        //     return admin
        // },
        uid: state => {
          return state.uid
        },
        userName: state => {
            return state.username
        },
        userid: state => {
            return state.userid
        },
        userPers: state => {
            return state.permissions
        }
    },
    mutations: {
        [SET_TOKEN](state, token) {
            let decoded = jwtDecode(token)
            // console.log("decoded.exp", decoded.exp)
            // console.log("exp", decoded.exp || 0)
            let exp = decoded.exp || 0
            let EXPIRED = new Date(new Date().getTime() + exp)
            Cookies.set(JWT_TOKEN, token, {
                expires: EXPIRED,
                domain: COOKIE_DOMAIN
            })
            localStorage.token = token
            state.uid = decoded.uid
            state.userid = decoded.user_id || 0
            state.username = decoded.username || ''
            state.email = decoded.email
            state.picture = decoded.picture || ''
            state.exp = decoded.exp || 0
            state.role = decoded.role || []
            state.JWT_TOKEN = token
        },
        [CLEAR_TOKEN](state) {
            state.uid = 0
            state.userid = 0
            state.username = ''
            state.picture = ''
            state.exp = 0
            state.role = []
            state.email = ''
            state.JWT_TOKEN = ''
            localStorage.removeItem('token')
            Cookies.remove(JWT_TOKEN, process.env.NODE_ENV === 'development' ? {} : {domain: COOKIE_DOMAIN})
            //清除存储
        },
        [FLASH_TOKEN](state) {
            let token = Cookies.get(JWT_TOKEN)
            state.JWT_TOKEN = token || ''
            if (token) {
                let decoded = jwtDecode(token)
                state.userid = decoded.user_id || 0
                state.uid = decoded.uid
                state.username = decoded.username || ''
                state.email = decoded.email || ''
                state.picture = decoded.picture || ''
                state.exp = decoded.exp || 0
            }
        },
        [SET_ROLE](state, perms){
          console.log('perms', perms)
          state.permissions = perms || []
        },
        // [SET_PICTURE](state,picture){
        //     state.picture = picture
        // }
    },
    actions: {}
}
