import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`https://nominatim.openstreetmap.org/search.php`;

const fetch = (params) => BaseService.fetch(source, params);

const details = (id) => BaseService.fetch(`${source}/${id}`);


export default { fetch, details };