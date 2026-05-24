import { defineStore } from 'pinia'
import { store } from '../index'
import { getToken,removeToken} from "@/utils/auth";
// import { UserLoginType, UserType } from '@/api/login/types'
import { ElMessageBox } from 'element-plus'
// import { useI18n } from '@/hooks/web/useI18n'
// import { loginOutApi } from '@/api/login'
// import { useTagsViewStore } from './tagsView'
import router from '@/router'

interface UserState {

  userInfo?: any
  tokenKey: string
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
  loginInfo?: any
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: '',
      tokenKey: 'Authorization',
      token: getToken()||'',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getUserInfo(): any | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
    getLoginInfo(): any | undefined {
      return this.loginInfo
    }
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo?: any) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    // logoutConfirm() {
    //   const { t } = useI18n()
    //   ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    //     confirmButtonText: t('common.ok'),
    //     cancelButtonText: t('common.cancel'),
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       const res = await loginOutApi().catch(() => {})
    //       if (res) {
    //         this.reset()
    //       }
    //     })
    //     .catch(() => {})
    // },
    reset() {
    //   const tagsViewStore = useTagsViewStore()
    //   tagsViewStore.delAllViews()
      this.setToken('')
      this.setUserInfo('')
      removeToken()
      localStorage.removeItem("OPCENTER_ROLE");
      this.setRoleRouters([])
      router.replace('/login')
      location.reload();
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo: any | undefined) {
      this.loginInfo = loginInfo
    }
  },
  persist: true
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
