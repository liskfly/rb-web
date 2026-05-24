import { getAllParentPath } from '@/components/menu/helper'
// import { isUrl } from '@/utils/is'
import { cloneDeep } from 'lodash-es'
import { reactive } from 'vue'

export type TabMapTypes = {
  [key: string]: string[]
}

export const tabPathMap = reactive<TabMapTypes>({})

export const initTabMap = (routes: AppRouteRecordRaw[]) => {
  
  for (const v of routes) {
    const meta = v.meta ?? {}
    if (!meta?.hidden) {
      // console.log(v.path)
      tabPathMap[v.path] = []
    }
  }
//   console.log(tabPathMap)
}

export const filterMenusPath = (
  routes: AppRouteRecordRaw[],
  allRoutes: AppRouteRecordRaw[]
): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []
  for (const v of routes) {
    let data:any = []
    const meta = v.meta ?? {}
    if (!meta.hidden || meta.canTo) {
      const allParentPath = getAllParentPath(allRoutes, v.path)
      const fullPath = allParentPath.join('/')
      data = cloneDeep(v)
      // console.log(data)
      data.path = fullPath
      if (v.children && data) {
        data.children = filterMenusPath(v.children, allRoutes)
      }

      if (data) {
        res.push(data)
        // console.log(res)
      }

      if (allParentPath.length && Reflect.has(tabPathMap, allParentPath[0])) {
        tabPathMap[allParentPath[0]].push(fullPath)
        // console.log(tabPathMap)
      }
    }
  }
  return res
}
