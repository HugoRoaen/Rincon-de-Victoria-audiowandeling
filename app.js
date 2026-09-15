const cueva = [
  [1,'Bienvenida'],[2,'Sala de la Virgen'],[3,'Pozo del Suizo'],[4,'Sala de Marco Craso'],
  [5,'Sala de Aguilera'],[6,'Santuario de Noctiluca'],[7,'Sala del Volcán'],[8,'Sala de los Lagos']
];
const antiopa = [
  [1,'Bienvenida'],[2,'Área expositiva'],[3,'Atril 1 – Dormitorio principal'],[4,'Atril 2 – Gran Galería'],
  [5,'Atril 3 – Dormitorio'],[6,'Atril 4 – Dormitorio'],[7,'Atril 5 – Oecus'],[8,'Atril 6 – Entrada principal de la villa'],
  [9,'Atril 7 – Dormitorio'],[10,'Atril 8 – Tablinum'],[11,'Atril 9 – Triclinium'],[12,'Atril 10 – Zona de servicio'],
  [13,'Atril 11 – Pórtico norte'],[14,'Atril 12 – Habitación del villicus'],[15,'Atril 13 – Distribuidor'],[16,'Atril 14 – Almacén'],
  [17,'Het leven in de villa – Publio, Dominus'],[18,'Het leven in de villa – Cornelia, Domina'],
  [19,'Het leven in de villa – Orestes, Villicus'],[20,'Het leven in de villa – Sertena, Esclava'],
  [21,'Audiovisueel – Mozaïeken'],[22,'Audiovisueel – Muurschilderingen'],[23,'Audiovisueel – Garum']
];

const ext = (kind,n) => {
  if(kind==='cueva') return n <= 6 ? 'jpg' : 'jpeg';
  return [1,2].includes(n) ? 'jpg' : 'jpeg';
};

function renderCards(target,items,kind){
  document.getElementById(target).innerHTML=items.map(([n,title])=>`
    <article class="audio-card">
      <img src="assets/images/${kind}/${n}.${ext(kind,n)}" alt="${title}" loading="lazy">
      <div class="card-body">
        <div class="number">Audio ${n}</div>
        <h3>${title}</h3>
        <audio controls preload="none" src="assets/audio/${kind}/${n}.mp3">Je browser ondersteunt deze audio niet.</audio>
      </div>
    </article>`).join('');
}
renderCards('cueva-list',cueva,'cueva');
renderCards('antiopa-list',antiopa,'antiopa');

document.addEventListener('play',e=>{
  if(e.target.tagName==='AUDIO') document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()});
},true);

async function drawRoute(){
  const map=L.map('map',{scrollWheelZoom:false});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  try{
    const xml=new DOMParser().parseFromString(await fetch('assets/route/rincon-de-victoria.gpx').then(r=>r.text()),'text/xml');
    const points=[...xml.querySelectorAll('trkpt, rtept')].map(p=>[+p.getAttribute('lat'),+p.getAttribute('lon')]);
    const route=L.polyline(points,{color:'#e4552f',weight:6,opacity:.92}).addTo(map);
    map.fitBounds(route.getBounds(),{padding:[24,24]});
    if(points.length){L.marker(points[0]).addTo(map).bindPopup('Start: Cueva del Tesoro');L.marker(points.at(-1)).addTo(map).bindPopup('Einde: restaurant');}
  }catch(error){map.setView([36.716,-4.29],14)}
}
drawRoute();
