import { defineStore } from 'pinia'
import { store } from '../index'

interface UserState {
    defectiveKList:any
}

export const useprojectStore = defineStore('projectData', {
  state: (): UserState => {
    return {
        defectiveKList:[]
    }
  },
  getters: {
    getFectivekList(): string {
      return this.defectiveKList
    },
  },
  actions: {
    setFectivekList(list: any) {
      this.defectiveKList = list
    },
  },
  persist: true
})

export const useProjectStoreWithOut = () => {
  return useprojectStore(store)
}
