import { readFileSync } from 'node:fs';
import { buildSync } from 'esbuild';
const ROOT='/home/runner/work/Freyraum/Freyraum';
async function load(p){const r=buildSync({entryPoints:[ROOT+'/'+p],bundle:true,format:'esm',platform:'browser',write:false,target:['es2020']});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const hub=await load('src/config/museumHub.ts'); const g=await load('src/hub/projectiveGeometry.ts');
const cfg=JSON.parse(readFileSync(ROOT+'/customer-artworks/museum-hub.json','utf8'));
const arts=['fraktal','akt-27','c3','c4'].map(id=>({id,title:id,image:'x.jpg',dimensions:{width:1000,height:1300}}));
const res=hub.resolveMuseumHub(arts,cfg);
export {res,g,hub};
for (const slot of res.pages[0].slots.filter(s=>s.artworkId)) {
  const wall=res.wallById.get(slot.placement.wallId);
  const p=slot.placement;
  // current validator ('room' mode) vs display ('room-fixed')
  for (const y of [0.05,0.2,0.35,0.5]) {
    const test={...p, center:{x:p.center.x,y}, uv:{x:p.center.x,y:1-y}, anchor:{x:p.center.x*wall.room.width,y:(1-y)*wall.room.height}};
    const a=g.projectSlotArtwork(wall,test,slot.artworkAspect,res.stage);
    const b=g.projectSlotArtwork(wall,test,slot.artworkAspect,res.stage,'room-fixed');
    const inZ=q=>q&&q.projectedQuad.every(c=>g.pointInPolygon(c,wall.mountingZone));
    console.log(slot.id,y, 'room:',a&&a.projectiveFallback?'fallback':'', inZ(a), a?.placement?.anchor.y?.toFixed(2), '| fixed:', inZ(b), b?.placement?.anchor.y?.toFixed(2), b?.projectedQuad.map(c=>c.y.toFixed(0)).join(','));
  }
}
for (const w of res.walls) console.log(w.id, w.room?.width, w.room?.height, JSON.stringify(w.room?.hangingBand), JSON.stringify(w.room?.safePolygon), w.projectionRealism?.passes, JSON.stringify(w.localCalibrationScale));
console.log(res.pages.length, res.pages.map(p=>p.slots.map(s=>s.id+':'+s.artworkId+':'+s.placement.wallId).join(' ')));
