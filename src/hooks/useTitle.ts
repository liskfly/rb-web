import { watch, ref } from 'vue'
import { isString } from '@/utils/is'
import { useAppStoreWithOut } from '@/stores/modules/app'


export const useTitle = (newTitle?: string) => {
  const appStore = useAppStoreWithOut()

  const title = ref(
    // newTitle ? `${newTitle as string} - ${appStore.getTitle}` : appStore.getTitle
    newTitle ?appStore.getTitle: appStore.getTitle
  )

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
