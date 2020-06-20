import BaseService from '@/common/baseService';
import { CWB } from '@/config';

const source =`https://opendata.cwb.gov.tw/fileapi/v1/opendataapi`;

const fetch = (category, params) => {
   if(!params) params = {};
   params.Authorization = CWB.key;

   return BaseService.fetch(`${source}/${category}`, params);
}


export default { fetch };