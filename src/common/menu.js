const getMainMenus = (appRoutes, currentRoute) => {
   let mainLinks = getMainLinks(appRoutes);
   mainLinks.forEach(item => {
      item.active = (item.name === currentRoute.name);
   });

   return mainLinks;
}


const getMainLinks = (routes) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let mainMenu = menus.find(x => x.key === 'main');
      if(mainMenu) return true;
      return false;      
   }
   return false;
});


const getSubLinks = (routes, parent) => routes.filter(item => item.parent === parent);

export default { getMainMenus };
