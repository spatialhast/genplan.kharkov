//Base layers
var layerOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var layerMapSurfer = new L.tileLayer("http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}", {
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var layerMapboxImagery = new L.tileLayer(
    'https://{s}.tiles.mapbox.com/v4/openstreetmap.map-inh7ifmo/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q', {
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
    });

var BingLayer = L.TileLayer.extend({
    getTileUrl: function (tilePoint) {
        this._adjustTilePoint(tilePoint);
        return L.Util.template(this._url, {
            s: this._getSubdomain(tilePoint),
            q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
        });
    },
    _quadKey: function (x, y, z) {
        var quadKey = [];
        for (var i = z; i > 0; i--) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadKey.push(digit);
        }
        return quadKey.join('');
    }
});

var layerBingAerial = new BingLayer('https://t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=2732', {
    subdomains: ['0', '1', '2', '3', '4'],
    attribution: '&copy; <a href="https://www.bing.com/maps">Bing Maps</a>'
});

// Overlay layer
var layerGenplan = L.tileLayer('tiles/{z}/{x}/{y}.png', {
    tms: true,
    opacity: 1,
    attribution: '&copy; <a href="http://uga.kharkov.ua/gp-kh.html">Департамент градостроительства, архитектуры и генерального плана</a>'
});

// init map
var map = L.map('map', {
    center: [49.9832, 36.2862],
    zoom: 11,
    minZoom: 11,
    maxZoom: 16,
    layers: [layerOSM, layerGenplan]
});

// init Layer Control
var baseLayers = {
    "OpenStreetMap": layerOSM,
    "MapSurfer": layerMapSurfer,
    "Mapbox Imagery": layerMapboxImagery,
    "Bing Aerial": layerBingAerial
};

var overlayLayers = {
    "Генплан": layerGenplan
};

L.control.layers(baseLayers, overlayLayers, {
    collapsed: false
}).addTo(map);


// opacity control
var slider = new Slider('#opacity-control', {
    min: 0,
    max: 100,
    value: 100,
    tooltip_position: 'bottom'
});

slider.on("slide", function (val) {
    layerGenplan.setOpacity(val / 100);
});


// swipe
var range = document.getElementById('range');

function clip() {
    var nw = map.containerPointToLayerPoint([0, 0]),
        se = map.containerPointToLayerPoint(map.getSize()),
        clipX = nw.x + (se.x - nw.x) * range.value;
    layerGenplan.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
}
range['oninput' in range ? 'oninput' : 'onchange'] = clip;
map.on('move', clip);


map.setView([49.9833, 36.2869], 11);