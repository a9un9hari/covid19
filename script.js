

var self = window.self;
var top = window.top;
var thisUrl = window.location.href;
console.log(self);
console.log(top);
console.log(thisUrl);
// console.log(a);
function iniFrame() { 
    if ( self !== top ) 
    { 
        if (thisUrl !== 'https://covid19jatim.agunghari.com/maps.json?id=13310908covid19997a1964600f785f89718e2fb7c6f7af&pb=!1m18!1m12!1m3!1d63201.04476612399!2d112.13023634555027!3d-8.094823858034259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78eb1801b03d3d%3A0x3027a76e352bcf0!2sBlitar%2C%20Kota%20Blitar%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1585714381558!5m2!1sid!2sid') {
            alert('ReferenceError: id is not defined')
            console.log('ReferenceError: id is not defined')
        }
    }  
} 
iniFrame();

window.chartColors = {
    danger: 'rgb(220, 53, 69)',
    warning: 'rgb(255, 193, 7)',
    info: 'rgb(23, 162, 184)'
};

var zoom = ( screen.width > 750 ) ? 11 : 10;
var urlApi = 'https://covid19jatimapi.agunghari.com/map/blitar';
var mymap = L.map('mapid').setView([-8.123375, 112.178988], zoom);
var json_obj = JSON.parse(Get(urlApi));
var json_arr = [];

for(var i in json_obj)
    json_arr[json_obj[i].village] = json_obj[i];
    
var map = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ | Map By <a href="https://idraxy.web.app" target="_blank">Draxgist & Team</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

var group=L.featureGroup();
kab_geojson.features.map(
    properties => {
        console.log(properties.properties.name);
        var villageDataDetail = json_arr[properties.properties.name];
        var color = window.chartColors.info;
        var total = villageDataDetail.odp + villageDataDetail.pdp + villageDataDetail.confirm;
        var typeVillage = (villageDataDetail.city == 'KOTA BLITAR') ? 'Kel. ' : 'Kec. ';

        if(villageDataDetail.confirm > 0){
            color = window.chartColors.danger;
        }else if(villageDataDetail.pdp > 0){
            color = window.chartColors.warning
        }

        var popupContent = `
                <h5 class="text-center">` + typeVillage + properties.properties.name  + `</h5>
                <table class="table table-sm table-hover">
                    <tbody><tr class="text-success text-center">
                        <td colspan="3" class="p-0">
                            <h6 class="m-0">ODP ` + villageDataDetail.odp + `</h6>
                        </td>
                    </tr>
                    <!-- 
                    <tr class="text-primary text-center detail">
                        <td class="border-0">Dipantau: 90</td>
                        <td class="">Selesai: 76</td>
                        <td class="border-0">Meninggal: 0</td>
                    </tr>
                    -->
                    <tr class="text-warning text-center">
                        <td colspan="3" class="p-0">
                            <h6 class="m-0">PDP ` + villageDataDetail.pdp + `</h6>
                        </td>
                    </tr>
                    <!-- 
                    <tr class="text-primary text-center detail">
                        <td class="border-0">Dirawat: 3</td>
                        <td class="">Sehat: 1</td>
                        <td class="border-0">Meninggal: 0</td>
                    </tr>
                    -->
                    <tr class="text-danger text-center">
                        <td colspan="3" class="p-0">
                            <h6 class="m-0">CONFIRM ` + villageDataDetail.confirm + `</h6>
                        </td>
                    </tr>
                    <tr class="text-primary text-center">
                        <!-- <td class="border-0">Sembuh: 0</td> -->
                        <!-- <td></td> -->
                            <!-- <td class="border-0">Meninggal: 0</td> -->
                    </tr>
                    <tr class="text-muted text-center">
                        <td>Data Terakhir</td>
                        <td colspan="2">` + villageDataDetail.last_update + `</td>
                    </tr>
                </tbody></table>`;

        var latlon=L.latLng(
            
            parseFloat(properties.properties.latitude),
            parseFloat(properties.properties.longitude)
        
        );

        var icon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="pin" style="background:'+ color +'"><i>' + ("0" + total).slice(-2)  + '</i></div><div class="pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0,-24]
        });

        var marker = L.marker( latlon, {
            title   : typeVillage + properties.properties.name  ,
            icon    : icon,
        });

        marker.bindPopup(popupContent);
        marker.addTo(group);
});

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}
function style(feature) {
    var villageDataDetail = json_arr[feature.properties.name];

    var color = window.chartColors.info;
    
    if(villageDataDetail.confirm > 0){
        color = window.chartColors.danger;
    }else if(villageDataDetail.pdp > 0){
        color = window.chartColors.warning
    }
    
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 1
    };
}

function onEachFeature(feature, layer) {
    layer.bindTooltip(
        feature.properties.name,
        {
            permanent: true,
            direction:'center',
            className: 'label-village',
            opacity : 0.5
        }
    );
}

var geojson=L.geoJson(kab_geojson,{style,onEachFeature});


mymap.addLayer(group);
mymap.addLayer(geojson);