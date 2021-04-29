import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义全局共享变量
export default new Vuex.Store({
    state: {
        user: {
            username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username
        },
        isCollapse: true,
        userDrawer: false,
        tabList: [],
        menus: []
    },
    mutations: {
        login (state, user) {
            state.user = user
            window.localStorage.setItem('user', JSON.stringify(user))
        },
        changeMenuState (state, isCollapse) {
            state.isCollapse = isCollapse
        },
        changeUserDrawer (state) {
            state.userDrawer = !state.userDrawer
        },
        setTab(state, tabList) {
            state.tabList = tabList
        },
        closeCurrentTabs() {

        },
        setMenus(state, menus) {
            state.menus = menus
        }
    },
    getters: {
        userDrawer: (state) => {
            return state.userDrawer
        },
        tabList: (state) => {
            return state.tabList
        }
    }
})
