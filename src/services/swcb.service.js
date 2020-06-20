import BaseService from '@/common/baseService';
const source =`https://246.swcb.gov.tw/api`;

const getLocation = (lat, lng) => {
   let params = {
      Method: 'GetLocation',
      lat, lng,
   };

   return BaseService.fetch(`${source}/Map`, params);
}

const getTownAlertInfo = (county, town) => {
   let params = {
      Method: 'GetTownAlertInfo',
      county, town,
   };

   return BaseService.fetch(`${source}/Map`, params);
}


export default { getLocation, getTownAlertInfo };