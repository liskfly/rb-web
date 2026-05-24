import Cookies from 'js-cookie'

const TokenKey = 'OPCENTER_ADMIN'
const inFifteenMinutes = new Date(new Date().getTime() + 24 * 3 * 60 * 60 * 1000)
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: any) {
  return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}