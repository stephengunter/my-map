export const PRODUCTION = false;
export const SITE_URL = PRODUCTION ? 'https://blog.exam-learner.com' : 'http://localhost:8080';
export const SITE_TITLE = 'Map App';

export const GOOGLE_MAP = {
   url: 'https://maps.googleapis.com/maps/api/js',
   key: 'AIzaSyDI95b_ASFbbVuyntnNIdVd6X9Vc0AGEBU',
   markerClustererPlus: {
      src: 'https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js',
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
   }
};

//UI
export const THEME = {
   color: 'teal accent-4',
   dark: true
};
export const DIALOG_MAX_WIDTH = 420;
