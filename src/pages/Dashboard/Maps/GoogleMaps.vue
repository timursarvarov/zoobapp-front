<template>
    <div class="md-layout">
        <div class="md-layout-item md-size-100">
            <md-card>
                <md-card-header class="md-card-header-text md-card-header-green">
                    <div class="card-text">
                        <h4 class="title">
                            Satellite Map
                        </h4>
                    </div>
                </md-card-header>
                <md-card-content>
                    <div class="card-text">
                        <div id="satelliteMap" class="map map-big" />
                    </div>
                </md-card-content>
            </md-card>
        </div>
        <div class="md-layout-item md-small-size-100">
            <md-card>
                <md-card-header class="md-card-header-text md-card-header-green">
                    <div class="card-text">
                        <h4 class="title">
                            Regular Map
                        </h4>
                    </div>
                </md-card-header>
                <md-card-content>
                    <div id="regularMap" class="map" />
                </md-card-content>
            </md-card>
        </div>
        <div class="md-layout-item md-small-size-100">
            <md-card>
                <md-card-header class="md-card-header-text md-card-header-green">
                    <div class="card-text">
                        <h4 class="title">
                            Custom Skin & Settings Map
                        </h4>
                    </div>
                </md-card-header>
                <md-card-content>
                    <div id="customSkinMap" class="map" />
                </md-card-content>
            </md-card>
        </div>
    </div>
</template>
<script>
import GoogleMapsLoader from 'google-maps';
import API_KEY from './API_KEY';

GoogleMapsLoader.KEY = API_KEY;

export default {
    name: 'GoogleMaps',
    mounted() {
        GoogleMapsLoader.load(google => {
            this.initSattelliteMap(google);
            this.initRegularMap(google);
            this.initCustomSkinMap(google);
        });
    },
    methods: {
        initSattelliteMap() {
            // Satellite Map
            const myLatlng = new window.google.maps.LatLng(40.748817, -73.985428);
            const mapOptions = {
                zoom: 3,
                scrollwheel: false,
                // we disable de scroll over the map, it is a really annoing when you scroll through page
                center: myLatlng,
                mapTypeId: window.google.maps.MapTypeId.SATELLITE
            };

            const map = new window.google.maps.Map(document.getElementById('satelliteMap'), mapOptions);

            const marker = new window.google.maps.Marker({
                position: myLatlng,
                title: 'Satellite Map!'
            });
            marker.setMap(map);
        },
        initRegularMap() {
            // Regular Map
            const myLatlng = new window.google.maps.LatLng(40.748817, -73.985428);
            const mapOptions = {
                zoom: 8,
                center: myLatlng,
                scrollwheel: false
                // we disable de scroll over the map, it is a really annoing when you scroll through page
            };

            const map = new window.google.maps.Map(document.getElementById('regularMap'), mapOptions);

            const marker = new window.google.maps.Marker({
                position: myLatlng,
                title: 'Regular Map!'
            });

            marker.setMap(map);
        },
        initCustomSkinMap(google) {
            // Custom Skin & Settings Map
            const myLatlng = new google.maps.LatLng(40.748817, -73.985428);
            const mapOptions = {
                zoom: 13,
                center: myLatlng,
                scrollwheel: false,
                // we disable de scroll over the map, it is a really annoing when you scroll through page
                disableDefaultUI: true, // a way to quickly hide all controls
                zoomControl: true,
                styles: [
                    {
                        featureType: 'water',
                        stylers: [{ saturation: 43 }, { lightness: -11 }, { hue: '#0088ff' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.fill',
                        stylers: [{ hue: '#ff0000' }, { saturation: -100 }, { lightness: 99 }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#808080' }, { lightness: 54 }]
                    },
                    {
                        featureType: 'landscape.man_made',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#ece2d9' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#ccdca1' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#767676' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#ffffff' }]
                    },
                    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                    {
                        featureType: 'landscape.natural',
                        elementType: 'geometry.fill',
                        stylers: [{ visibility: 'on' }, { color: '#b8cb93' }]
                    },
                    { featureType: 'poi.park', stylers: [{ visibility: 'on' }] },
                    {
                        featureType: 'poi.sports_complex',
                        stylers: [{ visibility: 'on' }]
                    },
                    { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
                    {
                        featureType: 'poi.business',
                        stylers: [{ visibility: 'simplified' }]
                    }
                ]
            };

            const map = new google.maps.Map(document.getElementById('customSkinMap'), mapOptions);

            const marker = new google.maps.Marker({
                position: myLatlng,
                title: 'Custom Skin & Settings Map!'
            });

            marker.setMap(map);
        }
    }
};
</script>
<style lang="scss">
.card-map {
    min-height: 350px;
    .map {
        height: 300px;
        width: 100%;
    }
}
</style>
