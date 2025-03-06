import { LocalStorage } from 'node-localstorage'

export default function makeStorage() {

    const storage = new LocalStorage('./.ts')

    const getUser = (psid) => JSON.parse(storage.getItem(`${psid}_user`))
    const setUser = (psid, value) => storage.setItem(`${psid}_user`, JSON.stringify(value))

    const hasQuestion = (psid, key) => storage.getItem(`${psid}_${key}`) === 'true'
    const setQuestion = (psid, key, value) => storage.setItem(`${psid}_${key}`, value)
    const removeQuestion = (psid, key) => storage.removeItem(`${psid}_${key}`)

    const isLiveChat = (psid) => storage.getItem(`${psid}_isLiveChat`) === 'true'
    const setLiveChat = (psid, value) => storage.setItem(`${psid}_isLiveChat`, value)
    
    const getPrevious = (psid) => JSON.parse(storage.getItem(`${psid}_previous_received`))
    const setPrevious = (psid, value) => storage.setItem(`${psid}_previous_received`, JSON.stringify(value))

    return {
        hasQuestion, setQuestion, removeQuestion,
        getUser, setUser, 
        isLiveChat, setLiveChat,
        getPrevious, setPrevious,
    }

}