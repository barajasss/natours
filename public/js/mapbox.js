export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYmFyYWphc3dhcmdpYXJ5IiwiYSI6ImNrYjB1ZG11bTBicHAyc210bzlxZHY0c2MifQ.RuoZ7N6zGiwMuOeNeFVa9A';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/barajaswargiary/ckb0unt3a0fwx1irubta3qxvk',
        scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
