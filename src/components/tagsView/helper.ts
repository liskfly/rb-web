import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { pathResolve } from '@/utils/routerHelper'

export const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '/') => {
  let tags: RouteLocationNormalizedLoaded[] = []
  routes.forEach((route) => {
    const meta = route.meta ?? {}
    const tagPath = pathResolve(parentPath, route.path)
    // console.log(1111)
    if (meta.affix) {
      // console.log(1111)
      tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded)
    }
    if (route.children) {
      const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags
}
