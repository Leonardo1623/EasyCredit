/* eslint-disable eol-last */
import Api from '@/servicio/Api'

export default {

  fetchLogin (username) {
    alert(username)
    let headers = 'application/json; charset=utf-8'
    return Api().post('/', username, headers)
  }
}