export const updateParentMenus = (menus: any) => {
    let foundComponent: any = null;
    function traverseMenus(menus: any) {
        menus.forEach((menu: any) => {
            if (menu.childMenu) {
                traverseMenus(menu.childMenu);
            }
            if (menu.MenuLevel === 3 && menu.component) {
                foundComponent = menu.component;
            }

            if (menu.MenuLevel === 1 && foundComponent) {
                menu.component = 'Layout';
                let parts = foundComponent.split('/');
                menu.path = '/' + parts[0];

            } else {
                if (!menu.path) {
                    menu.path = '/'
                }
            }
            if (menu.MenuLevel === 2 && foundComponent && menu.childMenu !== null) {
                menu.path = menu.MenuName
            }
        });
    }
    traverseMenus(menus);
    let data = menus[0]
    let childMenu=data.childMenu
    function sortChildMenu(menu: any[]): void {  
        menu.sort((a: any, b: any) => {  
            return a.sortId - b.sortId;  
        });  
        menu.forEach(item => {  
            if (item.childMenu && Array.isArray(item.childMenu)) {  
                sortChildMenu(item.childMenu);  
            }  
        });  
    }
    sortChildMenu(childMenu)
    data.childMenu=childMenu
    return data;
}