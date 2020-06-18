export const isValidLatitude = (val) => {
   let lat = parseInt(val);
   return lat >= -85 && lat <= 85
}

export const isValidLongitude = (val) => {
   let lng = parseInt(val);
   return lng >= -180 && lng <= 180
}