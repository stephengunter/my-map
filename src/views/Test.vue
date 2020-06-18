<template>
	<v-container>
		<v-row v-if="responsive">
			<v-col cols="12">
				<v-text-field :id="location.inputId" append-icon="mdi-close"
				v-model="location.address"
				@click:append="clearLocation"
				/>
			</v-col>
			<v-col cols="8">
				<v-text-field :id="search.inputId" prepend-icon="mdi-magnify" append-icon="mdi-close"
				v-model="search.keyword"
				@click:append="clearKeyword"
				/>
			</v-col>
			<v-col cols="4">
				<v-btn color="success" class="mt-3" :disabled="!hasKeyword" @click.prevent="launchPlacesSearch">
					Go
				</v-btn>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="5">
				<v-text-field :id="location.inputId" append-icon="mdi-close"
				v-model="location.address"
				@click:append="clearLocation"
				/>
			</v-col>
			<v-col cols="5">
				<v-text-field :id="search.inputId" prepend-icon="mdi-magnify" append-icon="mdi-close"
				v-model="search.keyword"
				@click:append="clearKeyword"
				/>
			</v-col>
			<v-col cols="2">
				<v-btn color="success" class="mt-3">
					Go
				</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<v-card>
					<map-google-test ref="gMap" :id="map.id"
					@initialized="onMapInitialized" @address="updateAddressFromMap"
					/>
				</v-card>
			</v-col>
		</v-row>
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_CITY_GEO } from '@/store/actions.type';
import { onError, resolveErrorData, uuid, buildQuery } from '@/utils';

const cityStateHelper = (str) => {
	if (!str) return '';
			
	let parts = str.split(',');
	let city = parts[0];
	// just the first two characters...
	let state = parts[1].trim().substring(0,2);
	return `${city},${state}`;
}

const getCityState = (address) => {
	let cs = '';
	// this is not foolproof.. do a deep dive into the address components
	// and their type, if you are going to be more thorough.. I am just
	// working off of the formatted address
	// more info at https://developers.google.com/maps/documentation/geocoding/start?csw=1
	address.map(curAddress => {        
		if (curAddress.types[0] === 'locality') {
			cs = cityStateHelper(curAddress.formatted_address);
		}
	});
	
	return cs;
}

const getCityIndex = (data) => {
	let retIndex = null;
	let adminIndex = null;

	data.map((curData, index) => {
		console.log(curData.type);
		switch(curData.type) {
			case 'city':
				retIndex = index;
				break;
			case 'administrative':
				adminIndex = index;
				break;
			default:
				break;
		}
	});

	// ... we punt to administrative...
	if (retIndex === null && adminIndex !== null) {
		retIndex = adminIndex;
	}

	return retIndex;
}

export default {
	name: 'HomeView',
	data(){
		return {
			map: {
				id: `map_${uuid()}`
			},

			place: null,
			location: {
				inputId: `location_${uuid()}`,
				address: '',
				cityState: '',
			},
			cityData: null,

			googleGeometryMultiPoly: [],
			numGeometries: 0,

			search: {
				inputId: `search_${uuid()}`,
				keyword: '',
			},

			geocoder: null,


			references: {}
		}
	},
	beforeMount() {
		this.init();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	computed: {
		...mapGetters(['responsive']),
		gMap() {
			if(this.$refs.gMap) return this.$refs.gMap;
			else if (this.references.gMap) return this.references.gMap;
			return null;
		},
		hasKeyword() {
			if(!this.search.keyword) return false;

			let keyword = this.search.keyword.trim();
			if(keyword) return true;
			return false;
		},
		hasCity() {
			if(this.cityData) return true;
			return false;
		}
	},
  	methods: {
		init() {
			
		},
		onMapInitialized() {
			this.initMapAutocomplete();
		},
		initMapAutocomplete() {
			this.geocoder = new google.maps.Geocoder();
			
			const autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.location.inputId));

			google.maps.event.addListener(autocomplete, 'place_changed', () => {
				this.place = autocomplete.getPlace();
				let address = this.place.formatted_address;

				if(address) {
					this.setAddress(address);
					this.onNewAddress();

					this.location.cityState = cityStateHelper(address);
				}
				
			});
		},
		clearLocation() {
			this.location.address = '';
		},
		setAddress(val) {
			if(val) this.location.address = val;
			else this.location.address = '';
		},
		updateAddressFromMap(results) {
			let address = results[0].formatted_address;
			if(address) {
				this.setAddress(address);
				this.location.cityState = getCityState(results);
				
				this.fetchCity();
			}
		},
		onNewAddress() {
			this.gMap.updateFromAddress(this.place);
		},
		fetchCity() {
			let cityState = this.location.cityState;
			let params = {
				q: `${cityState},USA`,
				polygon_geojson: 1,
				format: 'json'
			};

			this.$store.dispatch(FETCH_CITY_GEO, params)
			.then(data => {
				let index = getCityIndex(data);
				let geoJSONDataChunk = data[index];

				this.loadCityData(geoJSONDataChunk.geojson);
			})
			.catch(error => {
				console.error(error);
			})
		},
		loadCityData(geoJson) {
			let polygonType = geoJson.type || null;

			// geojson data from http://nominatim.openstreetmap.org/ needs
			// to be wrapped, so that the google addGeoJson() call
			// can handle it properly
			const geoConf = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: geoJson,
					id: 'city'
				}]
			};

			let cityData = new google.maps.Data();
			cityData.addGeoJson(geoConf, 'city');
			cityData.setStyle({
				fillColor: 'green',
				fillOpacity: 0.1,
				strokeWeight: 1
			});

			// we want to get geometry into our local objects, and create
			// google geometry objects with it.. hence the naming...  
			let localCity = cityData.getFeatureById('city');
			let allLocalMultiPolys = [];
			let localGeometry = null;
				
			// if a Polygon, our coordinates are at coordinates[0]
			// if a MultiPolygon, we loop through coordinates[0]...coordinates[n]
			if(polygonType === 'Polygon') {
				localGeometry = localCity.getGeometry();
				let numArrays = localGeometry.getLength();

				allLocalMultiPolys[0] = [];

				for (let i = 0; i < numArrays; i++) {
					allLocalMultiPolys[0].push(localGeometry.getAt(i).getArray());
				}

				this.googleGeometryMultiPoly[0] = new google.maps.Polygon({
					paths: allLocalMultiPolys[0]
				})

				this.numGeometries = 1;

			}else {

				localGeometry = localCity.getGeometry();
				let localGeometryArray = localCity.getGeometry().getArray();

				localGeometryArray.map((item, i) => {
					allLocalMultiPolys[i] = [];
					let curPolyNum = item.getLength();
					for (let j = 0; j < curPolyNum; j++) {
						allLocalMultiPolys[i].push(item.getAt(j).getArray());
					}
					this.googleGeometryMultiPoly[i] = [];
					this.googleGeometryMultiPoly[i] = new google.maps.Polygon({
						paths: allLocalMultiPolys[i]
					});
				});

				this.numGeometries = localGeometry.getLength();
			}

			this.cityData = cityData;

			this.gMap.setCityData({
				coordinates: cityData,
				multiPoly: this.googleGeometryMultiPoly,
				numGeometries: this.numGeometries
			});
		},
		clearKeyword() {
			this.search.keyword = '';
		},
		launchPlacesSearch() {
			let keyword = this.search.keyword.trim();
			if(!keyword) return;
			this.gMap.searchPlacesByKeyword(keyword);
		},
	}
}
</script>
