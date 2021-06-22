import store from 'store'

const USER_KEY = 'user_key'

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    saveUser(user) {
        store.set(USER_KEY, user)
    },

    getUser() {
        return store.get(USER_KEY, {})
    },

    removeUser() {
        store.remove(USER_KEY)
    }
}