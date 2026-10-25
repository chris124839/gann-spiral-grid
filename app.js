(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('spiral'), ctx = canvas.getContext('2d');
  let cfg = {limit:100000, cell:22, zoom:1, panX:0, panY:0, showNumbers:true, cardinal:true, ordinal:true, interval:0, search:108, gridMode:'price'};
  let dragging=false, lastX=0, lastY=0;
  // Workbook grids mirror the existing spiral horizontally: 1 at centre, 2 west, then 3 NW, 4 N, 5 NE.
  function coord(n) {
    if (n===1) return {x:0,y:0};
    const k=Math.ceil((Math.sqrt(n)-1)/2), side=2*k, max=(2*k+1)**2, d=max-n;
    if(d<side)return{x:k-d,y:-k};
    if(d<2*side)return{x:-k,y:-k+(d-side)};
    if(d<3*side)return{x:-k+(d-2*side),y:k};
    return{x:k,y:k-(d-3*side)};
  }
  const ring=n=>Math.ceil((Math.sqrt(n)-1)/2);
  const workbookCoord=n=>{const p=coord(n);return cfg.gridMode==='price'?p:{x:-p.x,y:p.y};};
  const GRID_LIMITS={price:100000,session:441,'24h':1521,weekly:361,monthly:361,yearly:361};
  function labelForCell(n){
    if(cfg.gridMode==='price')return '';
    const count=n-1,mode=cfg.gridMode;
    if(mode==='session'||mode==='24h'){
      const raw=($('gridStartTime').value||'09:15').split(':').map(Number);
      let mins=raw[0]*60+raw[1]+count*5;
      if(mode==='session'){const base=9*60+15,slots=76;mins=base+((((Math.round((mins-base)/5)%slots)+slots)%slots)*5);}
      else mins=((mins%(24*60))+(24*60))%(24*60);
      return String(Math.floor(mins/60)).padStart(2,'0')+':'+String(mins%60).padStart(2,'0');
    }
    const start=$('gridStartDate').value||'2025-12-01',d=new Date(start+'T12:00:00');
    if(mode==='weekly')d.setDate(d.getDate()+count*7);
    else if(mode==='monthly'){const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+count);d.setDate(Math.min(day,new Date(d.getFullYear(),d.getMonth()+1,0).getDate()));}
    else d.setFullYear(d.getFullYear()+count);
    return mode==='yearly'?String(d.getFullYear()):d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'});
  }
  function applyGridMode(){
    cfg.gridMode=$('gridMode').value;
    const anchors={weekly:'2025-12-01',monthly:'2025-09-26',yearly:'2025-01-01'};
    if(anchors[cfg.gridMode])$('gridStartDate').value=anchors[cfg.gridMode];
    cfg.limit=GRID_LIMITS[cfg.gridMode]||100000;$('limit').value=cfg.limit;
    document.querySelectorAll('[data-limit]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.limit)===cfg.limit));
    cfg.cell=cfg.gridMode==='price'?Number($('cellSize').value):42;
    $('cellSize').value=Math.max(12,Math.min(34,cfg.cell));
    $('cellLabel').textContent=cfg.gridMode==='price'?cfg.cell+' px':'42 px (workbook)';
    cfg.panX=0;cfg.panY=0;cfg.zoom=1;draw();
  }
  function cross(p){
    if(p.x===0)return'Cardinal · North/South';
    if(p.y===0)return'Cardinal · East/West';
    if(Math.abs(p.x)===Math.abs(p.y))return p.x*p.y<0?'Ordinal · NE/SW':'Ordinal · NW/SE';
    return'Spiral level';
  }
  function color(n,p){
    if(cfg.interval&&n%cfg.interval===0)return'#fff19a';
    if(cfg.cardinal&&p.x===0)return'#a9c9ff';
    if(cfg.cardinal&&p.y===0)return'#a9c9ff';
    if(cfg.ordinal&&Math.abs(p.x)===Math.abs(p.y))return p.x*p.y<0?'#ffdf59':'#ffe982';
    return'#f1f3f5';
  }
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(r.width*d));canvas.height=Math.max(1,Math.floor(r.height*d));ctx.setTransform(d,0,0,d,0,0);draw();}
  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,w,h);
    const maxRing=ring(cfg.limit), pitch=Math.max(2,cfg.cell*cfg.zoom), cell=Math.max(1,pitch-1);
    const cx=w/2+cfg.panX*pitch, cy=h/2+cfg.panY*pitch;
    const minX=Math.max(-maxRing,Math.floor((0-cx)/pitch)-1),maxX=Math.min(maxRing,Math.ceil((w-cx)/pitch)+1);
    const minY=Math.max(-maxRing,Math.floor((cy-h)/pitch)-1),maxY=Math.min(maxRing,Math.ceil(cy/pitch)+1);
    // Render every number in the configured range, but paint only cells in the visible viewport.
    // This keeps 100k+ levels navigable without creating a giant canvas or DOM.
    for(let n=1;n<=cfg.limit;n++){
      const p=workbookCoord(n);if(p.x<minX||p.x>maxX||p.y<minY||p.y>maxY)continue;
      const x=cx+p.x*pitch,y=cy-p.y*pitch;
      ctx.fillStyle=color(n,p);ctx.fillRect(x-cell/2,y-cell/2,cell,cell);
      ctx.strokeStyle='#d2d8df';ctx.lineWidth=.55;ctx.strokeRect(x-cell/2,y-cell/2,cell,cell);
      if(cfg.showNumbers&&pitch>=11){ctx.fillStyle='#27313d';ctx.font=(Math.max(7,Math.min(cfg.gridMode==='price'?11:12,pitch*.32)))+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.toLocaleString('en-US'),x,y-(cfg.gridMode==='price'?0:5),cell);if(cfg.gridMode!=='price'&&pitch>=28){ctx.fillStyle='#36516d';ctx.font='9px Arial';ctx.fillText(labelForCell(n),x,y+7,cell);}}
    }
    // Degree labels are fixed to the outermost ring and appear as you navigate to the edges.
    const edge=maxRing*pitch, labels=[
      {t:'0° N',x:cx,y:cy-edge-pitch*.7,c:'#c92d35'},
      {t:'45° NE',x:cx+edge+pitch,y:cy-edge-pitch*.7,c:'#a87300'},
      {t:'90° E',x:cx+edge+pitch,y:cy,c:'#145fcb'},
      {t:'135° SE',x:cx+edge+pitch,y:cy+edge+pitch*.7,c:'#b96b00'},
      {t:'180° S',x:cx,y:cy+edge+pitch*.7,c:'#c92d35'},
      {t:'225° SW',x:cx-edge-pitch,y:cy+edge+pitch*.7,c:'#a87300'},
      {t:'270° W',x:cx-edge-pitch,y:cy,c:'#145fcb'},
      {t:'315° NW',x:cx-edge-pitch,y:cy-edge-pitch*.7,c:'#b96b00'}
    ];
    ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
    labels.forEach(a=>{if(a.x>=0&&a.x<=w&&a.y>=0&&a.y<=h){ctx.fillStyle=a.c;ctx.fillText(a.t,a.x,a.y)}});
    if(Number.isSafeInteger(cfg.search)&&cfg.search>=1&&cfg.search<=cfg.limit){const p=workbookCoord(cfg.search),x=cx+p.x*pitch,y=cy-p.y*pitch;if(x>=0&&x<=w&&y>=0&&y<=h){ctx.strokeStyle='#111827';ctx.lineWidth=2;ctx.strokeRect(x-cell/2+1,y-cell/2+1,cell-2,cell-2);}}
    const visibleW=Math.max(0,maxX-minX+1),visibleH=Math.max(0,maxY-minY+1);
    $('status').textContent=`Range 1–${cfg.limit.toLocaleString()} · visible window ${visibleW} × ${visibleH} · zoom ${cfg.zoom.toFixed(2)}× · scroll to zoom, drag to move`;
    renderLevels();
  }
  function renderLevels(){const body=$('levelRows');body.innerHTML='';for(let r=1;r<=6;r++){const start=r===1?2:(2*r-1)**2+1,end=(2*r+1)**2,tr=document.createElement('tr');[r,start,end,end-start+1].forEach(v=>{const td=document.createElement('td');td.textContent=v.toLocaleString();tr.appendChild(td)});body.appendChild(tr);}}
  function showInfo(n){if(!Number.isSafeInteger(n)||n<1){$('numberInfo').textContent='Enter a positive whole number.';return;}const p=workbookCoord(n),angle=(Math.atan2(p.x,p.y)*180/Math.PI+360)%360;const rows=[['Number',n.toLocaleString()],['Workbook label',labelForCell(n)||'Price spiral'],['Ring',ring(n)],['Grid coordinates',`x: ${p.x}, y: ${p.y}`],['Cross classification',cross(p)],['Angle from North',`${angle.toFixed(1)}°`],['Distance from centre',Math.hypot(p.x,p.y).toFixed(2)]];const box=$('numberInfo');box.innerHTML='';rows.forEach(([k,v])=>{const row=document.createElement('div');row.className='info-line';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=k;b.textContent=v;row.append(a,b);box.appendChild(row)});cfg.search=n;draw();}
  function generate(){if($('gridMode').value!=='price'){applyGridMode();return;}cfg.limit=Math.max(1,Math.min(Number.MAX_SAFE_INTEGER,parseInt($('limit').value,10)||100000));cfg.cell=Number($('cellSize').value);cfg.showNumbers=$('showNumbers').checked;cfg.cardinal=$('showCardinal').checked;cfg.ordinal=$('showOrdinal').checked;cfg.interval=Number($('interval').value);$('cellLabel').textContent=`${cfg.cell} px`;cfg.panX=0;cfg.panY=0;cfg.zoom=1;draw();}
  $('generate').addEventListener('click',generate);
  $('gridMode').addEventListener('change',applyGridMode);
  ['gridStartDate','gridStartTime'].forEach(id=>$(id).addEventListener('change',()=>{if(cfg.gridMode!=='price')draw()}));
  // Apply range changes directly in the GitHub-hosted dashboard; no spreadsheet or reload needed.
  $('limit').addEventListener('change',generate);
  $('cellSize').addEventListener('input',()=>{$('cellLabel').textContent=`${$('cellSize').value} px`;});
  ['showNumbers','showCardinal','showOrdinal','interval'].forEach(id=>$(id).addEventListener('change',generate));
  // The Center number field doubles as a quick-find shortcut and updates the grid highlight.
  $('center').addEventListener('change',()=>{const n=Number($('center').value);$('numberSearch').value=n;showInfo(n);});
  document.querySelectorAll('[data-limit]').forEach(b=>b.addEventListener('click',()=>{$('limit').value=b.dataset.limit;document.querySelectorAll('[data-limit]').forEach(x=>x.classList.toggle('selected',x===b));generate()}));
  $('findNumber').addEventListener('click',()=>{const n=Number($('numberSearch').value);showInfo(n);if(n>cfg.limit)$('status').textContent='Number coordinates calculated; increase the range to display it.'});
  $('numberSearch').addEventListener('keydown',e=>{if(e.key==='Enter')$('findNumber').click()});
  canvas.addEventListener('wheel',e=>{e.preventDefault();const old=cfg.zoom;cfg.zoom=Math.max(.08,Math.min(2.5,cfg.zoom*(e.deltaY<0?1.15:1/1.15)));if(old!==cfg.zoom)draw();},{passive:false});
  // Click-and-drag panning works with mouse, pen, and touch.
  canvas.style.touchAction='none';
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==undefined&&e.button!==0)return;
    e.preventDefault();dragging=true;lastX=e.clientX;lastY=e.clientY;
    try{canvas.setPointerCapture(e.pointerId)}catch(_){}
    canvas.style.cursor='grabbing';
  });
  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;e.preventDefault();
    const pitch=Math.max(2,cfg.cell*cfg.zoom);
    cfg.panX+=(e.clientX-lastX)/pitch;
    cfg.panY-=(e.clientY-lastY)/pitch;
    lastX=e.clientX;lastY=e.clientY;draw();
  });
  function endDrag(e){if(!dragging)return;dragging=false;canvas.style.cursor='grab';if(e&&e.pointerId!==undefined){try{canvas.releasePointerCapture(e.pointerId)}catch(_){}}}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',()=>{dragging=false;canvas.style.cursor='grab'});
  // Double-click resets the view; arrow keys pan when the grid is focused.
  canvas.tabIndex=0;
  canvas.addEventListener('dblclick',()=>{cfg.panX=0;cfg.panY=0;cfg.zoom=1;draw()});
  canvas.addEventListener('keydown',e=>{const step=e.shiftKey?5:1;if(e.key==='ArrowLeft')cfg.panX+=step;else if(e.key==='ArrowRight')cfg.panX-=step;else if(e.key==='ArrowUp')cfg.panY-=step;else if(e.key==='ArrowDown')cfg.panY+=step;else return;e.preventDefault();draw()});
  canvas.style.cursor='grab';window.addEventListener('resize',resize);renderLevels();resize();showInfo(108);
})();