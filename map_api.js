let map_api = process.env.MAP_API_KEY;
maptilersdk.config.apiKey = 'map_api';
      const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [13.3975, 52.5196], // starting position [lng, lat]
        zoom: 11, // starting zoom
});