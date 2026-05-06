import { useState, useEffect, useMemo } from "react";

const genId = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4);

const PALETTE = {
  amber:  { bg:'#FAEEDA', border:'#EF9F27', text:'#854F0B' },
  blue:   { bg:'#E6F1FB', border:'#378ADD', text:'#185FA5' },
  teal:   { bg:'#E1F5EE', border:'#1D9E75', text:'#0F6E56' },
  gray:   { bg:'#F1EFE8', border:'#B4B2A9', text:'#5F5E5A' },
  coral:  { bg:'#FAECE7', border:'#D85A30', text:'#993C1D' },
};
const STATUS = {
  necesito: { label:'Falta',  short:'Falta',  ...PALETTE.amber, icon:'ring'  },
  comprado: { label:'Listo',  short:'Listo', ...PALETTE.blue,  icon:'arrow' },
  tengo:    { label:'Tengo',  short:'Tengo',  ...PALETTE.teal,  icon:'check' },
  quizas:   { label:'Quizás', short:'Quizás', ...PALETTE.gray,  icon:'maybe' },
};
const PRIORITY = {
  alta:  { label:'Alta',  bars:3, ...PALETTE.coral },
  media: { label:'Media', bars:2, ...PALETTE.amber },
  baja:  { label:'Baja',  bars:1, ...PALETTE.gray  },
};

function StatusIcon({ type, color, size=14 }) {
  const s = { width:size, height:size, display:'block', flexShrink:0 };
  if (type==='ring') return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.5" strokeDasharray="2.8 1.6"/>
    </svg>
  );
  if (type==='arrow') return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill={color} opacity="0.18"/>
      <path d="M4 7.2l2 2L10 4.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (type==='check') return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill={color} opacity="0.2"/>
      <circle cx="7" cy="7" r="2.8" fill={color}/>
    </svg>
  );
  return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1" opacity="0.6"/>
      <text x="7" y="10.2" textAnchor="middle" fontSize="7.5" fill={color} opacity="0.7">?</text>
    </svg>
  );
}

function PriorityBars({ priority }) {
  const p = PRIORITY[priority] || PRIORITY.media;
  return (
    <div title={p.label} style={{display:'flex', gap:'2px', alignItems:'flex-end', flexShrink:0}}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width:'3px', height:i===1?'6px':i===2?'9px':'12px',
          borderRadius:'2px',
          background: i<=p.bars ? p.border : '#D3D1C7',
        }}/>
      ))}
    </div>
  );
}

function MiniArc({ pct, size=28 }) {
  const r=10, c=size/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#D3D1C7" strokeWidth="2"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#1D9E75" strokeWidth="2"
        strokeDasharray={`${circ*pct/100} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}/>
      <text x={c} y={c+3.5} textAnchor="middle" fontSize="7" fill="#5F5E5A" fontWeight="500">{pct}%</text>
    </svg>
  );
}
const CYCLE = ['necesito','comprado','tengo','quizas'];

const ROOMS0 = [
  // ═══ DORM. PRINCIPAL ═══
  { id:'d1', name:'Dorm. Principal', emoji:'🛏', desc:'3.40×3.38m · Vestidor · Terraza · Baño en suite', items:[
    // ─ COMPRADO (cama, ropa de cama, veladores) ─
    {id:genId(), name:'Cama Nest 2 Plazas Crudo',           qty:1, price:'640792', store:'Fabrics',     url:'', status:'comprado', priority:'alta',  notes:'187x210cm · Despacho 03/04/2026 · 6 cuotas s/interés $106.798', category:'Cama'},
    {id:genId(), name:'Colchón Hybrid Cool 2 Plazas',        qty:1, price:'552792', store:'Fabrics',     url:'', status:'comprado', priority:'alta',  notes:'150x200cm · Despacho programado · 6 cuotas s/interés $92.132', category:'Cama'},
    {id:genId(), name:'Sábanas 200 hilos Cobre 2P Blanco',   qty:2, price:'54995',  store:'Fabrics',     url:'', status:'comprado', priority:'alta',  notes:'Encimera + bajera + fundas · Total real $92.082 (20% desc. + despacho incluido)', category:'Cama'},
    {id:genId(), name:'Almohadas Fiber 50x70cm',             qty:2, price:'9990',   store:'Cannon Home', url:'', status:'comprado', priority:'media', notes:'Decorativas (para funda plumón) · Total con despacho $24.970 · 6 cuotas $4.162', category:'Cama'},
    {id:genId(), name:'Velador John Negro Form',             qty:2, price:'119900', store:'FORM',        url:'', status:'comprado', priority:'alta',  notes:'Madera + rattan · Entrega 5 días hábiles · Armado $12.000 c/u (pedir por separado)', category:'Muebles'},
    // ─ NECESITO / SELECCIONADO (Fabrics) ─
    {id:genId(), name:'Funda Plumón Frame 2P Crudo',         qty:1, price:'39195',  store:'Fabrics',     url:'https://fabrics.cl/products/funda-plumon-frame-2-plazas-crudo',                                               status:'necesito', priority:'alta',  notes:'240x240cm · Incluye 2 fundas almohada 50x70x20cm', category:'Cama'},
    {id:genId(), name:'Plumón Down Alternative 2P Blanco',   qty:1, price:'53755',  store:'Fabrics',     url:'https://fabrics.cl/products/plumon-down-alternative-2-plazas-blanco?variant=36543114870944',                  status:'necesito', priority:'alta',  notes:'240x240cm', category:'Cama'},
    {id:genId(), name:'Almohadas Cooling 50x70cm',           qty:2, price:'13916',  store:'Fabrics',     url:'https://fabrics.cl/products/almohada-cooling-50x70cm?variant=51898044842350',                                status:'necesito', priority:'alta',  notes:'', category:'Cama'},
    {id:genId(), name:'Manta Chunky Zigzag Marengo',         qty:1, price:'24075',  store:'Fabrics',     url:'https://fabrics.cl/products/manta-chunky-zigzag-marengo?variant=43526793822368',                             status:'necesito', priority:'media', notes:'', category:'Cama'},
    {id:genId(), name:'Cojín Lino amarras Emma Marengo',     qty:2, price:'10995',  store:'Fabrics',     url:'https://fabrics.cl/products/cojin-lino-30x50cm-marengo?variant=42616568152224',                              status:'necesito', priority:'media', notes:'', category:'Cama'},
    {id:genId(), name:'Lámpara de mesa negro/bambú',         qty:1, price:'8990',   store:'IKEA',        url:'https://www.ikea.com/cl/es/p/tvaerhand-lampara-de-mesa-negro-bambu-80523745/',                               status:'necesito', priority:'media', notes:'Para velador', category:'Iluminación'},
    {id:genId(), name:'Revestimiento Ripado Carvalo',        qty:3, price:'30184',  store:'MASISA',      url:'https://tienda.masisa.com/revestimiento-ripado-carvalo/p',                                                   status:'necesito', priority:'media', notes:'2480x218mm · $63.990/caja · Muro cabecera · ~3m²', category:'Revestimiento'},
    // ─ POR DECIDIR / SIN PRECIO ─
    {id:genId(), name:'Cortinas blackout',                   qty:1, price:'',       store:'',            url:'', status:'necesito', priority:'alta',  notes:'Medir ventana V11', category:'Textiles'},
    {id:genId(), name:'Espejo de cuerpo entero',             qty:1, price:'',       store:'',            url:'', status:'necesito', priority:'media', notes:'', category:'Accesorios'},
    {id:genId(), name:'Alfombra',                            qty:1, price:'',       store:'',            url:'', status:'quizas',   priority:'baja',  notes:'', category:'Textiles'},
    {id:genId(), name:'Cargador inalámbrico',                qty:1, price:'',       store:'',            url:'', status:'necesito', priority:'media', notes:'Para el velador', category:'Tecnología'},
    {id:genId(), name:'Cómoda / cajonera',                   qty:1, price:'',       store:'',            url:'', status:'quizas',   priority:'media', notes:'Depende del vestidor', category:'Muebles'},
    {id:genId(), name:'Ganchos de pared',                    qty:2, price:'',       store:'',            url:'', status:'necesito', priority:'baja',  notes:'', category:'Accesorios'},
  ]},
  // ═══ BAÑO PRINCIPAL ═══
  { id:'b1', name:'Baño Principal', emoji:'🚿', desc:'En suite · Dorm. 1', items:[
    // ─ SELECCIONADO (Fabrics + Terracota/Magna) ─
    {id:genId(), name:'Toalla sábana baño Cruda 600g',       qty:2, price:'18475',  store:'Fabrics',        url:'https://fabrics.cl/products/toalla-sabana-600g-beige',  status:'necesito', priority:'alta',  notes:'Falta aplicar 20% descuento BC', category:'Textiles'},
    {id:genId(), name:'Toalla mano Cruda 600g',              qty:2, price:'5593',   store:'Fabrics',        url:'https://fabrics.cl/products/toalla-mano-600g-crude',    status:'necesito', priority:'alta',  notes:'Falta aplicar 20% descuento BC', category:'Textiles'},
    {id:genId(), name:'Piso de baño',                        qty:1, price:'8395',   store:'Fabrics',        url:'',                                                      status:'necesito', priority:'media', notes:'', category:'Textiles'},
    {id:genId(), name:'Sujetador cepillo de dientes',        qty:1, price:'',       store:'Terracota/Magna',url:'',                                                      status:'necesito', priority:'media', notes:'Cerámica gres', category:'Accesorios'},
    {id:genId(), name:'Bandeja baño cerámica',               qty:1, price:'',       store:'Terracota/Magna',url:'',                                                      status:'necesito', priority:'media', notes:'Cerámica gres', category:'Accesorios'},
    {id:genId(), name:'Sujetador cepillos de pelo',          qty:1, price:'',       store:'Terracota/Magna',url:'',                                                      status:'necesito', priority:'media', notes:'Cerámica gres', category:'Accesorios'},
    // ─ POR DEFINIR ─
    {id:genId(), name:'Cortina de ducha',                    qty:1, price:'',       store:'',               url:'', status:'necesito', priority:'alta',  notes:'Con argollas', category:'Textiles'},
    {id:genId(), name:'Organizador de maquillaje',           qty:1, price:'',       store:'',               url:'', status:'necesito', priority:'alta',  notes:'', category:'Organización'},
    {id:genId(), name:'Espejo con luz',                      qty:1, price:'',       store:'',               url:'', status:'quizas',   priority:'media', notes:'Para maquillaje', category:'Accesorios'},
    {id:genId(), name:'Caddy de ducha',                      qty:1, price:'',       store:'',               url:'', status:'necesito', priority:'media', notes:'Para champú, acondicionador, etc.', category:'Organización'},
    {id:genId(), name:'Secador de pelo',                     qty:1, price:'',       store:'',               url:'', status:'quizas',   priority:'media', notes:'Verificar si ya tienes', category:'Tecnología'},
  ]},
  // ═══ DORM. 2 ═══
  { id:'d2', name:'Dorm. 2', emoji:'🛏', desc:'3.15×3.40m · Vestidor · Baño en suite', items:[
    {id:genId(), name:'Cama 1.5p / sofá cama',              qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'Uso dual: visitas + home office', category:'Muebles'},
    {id:genId(), name:'Escritorio',                         qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Muebles'},
    {id:genId(), name:'Silla ergonómica',                   qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Para home office', category:'Muebles'},
    {id:genId(), name:'Estantería / librero',               qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Muebles'},
    {id:genId(), name:'Ropa de cama visitas',               qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Textiles'},
    {id:genId(), name:'Cortinas',                          qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'Medir ventana', category:'Textiles'},
    {id:genId(), name:'Lámpara de escritorio',             qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Iluminación'},
  ]},
  // ═══ BAÑO 2 ═══
  { id:'b2', name:'Baño 2', emoji:'🛁', desc:'1.20×1.90m · En suite · Dorm. 2', items:[
    {id:genId(), name:'Toallas de baño',               qty:2, price:'',     store:'',            url:'', status:'necesito', priority:'alta',  notes:'', category:'Textiles'},
    {id:genId(), name:'Toalla de mano',                qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'', category:'Textiles'},
    {id:genId(), name:'Alfombra de baño',              qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'', category:'Textiles'},
    {id:genId(), name:'Cortina de ducha',              qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'alta',  notes:'Con argollas', category:'Textiles'},
    {id:genId(), name:'Set accesorios baño',           qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'Porta cepillo + jabonera + porta papel', category:'Accesorios'},
    {id:genId(), name:'Dispenser jabón líquido',       qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'', category:'Higiene'},
    {id:genId(), name:'Caddy de ducha',                qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'Para champú, acondicionador, etc.', category:'Organización'},
    {id:genId(), name:'Espejo',                        qty:1, price:'',     store:'',            url:'', status:'necesito', priority:'media', notes:'Revisar si viene instalado', category:'Accesorios'},
  ]},
  // ═══ BAÑO VISITAS ═══
  { id:'bv', name:'Baño Visitas', emoji:'🚽', desc:'1.46×1.27m · Medio baño', items:[
    {id:genId(), name:'Toalla de mano',                    qty:2, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Textiles'},
    {id:genId(), name:'Dispenser jabón líquido',           qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Higiene'},
    {id:genId(), name:'Set accesorios baño',               qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Accesorios'},
    {id:genId(), name:'Cestito de cortesía',               qty:1, price:'', store:'', url:'', status:'quizas',   priority:'baja',  notes:'Con productos para visitas', category:'Decoración'},
  ]},
  // ═══ LIVING COMEDOR ═══
  { id:'lc', name:'Living Comedor', emoji:'🛋', desc:'3.67×5.57m', items:[
    // ─ SELECCIONADO CON PRECIO ─
    {id:genId(), name:'Sofá Seccional Derecho (lino/algodón)',qty:1, price:'1190000', store:'Deco Arrayán', url:'https://www.instagram.com/decoarrayancl/?hl=es',                                          status:'necesito', priority:'alta',  notes:'230x90x180cm · Hecho a pedido · Posible descuento', category:'Muebles'},
    {id:genId(), name:'Aparador Vaho',                        qty:1, price:'359990',  store:'Pardecosas',   url:'https://www.pardecosas.cl/collections/muebles/products/aparador-vaho',                    status:'necesito', priority:'alta',  notes:'81×37.5×139cm', category:'Muebles'},
    {id:genId(), name:'Pouf Lazario Terra',                   qty:2, price:'129900',  store:'Amoblé',       url:'https://amoble.cl/pouf-lazario-terra-ppoupis0033.html',                                    status:'necesito', priority:'media', notes:'Retiro en tienda Vitacura · 3 cuotas s/interés $86.600', category:'Muebles'},
    {id:genId(), name:'Mueble Vinilos COMPO ABEDUL',          qty:1, price:'194990',  store:'Kallfü',       url:'https://www.tiendakallfu.cl/products/mueble-vinilos-115-compo-kallfu-cl',                  status:'necesito', priority:'media', notes:'115×45×75cm · 12 cuotas s/interés $16.249', category:'Ocio'},
    // ─ POR DEFINIR ─
    {id:genId(), name:'Mesa de centro',                       qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Muebles'},
    {id:genId(), name:'TV',                                   qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Min 50"', category:'Tecnología'},
    {id:genId(), name:'Mueble TV / rack',                     qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Muebles'},
    {id:genId(), name:'Mesa de comedor',                      qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Para 4–6 personas', category:'Muebles'},
    {id:genId(), name:'Sillas comedor',                       qty:4, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Muebles'},
    {id:genId(), name:'Alfombra living',                      qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'Zona sofá', category:'Textiles'},
    {id:genId(), name:'Lámpara colgante comedor',             qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'Sobre la mesa', category:'Iluminación'},
    {id:genId(), name:'Lámpara de pie',                       qty:1, price:'', store:'', url:'', status:'quizas',   priority:'baja',  notes:'Rincón del sofá', category:'Iluminación'},
    {id:genId(), name:'Cojines decorativos',                  qty:4, price:'', store:'', url:'', status:'quizas',   priority:'baja',  notes:'', category:'Decoración'},
    {id:genId(), name:'Plantas interiores',                   qty:3, price:'', store:'', url:'', status:'quizas',   priority:'baja',  notes:'', category:'Decoración'},
    {id:genId(), name:'Cuadros / arte',                       qty:2, price:'', store:'', url:'', status:'quizas',   priority:'baja',  notes:'', category:'Decoración'},
    {id:genId(), name:'Router WiFi',                          qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Contratar servicio de internet', category:'Tecnología'},
    {id:genId(), name:'Estantería biblioteca',                qty:1, price:'', store:'', url:'', status:'quizas',   priority:'media', notes:'', category:'Muebles'},
  ]},
  // ═══ COCINA ═══
  { id:'co', name:'Cocina', emoji:'🍳', desc:'1.80×6.15m · Larga · + Logia', items:[
    {id:genId(), name:'Frutero cerámica gres',             qty:1, price:'',   store:'Terracota/Magna', url:'', status:'necesito', priority:'media', notes:'Cerámica gres', category:'Accesorios'},
    {id:genId(), name:'Refrigerador',                      qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'No frost · medir espacio', category:'Electrodomésticos'},
    {id:genId(), name:'Microondas',                       qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Electrodomésticos'},
    {id:genId(), name:'Cafetera',                         qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'¿Cápsulas o espresso?', category:'Electrodomésticos'},
    {id:genId(), name:'Hervidor eléctrico',               qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Electrodomésticos'},
    {id:genId(), name:'Tostadora',                        qty:1, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Electrodomésticos'},
    {id:genId(), name:'Juguera / blender',                qty:1, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Electrodomésticos'},
    {id:genId(), name:'Lavadora',                         qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Carga frontal · medir logia', category:'Electrodomésticos'},
    {id:genId(), name:'Set de ollas',                     qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Al menos 3 tamaños', category:'Utensilios'},
    {id:genId(), name:'Sartenes antiadherentes',          qty:2, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'24cm + 28cm', category:'Utensilios'},
    {id:genId(), name:'Set de cuchillos',                 qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Utensilios'},
    {id:genId(), name:'Tablas de cortar',                 qty:2, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Una para carne + una para verduras', category:'Utensilios'},
    {id:genId(), name:'Utensilios de cocina',             qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Espátula, cuchara de palo, pinzas…', category:'Utensilios'},
    {id:genId(), name:'Colador / escurridor',             qty:1, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Utensilios'},
    {id:genId(), name:'Bowl para mezclar',                qty:2, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Utensilios'},
    {id:genId(), name:'Vajilla completa',                 qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Hondo + plano + postre ×6', category:'Vajilla'},
    {id:genId(), name:'Vasos',                            qty:6, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Vajilla'},
    {id:genId(), name:'Copas de vino',                    qty:4, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Vajilla'},
    {id:genId(), name:'Tazas',                            qty:4, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Vajilla'},
    {id:genId(), name:'Cubiertos',                        qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Set ×6', category:'Vajilla'},
    {id:genId(), name:'Contenedores herméticos',          qty:4, price:'',   store:'', url:'', status:'necesito', priority:'media', notes:'Para guardar comida', category:'Organización'},
    {id:genId(), name:'Botes de basura',                  qty:2, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'Orgánico + reciclaje', category:'Organización'},
    {id:genId(), name:'Organizadores cajones',            qty:1, price:'',   store:'', url:'', status:'quizas',   priority:'media', notes:'', category:'Organización'},
    {id:genId(), name:'Tendedero ropa (logia)',           qty:1, price:'',   store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Lavandería'},
  ]},
  // ═══ TERRAZA ═══
  { id:'te', name:'Terraza', emoji:'🌿', desc:'Acceso desde dorm. principal', items:[
    {id:genId(), name:'Mesa exterior',                    qty:1, price:'', store:'', url:'', status:'quizas', priority:'media', notes:'', category:'Muebles'},
    {id:genId(), name:'Sillas / sillones exterior',       qty:2, price:'', store:'', url:'', status:'quizas', priority:'media', notes:'', category:'Muebles'},
    {id:genId(), name:'Plantas terraza',                  qty:3, price:'', store:'', url:'', status:'quizas', priority:'baja',  notes:'', category:'Decoración'},
    {id:genId(), name:'Luces LED guirnalda',               qty:1, price:'', store:'', url:'', status:'quizas', priority:'baja',  notes:'', category:'Iluminación'},
    {id:genId(), name:'Alfombra exterior',                 qty:1, price:'', store:'', url:'', status:'quizas', priority:'baja',  notes:'', category:'Textiles'},
  ]},
  // ═══ ENTRADA ═══
  { id:'en', name:'Entrada', emoji:'🚪', desc:'Hall de acceso · 1.71×2.75m', items:[
    {id:genId(), name:'Arrimo Arrayán',                    qty:1, price:'200000', store:'Pardecosas', url:'https://www.pardecosas.cl/products/arrimo-arrayan', status:'necesito', priority:'alta', notes:'81×103×37.5cm · Consola / aparador entrada', category:'Muebles'},
    {id:genId(), name:'Zapatero',                         qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Muebles'},
    {id:genId(), name:'Perchero',                         qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Para abrigos y bolsos', category:'Muebles'},
    {id:genId(), name:'Espejo de entrada',                qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'Para el último chequeo antes de salir', category:'Accesorios'},
    {id:genId(), name:'Felpudo',                          qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Textiles'},
  ]},
  // ═══ GENERAL ═══
  { id:'gl', name:'General', emoji:'🧹', desc:'Para todo el depto', items:[
    {id:genId(), name:'Aspiradora',                       qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Robot o convencional', category:'Limpieza'},
    {id:genId(), name:'Trapeador / mopa',                  qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Limpieza'},
    {id:genId(), name:'Escoba + recogedor',                qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'', category:'Limpieza'},
    {id:genId(), name:'Kit productos de limpieza',         qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Multiuso, baño, lavavajillas', category:'Limpieza'},
    {id:genId(), name:'Botiquín básico',                   qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Ibuprofeno, gasas, curitas, termómetro…', category:'Salud'},
    {id:genId(), name:'Extinguidor PQS',                   qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Obligatorio tenerlo', category:'Seguridad'},
    {id:genId(), name:'Alargadores eléctricos',            qty:2, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Con protección, min 5 enchufes c/u', category:'General'},
    {id:genId(), name:'Herramientas básicas',              qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Destornilladores, martillo, nivel', category:'Herramientas'},
    {id:genId(), name:'Ampolletas de repuesto',            qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'LED · verificar tipo del depto', category:'General'},
    {id:genId(), name:'Papel higiénico (stock inicial)',   qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta',  notes:'Comprar antes de mudanza', category:'Higiene'},
    {id:genId(), name:'Servilletas / papel absorbente',    qty:1, price:'', store:'', url:'', status:'necesito', priority:'media', notes:'', category:'Higiene'},
    {id:genId(), name:'Pilas AA y AAA',                    qty:1, price:'', store:'', url:'', status:'necesito', priority:'baja',  notes:'Para controles y varios', category:'General'},
  ]},
  // ═══ BODEGA ═══
  { id:'bo', name:'Bodega', emoji:'📦', desc:'Almacenamiento extra', items:[
    {id:genId(), name:'Estantes metálicos',               qty:2, price:'', store:'', url:'', status:'quizas', priority:'media', notes:'', category:'Organización'},
    {id:genId(), name:'Cajas organizadoras con tapa',      qty:4, price:'', store:'', url:'', status:'quizas', priority:'baja',  notes:'Con etiqueta', category:'Organización'},
  ]},
];

const LBL = {fontSize:'11px', color:'#6B6963', display:'block', marginBottom:'4px'};

export default function App() {
  const [rooms, setRooms] = useState(null);
  const [roomId, setRoomId] = useState(ROOMS0[0].id);
  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [filt, setFilt] = useState('all');
  const [q, setQ] = useState('');
  const [boardMode, setBoardMode] = useState(false);
  const [modal, setModal] = useState(null); // null | 'export' | 'import'
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await Promise.resolve({value: localStorage.getItem('d504-v6')});
        setRooms(r?.value ? JSON.parse(r.value) : ROOMS0);
      } catch { setRooms(ROOMS0); }
    })();
  }, []);

  useEffect(() => {
    if (rooms) { try { localStorage.setItem('d504-v6', JSON.stringify(rooms)); } catch(e) {} }
  }, [rooms]);

  const room = useMemo(() => rooms?.find(r => r.id === roomId), [rooms, roomId]);

  const items = useMemo(() => {
    if (!room) return [];
    return room.items.filter(it =>
      (filt === 'all' || it.status === filt) &&
      (!q || it.name.toLowerCase().includes(q.toLowerCase()) || (it.notes||'').toLowerCase().includes(q.toLowerCase()))
    );
  }, [room, filt, q]);

  const stats = useMemo(() => {
    if (!rooms) return {total:0, done:0, pct:0, budget:0, spent:0};
    let total=0, done=0, budget=0, spent=0;
    rooms.forEach(r => r.items.forEach(it => {
      total++;
      const cost = (parseFloat(it.price)||0) * (parseInt(it.qty)||1);
      if (it.status==='tengo'||it.status==='comprado') { done++; spent+=cost; }
      else budget+=cost;
    }));
    return {total, done, pct:total?Math.round(done/total*100):0, budget, spent};
  }, [rooms]);

  function nav(id) { setRoomId(id); setView('list'); setEditItem(null); setFilt('all'); setQ(''); }

  function exportData() { setImportText(''); setModal('export'); setCopied(false); }

  function handleCopy() {
    const json = JSON.stringify(rooms, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(()=>setCopied(false), 2500); });
    } else {
      const ta = document.getElementById('export-ta');
      if (ta) { ta.select(); document.execCommand('copy'); setCopied(true); setTimeout(()=>setCopied(false), 2500); }
    }
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(importText.trim());
      if (Array.isArray(parsed) && parsed[0]?.items) {
        setRooms(parsed);
        try { localStorage.setItem('d504-v6', JSON.stringify(parsed)); } catch(e) {}
        setModal(null); setImportText('');
      } else { alert('El texto no parece un inventario válido.'); }
    } catch { alert('JSON inválido — asegúrate de pegar el texto completo.'); }
  }

  function cycleStatus(itemId) {
    setRooms(prev => prev.map(r => ({
      ...r,
      items: r.items.map(it => it.id!==itemId ? it : {...it, status:CYCLE[(CYCLE.indexOf(it.status)+1)%CYCLE.length]})
    })));
  }

  function openAdd() {
    setEditItem({id:null, name:'', qty:1, price:'', store:'', url:'', status:'necesito', priority:'alta', notes:'', category:'', delivery:''});
    setView('form');
  }

  function saveItem(item) {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      if (item.id) return {...r, items:r.items.map(it => it.id===item.id ? item : it)};
      return {...r, items:[...r.items, {...item, id:genId()}]};
    }));
    setView('list'); setEditItem(null);
  }

  function delItem(id) {
    setRooms(prev => prev.map(r => r.id!==roomId ? r : {...r, items:r.items.filter(it=>it.id!==id)}));
    setView('list'); setEditItem(null);
  }

  if (!rooms) return <div style={{padding:'2rem', color:'#6B6963', fontSize:'14px'}}>Cargando inventario…</div>;

  const fmt = n => n ? `$${Math.round(n).toLocaleString('es-CL')}` : '—';
  const STAT_CARDS = [
    { l:'Progreso',   v:`${stats.pct}%`,          accent:'#1D9E75', lightBg:'#E1F5EE' },
    { l:'Listos',     v:`${stats.done}`,           accent:'#185FA5', lightBg:'#E6F1FB' },
    { l:'Por gastar', v:fmt(stats.budget),         accent:'#BA7517', lightBg:'#FAEEDA' },
    { l:'Gastado',    v:fmt(stats.spent),          accent:'#D85A30', lightBg:'#FAECE7' },
  ];

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}>
      {/* ─── HEADER ─── */}
      <div style={{padding:'1.25rem 1.25rem 1rem', borderBottom:'0.5px solid #E2DFD8'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem'}}>
          <div>
            <div style={{fontSize:'17px', fontWeight:500, letterSpacing:'-0.01em'}}>Depto 504</div>
            <div style={{fontSize:'11px', color:'#9B9891', marginTop:'1px'}}>Jardín del Este · Inventario mudanza</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <MiniArc pct={stats.pct} size={36}/>
            <button onClick={()=>setBoardMode(b=>!b)} style={{
              display:'flex', alignItems:'center', gap:'5px', padding:'5px 11px',
              borderRadius:'8px', cursor:'pointer', fontSize:'11px', fontWeight:500,
              border: boardMode ? '1.5px solid #1D9E75' : '1.5px solid #E2DFD8',
              background: boardMode ? '#E1F5EE' : 'none',
              color: boardMode ? '#0F6E56' : '#6B6963',
            }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{flexShrink:0}}>
                <rect x="0.5" y="0.5" width="4.5" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                <rect x="7.5" y="0.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                <rect x="0.5" y="10" width="4.5" height="2" rx="1" stroke="currentColor" strokeWidth="1.1"/>
              </svg>
              {boardMode ? 'Lista' : 'Tablero'}
            </button>
            <button onClick={exportData} style={{
              display:'flex', alignItems:'center', gap:'4px', padding:'5px 11px',
              borderRadius:'8px', cursor:'pointer', fontSize:'11px', fontWeight:500,
              border:'1.5px solid #E2DFD8', background:'none',
              color:'#6B6963',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}>
                <path d="M6 1v7M3.5 5.5L6 8l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Exportar
            </button>
            <button onClick={()=>{setImportText(''); setModal('import');}} style={{
              display:'flex', alignItems:'center', gap:'4px', padding:'5px 11px',
              borderRadius:'8px', cursor:'pointer', fontSize:'11px', fontWeight:500,
              border:'1.5px solid #E2DFD8', background:'none',
              color:'#6B6963',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}>
                <path d="M6 8V1M3.5 3.5L6 1l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Importar
            </button>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:'6px'}}>
          {STAT_CARDS.map(({l,v,accent,lightBg}) => (
            <div key={l} style={{borderRadius:'8px', padding:'0.625rem 0.75rem', background:lightBg, borderLeft:`2.5px solid ${accent}`}}>
              <div style={{fontSize:'9px', color:accent, fontWeight:500, marginBottom:'2px', textTransform:'uppercase', letterSpacing:'0.05em'}}>{l}</div>
              <div style={{fontSize:'15px', fontWeight:500, color:'#1A1916'}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ROOM TABS (hidden in board mode) ─── */}
      {!boardMode && (
        <div style={{display:'flex', overflowX:'auto', borderBottom:'0.5px solid #E2DFD8', scrollbarWidth:'none', paddingBottom:'0'}}>
          {rooms.map(r => {
            const done = r.items.filter(it=>it.status==='tengo'||it.status==='comprado').length;
            const pct = r.items.length ? Math.round(done/r.items.length*100) : 0;
            const active = r.id===roomId;
            return (
              <button key={r.id} onClick={()=>nav(r.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
                padding:'0.625rem 0.875rem', border:'none', cursor:'pointer', flexShrink:0,
                background: active ? '#FAEEDA' : 'none',
                borderBottom: active ? '2px solid #BA7517' : '2px solid transparent',
                borderTop: 'none', borderLeft:'none', borderRight:'none',
              }}>
                <span style={{fontSize:'14px', lineHeight:'1'}}>{r.emoji}</span>
                <span style={{fontSize:'10px', fontWeight:active?500:400, whiteSpace:'nowrap', color: active ? '#854F0B' : '#6B6963'}}>
                  {r.name.replace('Dorm.','Dorm')}
                </span>
                <div style={{display:'flex', gap:'1.5px'}}>
                  {r.items.slice(0,5).map((_,i)=>(
                    <div key={i} style={{width:'4px',height:'4px',borderRadius:'50%',background: i<Math.round(pct/100*Math.min(r.items.length,5)) ? '#1D9E75' : '#D3D1C7'}}/>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ─── CONTENT ─── */}
      {boardMode ? (
        <BoardView rooms={rooms} onCycle={cycleStatus} onEdit={it => { setRoomId(it.roomId); setEditItem({...it}); setView('form'); setBoardMode(false); }}/>
      ) : view==='form' && editItem ? (
        <ItemForm item={editItem} roomName={room?.name} onSave={saveItem} onDelete={delItem} onCancel={()=>{setView('list');setEditItem(null);}} />
      ) : (
        <RoomView room={room} items={items} filt={filt} q={q}
          onFilt={setFilt} onQ={setQ} onAdd={openAdd}
          onEdit={it=>{setEditItem({...it});setView('form');}}
          onCycle={cycleStatus}
        />
      )}

      {/* ─── MODALS ─── */}
      {modal && (
        <div onClick={()=>setModal(null)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1.5rem',
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'#FFFFFF',
            borderRadius:'12px', padding:'1.5rem', width:'100%', maxWidth:'480px',
            boxShadow:'0 8px 40px rgba(0,0,0,0.18)', display:'flex', flexDirection:'column', gap:'12px',
          }}>
            {modal === 'export' ? (<>
              <div style={{fontWeight:500, fontSize:'15px'}}>📋 Exportar inventario</div>
              <div style={{fontSize:'12px', color:'#6B6963', lineHeight:'1.5'}}>
                Copia todo el texto de abajo y guárdalo en un archivo de notas, documento o donde prefieras. La próxima vez usa <strong>Importar</strong> para restaurarlo.
              </div>
              <textarea id="export-ta" readOnly value={JSON.stringify(rooms, null, 2)}
                style={{width:'100%', boxSizing:'border-box', height:'180px', fontSize:'10px',
                  fontFamily:'monospace', resize:'none', borderRadius:'8px',
                  border:'1px solid #E2DFD8', padding:'8px', color:'#6B6963'}}/>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={handleCopy} style={{
                  flex:1, padding:'9px', fontWeight:500, fontSize:'13px', cursor:'pointer',
                  background: copied ? '#E1F5EE' : '#1A1916',
                  color: copied ? '#0F6E56' : '#FFFFFF',
                  border: copied ? '1.5px solid #1D9E75' : 'none',
                  borderRadius:'8px',
                }}>
                  {copied ? '✓ Copiado!' : 'Copiar al portapapeles'}
                </button>
                <button onClick={()=>setModal(null)} style={{padding:'9px 16px', fontSize:'13px', cursor:'pointer', borderRadius:'8px', border:'1px solid #E2DFD8', background:'none'}}>Cerrar</button>
              </div>
            </>) : (<>
              <div style={{fontWeight:500, fontSize:'15px'}}>📂 Importar inventario</div>
              <div style={{fontSize:'12px', color:'#6B6963', lineHeight:'1.5'}}>
                Pega acá el texto que copiaste antes con <strong>Exportar</strong>. Esto reemplazará el inventario actual.
              </div>
              <textarea value={importText} onChange={e=>setImportText(e.target.value)}
                placeholder='Pega el JSON aquí…'
                style={{width:'100%', boxSizing:'border-box', height:'180px', fontSize:'10px',
                  fontFamily:'monospace', resize:'none', borderRadius:'8px',
                  border:'1px solid #E2DFD8', padding:'8px'}}/>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={handleImport} disabled={!importText.trim()} style={{
                  flex:1, padding:'9px', fontWeight:500, fontSize:'13px', cursor:'pointer',
                  background:'#1A1916', color:'#FFFFFF',
                  border:'none', borderRadius:'8px',
                  opacity: importText.trim() ? 1 : 0.4,
                }}>Cargar inventario</button>
                <button onClick={()=>setModal(null)} style={{padding:'9px 16px', fontSize:'13px', cursor:'pointer', borderRadius:'8px', border:'1px solid #E2DFD8', background:'none'}}>Cancelar</button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

const FILTER_OPTS = [
  { k:'all',      l:'Todo',    icon:null },
  { k:'necesito', l:'Falta',   ...STATUS.necesito },
  { k:'comprado', l:'Pedido',  ...STATUS.comprado },
  { k:'tengo',    l:'Tengo',   ...STATUS.tengo    },
  { k:'quizas',   l:'Quizás',  ...STATUS.quizas   },
];

function RoomView({ room, items, filt, q, onFilt, onQ, onAdd, onEdit, onCycle }) {
  if (!room) return null;
  const done = room.items.filter(it=>it.status==='tengo'||it.status==='comprado').length;
  const pct = room.items.length ? Math.round(done/room.items.length*100) : 0;

  const grouped = useMemo(() => {
    if (q) return null;
    const g = {};
    items.forEach(it => {
      const c = it.category || 'Sin categoría';
      if (!g[c]) g[c] = [];
      g[c].push(it);
    });
    return g;
  }, [items, q]);

  return (
    <div style={{padding:'1rem 1.25rem'}}>
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.875rem'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <span style={{fontSize:'18px'}}>{room.emoji}</span>
            <span style={{fontSize:'15px', fontWeight:500}}>{room.name}</span>
            <span style={{fontSize:'11px', padding:'1px 7px', borderRadius:'10px', background:'#E1F5EE', color:'#0F6E56', fontWeight:500}}>{pct}%</span>
          </div>
          <div style={{fontSize:'11px', color:'#6B6963', marginTop:'3px', paddingLeft:'26px'}}>{room.desc}</div>
        </div>
        <button onClick={onAdd} style={{fontSize:'12px', padding:'5px 12px', flexShrink:0, background:'#FAEEDA', color:'#854F0B', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:500}}>+ ítem</button>
      </div>

      <input type="text" value={q} onChange={e=>onQ(e.target.value)}
        placeholder="Buscar en este espacio…"
        style={{width:'100%', boxSizing:'border-box', marginBottom:'10px', fontSize:'12px', height:'30px'}} />

      <div style={{display:'flex', gap:'5px', marginBottom:'1rem', flexWrap:'wrap'}}>
        {FILTER_OPTS.map(({k,l,icon,border,bg,text}) => {
          const active = filt===k;
          return (
            <button key={k} onClick={()=>onFilt(k)} style={{
              display:'flex', alignItems:'center', gap:'5px',
              fontSize:'11px', padding:'4px 10px', borderRadius:'12px', cursor:'pointer',
              border: active ? `1.5px solid ${border||'#1A1916'}` : '1.5px solid transparent',
              background: active ? (bg||'#1A1916') : '#F5F3EE',
              color: active ? (text||'#FFFFFF') : '#6B6963',
              fontWeight: active ? 500 : 400,
            }}>
              {icon && active && <StatusIcon type={icon} color={text} size={11}/>}
              {l}
            </button>
          );
        })}
      </div>

      {items.length===0 ? (
        <div style={{textAlign:'center', padding:'2.5rem', color:'#9B9891', fontSize:'13px'}}>
          {room.items.length===0 ? 'Espacio vacío — agrega el primer ítem.' : 'Sin resultados para este filtro.'}
        </div>
      ) : grouped ? (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat}>
            <div style={{display:'flex', alignItems:'center', gap:'6px', padding:'12px 0 5px'}}>
              <div style={{height:'1px', width:'8px', background:'#D3D1C7'}}/>
              <span style={{fontSize:'9px', fontWeight:500, color:'#888780', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap'}}>{cat}</span>
              <div style={{height:'1px', flex:1, background:'#D3D1C7'}}/>
            </div>
            {catItems.map(it => <ItemRow key={it.id} item={it} onEdit={()=>onEdit(it)} onCycle={()=>onCycle(it.id)} />)}
          </div>
        ))
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
          {items.map(it => <ItemRow key={it.id} item={it} onEdit={()=>onEdit(it)} onCycle={()=>onCycle(it.id)} />)}
        </div>
      )}
    </div>
  );
}

function ItemRow({ item, onEdit, onCycle }) {
  const s = STATUS[item.status]||STATUS.quizas;
  const cost = (parseFloat(item.price)||0)*(parseInt(item.qty)||1);

  return (
    <div style={{
      background:'#FFFFFF',
      border:`0.5px solid ${s.border}40`,
      borderLeft:`3px solid ${s.border}`,
      borderRadius:'10px',
      padding:'0.625rem 0.75rem',
      display:'flex', alignItems:'center', gap:'8px',
      marginBottom:'4px',
      transition:'border-color 0.2s',
    }}>
      <button onClick={onCycle} title="Clic para cambiar estado" style={{
        display:'flex', alignItems:'center', gap:'5px',
        padding:'3px 8px 3px 5px', borderRadius:'10px', cursor:'pointer', flexShrink:0,
        border:`1px solid ${s.border}60`,
        background:s.bg, color:s.text, whiteSpace:'nowrap', fontSize:'10px', fontWeight:500,
      }}>
        <StatusIcon type={s.icon} color={s.border} size={12}/>
        {s.short}
      </button>

      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:'13px', fontWeight:500, color:'#1A1916', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          {item.name}
          {item.qty>1 && <span style={{fontWeight:400, color:'#6B6963', fontSize:'12px'}}> ×{item.qty}</span>}
        </div>
        {(item.store||item.notes||cost>0||item.delivery) && (
          <div style={{fontSize:'11px', color:'#6B6963', marginTop:'1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            {[item.store, item.notes, cost>0?`$${Math.round(cost).toLocaleString('es-CL')}`:null, item.delivery ? `📦 ${new Date(item.delivery+'T12:00').toLocaleDateString('es-CL',{day:'numeric',month:'short'})}` : null].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>

      <PriorityBars priority={item.priority}/>

      {item.url && (
        <button onClick={()=>window.open(item.url,'_blank')} title="Ver en tienda (link)" style={{
          display:'flex', alignItems:'center', justifyContent:'center',
          width:'24px', height:'24px', border:'0.5px solid #E2DFD8',
          borderRadius:'50%', background:'none', cursor:'pointer', flexShrink:0, color:'#185FA5', fontSize:'11px',
        }}>↗</button>
      )}

      <button onClick={onEdit} style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        width:'24px', height:'24px', border:'0.5px solid #E2DFD8',
        borderRadius:'50%', background:'none', cursor:'pointer', flexShrink:0, color:'#6B6963',
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M8 1.5l1.5 1.5L3 9.5H1.5V8L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

function ItemForm({ item, roomName, onSave, onDelete, onCancel }) {
  const [f, setF] = useState({...item});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const cost = (parseFloat(f.price)||0)*(parseInt(f.qty)||1);

  function handleSave() {
    if (!f.name.trim()) return;
    onSave({...f, qty:parseInt(f.qty)||1});
  }

  return (
    <div style={{padding:'1.25rem'}}>
      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.25rem'}}>
        <button onClick={onCancel} style={{fontSize:'11px', padding:'4px 10px'}}>← Volver</button>
        <span style={{fontSize:'15px', fontWeight:500}}>{f.id?'Editar ítem':'Nuevo ítem'}</span>
        <span style={{fontSize:'12px', color:'#6B6963'}}>· {roomName}</span>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        <div>
          <label style={LBL}>Nombre *</label>
          <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="ej: Sofá de 3 plazas" style={{width:'100%',boxSizing:'border-box'}} />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          <div>
            <label style={LBL}>Cantidad</label>
            <input type="number" min="1" value={f.qty} onChange={e=>set('qty',e.target.value)} style={{width:'100%',boxSizing:'border-box'}} />
          </div>
          <div>
            <label style={LBL}>Precio unitario (CLP $)</label>
            <input type="number" min="0" value={f.price} onChange={e=>set('price',e.target.value)} placeholder="0" style={{width:'100%',boxSizing:'border-box'}} />
          </div>
        </div>

        {cost>0 && (
          <div style={{fontSize:'12px', textAlign:'right', color:'#6B6963'}}>
            Total: <strong style={{color:'#1A1916', fontSize:'14px'}}>${Math.round(cost).toLocaleString('es-CL')}</strong>
          </div>
        )}

        <div>
          <label style={LBL}>Tienda / Dónde comprar</label>
          <input value={f.store} onChange={e=>set('store',e.target.value)} placeholder="ej: Falabella, IKEA, Paris, Easy, MercadoLibre…" style={{width:'100%',boxSizing:'border-box'}} />
        </div>

        <div>
          <label style={LBL}>Link del producto (URL)</label>
          <input type="url" value={f.url} onChange={e=>set('url',e.target.value)} placeholder="https://…" style={{width:'100%',boxSizing:'border-box'}} />
        </div>

        <div>
          <label style={LBL}>Categoría</label>
          <input value={f.category} onChange={e=>set('category',e.target.value)} placeholder="ej: Muebles, Textiles, Electrodomésticos…" style={{width:'100%',boxSizing:'border-box'}} />
        </div>

        <div>
          <label style={LBL}>Fecha de entrega estimada</label>
          <input type="date" value={f.delivery||''} onChange={e=>set('delivery',e.target.value)} style={{width:'100%',boxSizing:'border-box'}} />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          <div>
            <label style={LBL}>Estado</label>
            <select value={f.status} onChange={e=>set('status',e.target.value)} style={{width:'100%',boxSizing:'border-box'}}>
              {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={LBL}>Prioridad</label>
            <select value={f.priority} onChange={e=>set('priority',e.target.value)} style={{width:'100%',boxSizing:'border-box'}}>
              {Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={LBL}>Notas</label>
          <textarea value={f.notes} onChange={e=>set('notes',e.target.value)} placeholder="Medidas, color, modelo, consideraciones…" rows={3} style={{width:'100%',boxSizing:'border-box',resize:'vertical'}} />
        </div>

        <div style={{display:'flex', gap:'8px', paddingTop:'4px'}}>
          <button onClick={handleSave} style={{flex:1, padding:'10px', fontWeight:500}}>
            {f.id ? 'Guardar cambios' : 'Agregar ítem'}
          </button>
          {f.id && (
            <button onClick={()=>onDelete(f.id)} style={{padding:'10px 16px', color:'#D85A30', border:'0.5px solid #E2DFD8', background:'none', borderRadius:'8px', cursor:'pointer'}}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BoardView({ rooms, onCycle, onEdit }) {
  const allItems = rooms.flatMap(r =>
    r.items.map(it => ({...it, roomId:r.id, roomName:r.name, roomEmoji:r.emoji}))
  );

  return (
    <div style={{padding:'1rem 1.25rem'}}>
      <div style={{fontSize:'11px', color:'#6B6963', marginBottom:'0.875rem'}}>
        Vista general · {allItems.length} ítems en {rooms.length} espacios · toca una card para editar
      </div>
      <div style={{display:'flex', gap:'10px', overflowX:'auto', alignItems:'flex-start', paddingBottom:'1rem'}}>
        {Object.entries(STATUS).map(([key, s]) => {
          const colItems = allItems.filter(it => it.status === key);
          return (
            <div key={key} style={{flex:'0 0 210px', display:'flex', flexDirection:'column', gap:'5px'}}>
              <div style={{
                display:'flex', alignItems:'center', gap:'6px',
                padding:'7px 10px', borderRadius:'8px',
                background:s.bg, border:`1px solid ${s.border}50`,
                marginBottom:'2px', position:'sticky', top:0,
              }}>
                <StatusIcon type={s.icon} color={s.border} size={13}/>
                <span style={{fontSize:'12px', fontWeight:500, color:s.text}}>{s.label}</span>
                <span style={{
                  marginLeft:'auto', fontSize:'11px', fontWeight:500,
                  background:s.border, color:'#fff', borderRadius:'10px',
                  padding:'0px 6px', lineHeight:'18px',
                }}>{colItems.length}</span>
              </div>
              {colItems.length === 0 && (
                <div style={{
                  border:`1px dashed ${s.border}50`, borderRadius:'10px',
                  padding:'1.5rem', textAlign:'center',
                  fontSize:'11px', color:s.text, opacity:0.5,
                }}>vacío</div>
              )}
              {colItems.map(it => (
                <BoardCard key={it.id} item={it} s={s} onCycle={()=>onCycle(it.id)} onEdit={()=>onEdit(it)}/>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoardCard({ item, s, onCycle, onEdit }) {
  const cost = (parseFloat(item.price)||0)*(parseInt(item.qty)||1);
  const delivLabel = item.delivery
    ? new Date(item.delivery+'T12:00').toLocaleDateString('es-CL',{day:'numeric',month:'short'})
    : null;

  return (
    <div onClick={onEdit} style={{
      background:'#FFFFFF',
      border:`0.5px solid ${s.border}35`,
      borderLeft:`3px solid ${s.border}`,
      borderRadius:'10px',
      padding:'0.625rem 0.75rem',
      cursor:'pointer',
    }}>
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'6px', marginBottom:'5px'}}>
        <span style={{fontSize:'12px', fontWeight:500, color:'#1A1916', lineHeight:'1.35', flex:1}}>
          {item.name}
          {item.qty>1 && <span style={{fontWeight:400, color:'#6B6963', fontSize:'11px'}}> ×{item.qty}</span>}
        </span>
        <PriorityBars priority={item.priority}/>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'6px'}}>
        <span style={{fontSize:'10px', padding:'1px 7px', borderRadius:'8px', background:'#F1EFE8', color:'#5F5E5A', whiteSpace:'nowrap'}}>
          {item.roomEmoji} {item.roomName}
        </span>
        {cost>0 && (
          <span style={{fontSize:'10px', color:'#6B6963', fontWeight:500}}>
            ${Math.round(cost).toLocaleString('es-CL')}
          </span>
        )}
        {delivLabel && (
          <span style={{fontSize:'10px', color:'#185FA5', background:'#E6F1FB', padding:'1px 6px', borderRadius:'8px', whiteSpace:'nowrap'}}>
            📦 {delivLabel}
          </span>
        )}
      </div>

      <button onClick={e=>{e.stopPropagation(); onCycle();}} style={{
        display:'flex', alignItems:'center', gap:'4px',
        padding:'2px 8px 2px 5px', borderRadius:'8px',
        border:`1px solid ${s.border}60`,
        background:s.bg, color:s.text,
        fontSize:'10px', cursor:'pointer', fontWeight:500,
      }}>
        <StatusIcon type={s.icon} color={s.border} size={10}/>
        {s.short}
        <span style={{opacity:0.5, fontSize:'9px', marginLeft:'1px'}}>→</span>
      </button>
    </div>
  );
}
