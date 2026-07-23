import router from "./router";
import { useAppStore } from "@/stores/modules/app";
import type { RouteRecordRaw } from "vue-router";
import { useTitle } from "@/hooks/useTitle";
import { getToken } from "@/utils/auth";
import { useNProgress } from "@/hooks/useNProgress";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { NO_REDIRECT_WHITE_LIST } from "@/constants";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getMenu, getInfo, getMenuOPUI, getWorksMenuOPUI } from "@/api/permiss";
// import { asyncRouterMap, constantRouterMap } from '@/router'
import { updateParentMenus } from "@/utils/routerAata";
import { setMenu } from "@/utils/dataMenu";
import axios from "axios";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";

const { start, done } = useNProgress();

router.beforeEach(async (to, from, next) => {
  start();
  const permissionStore = usePermissionStoreWithOut();
  const appStore = useAppStore();
  const userStore = useUserStoreWithOut();
  const hasUser = getToken();
  if (hasUser) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      const roleRouters = userStore.getRoleRouters || [];
      if (permissionStore.getIsAddRouters) {
        next();
        return;
      }
      // await  axios.get("http://localhost:5173/token.json").then(async ({data}) => {
      //   userStore.setUserInfo(data.content);
      //   if (data.code == 100200) {
      //     if (roleRouters.length == 0) {
      //       if (appStore.getSystemType) {
      //         await axios.get("http://localhost:5173/opuimeun.json").then(async ({data}) => {
      //           const routerArr = data.content|| []
      //           const routerData1 = setMenu(routerArr)
      //           let routerData = routerData1.map((v: any) => {
      //             let data = updateParentMenus([v])
      //             return data
      //           })
      //           userStore.setRoleRouters(routerData)
      //           await permissionStore.generateRoutes('server', routerData)
      //         })
      //         permissionStore.getAddRouters.forEach((route: any) => {
      //           router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      //         })
      //       } else {
      //         await axios.get("http://localhost:5173/meun.json").then(async ({data}) => {
      //           if (data.code == 100200) {
      //             const routerArr = data.content || []
      //             const systemRouter = routerArr.filter((v: any) => v.MenuName == 'Portal')
      //             if (systemRouter.length == 0) {
      //               await permissionStore.generateRoutes('static')
      //             } else {
      //               // console.log(systemRouter[0].childMenu);
      //               userStore.setRoleRouters(systemRouter[0].childMenu)
      //               await permissionStore.generateRoutes('server', systemRouter[0].childMenu)
      //             }
      //           }
      //           else {
      //             await permissionStore.generateRoutes('static')
      //           }
      //           // console.log(permissionStore.getAddRouters);
      //           permissionStore.getAddRouters.forEach((route: any) => {
      //             router.addRoute(route as unknown as RouteRecordRaw)
      //           })
      //         })
      //       }
      //     }
      //   } else {
      //     permissionStore.generateRoutes('static')
      //     permissionStore.getAddRouters.forEach((route: any) => {
      //       router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      //     })
      //   }
      // });
      
      await getInfo().then(async (data: any) => {
        userStore.setUserInfo(data.content);

        if (data.code == 100200 || data.code == 100300) {
          if (roleRouters.length == 0) {
            if (appStore.getSystemType) {
              await getMenu().then(async (data: any) => {
                if (data.code == 100200) {
                  const routerArr = data.content || [];
                  const opuiMenu = routerArr.length >= 3 ? routerArr[2] : null;
                  if (!opuiMenu || !opuiMenu.childMenu) {
                    await permissionStore.generateRoutes("static");
                  } else {
                    userStore.setRoleRouters(opuiMenu.childMenu);
                    await permissionStore.generateRoutes("server", opuiMenu.childMenu);
                  }
                } else {
                  await permissionStore.generateRoutes("static");
                }
                permissionStore.getAddRouters.forEach((route: any) => {
                  router.addRoute(route as unknown as RouteRecordRaw);
                });
              });
            } else {
              await getMenu().then(async (data: any) => {
                if (data.code == 100200) {
                  const routerArr = data.content || [];
                  const systemRouter = routerArr.filter(
                    (v: any) => v.MenuName == "Portal"
                  );
                  if (systemRouter.length == 0) {
                    await permissionStore.generateRoutes("static");
                  } else {
                    // console.log(systemRouter[0].childMenu);
                    userStore.setRoleRouters(systemRouter[0].childMenu);
                    await permissionStore.generateRoutes(
                      "server",
                      systemRouter[0].childMenu
                    );
                  }
                } else {
                  await permissionStore.generateRoutes("static");
                }
                permissionStore.getAddRouters.forEach((route: any) => {
                  router.addRoute(route as unknown as RouteRecordRaw);
                });
              });
            }
          }
        } else {
          permissionStore.generateRoutes("static");
          permissionStore.getAddRouters.forEach((route: any) => {
            router.addRoute(route as unknown as RouteRecordRaw); // 动态添加可访问路由表
          });
        }
      });
      
      // const redirectPath =
      //   appStore.getSystemType && localStorage.getItem("OPUIData")
      //     ? appStore.getOpuiData.path
      //     : from.query.redirect || to.path;
      const redirectPath = "/productionStation/index";
      const redirect = decodeURIComponent(redirectPath as string);
      const nextData =
        to.path === redirect ? { ...to, replace: true } : { path: redirect };
      permissionStore.setIsAddRouters(true);
      next(nextData);
      // ElNotification({
      //   title: "系统已切换",
      //   message: appStore.getSystemType ? "当前为操作端" : "当前为系统端",
      //   type: "warning",
      // });
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next();
    } else {
      if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
        let routestr = appStore.getOpuiData.path || "/";
        next(`/login?redirect=${routestr}`);
      } else {
        next(`/login?redirect=${to.path}`);
      }
    }
  }
});

router.afterEach((to) => {
  useTitle(to?.meta?.title as string);
  done(); // 结束Progress
});
