import { useState, useEffect, useMemo } from "react";

const genId = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4);

// ── Inject Google Fonts once ──────────────────────────────────────────────
const _link = document.createElement('link');
_link.rel = 'stylesheet';
_link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
document.head.appendChild(_link);

// ── Global styles ─────────────────────────────────────────────────────────
const _style = document.createElement('style');
_style.textContent = `
  * { box-sizing: border-box; }
  body { background: #F0EAD8; margin: 0; }
  input, select, textarea, button {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
  }
  input, select, textarea {
    background: #FAF7F2;
    border: 1px solid #D4CBBB;
    border-radius: 8px;
    padding: 8px 11px;
    color: #2C2B1F;
    width: 100%;
    transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #B5614A;
  }
  button {
    cursor: pointer;
  }
  ::-webkit-scrollbar { width: 0; height: 0; }
`;
document.head.appendChild(_style);

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  cream:      '#F0EAD8',
  surface:    '#FAF7F2',
  surfaceAlt: '#F5F0E8',
  terra:      '#B5614A',
  terraBg:    '#F5E5DE',
  terraDark:  '#8A4535',
  sage:       '#7A9E99',
  sageBg:     '#E4EDEB',
  sageDark:   '#4E7A76',
  gold:       '#B89A4A',
  goldBg:     '#F5EDD5',
  goldDark:   '#8A7030',
  meadow:     '#7A9060',
  meadowBg:   '#E8EFE0',
  meadowDark: '#4E6A3C',
  ink:        '#2C2B1F',
  inkMid:     '#6B6455',
  inkLight:   '#A09880',
  border:     '#D4CBBB',
  borderLight:'#E8E0D0',
  olive:      '#6F6C43',
};

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'DM Sans', system-ui, sans-serif";

// ── Status & Priority ─────────────────────────────────────────────────────
const STATUS = {
  necesito: { label:'Falta',  short:'Falta',  bg:C.terraBg,  border:C.terra,   text:C.terraDark,  icon:'ring'  },
  comprado: { label:'Listo',  short:'Listo',  bg:C.sageBg,   border:C.sage,    text:C.sageDark,   icon:'arrow' },
  tengo:    { label:'Tengo',  short:'Tengo',  bg:C.meadowBg, border:C.meadow,  text:C.meadowDark, icon:'check' },
  quizas:   { label:'Quizás', short:'Quizás', bg:C.goldBg,   border:C.gold,    text:C.goldDark,   icon:'maybe' },
};
const PRIORITY = {
  alta:  { label:'Alta',  bars:3, color:C.terra  },
  media: { label:'Media', bars:2, color:C.gold   },
  baja:  { label:'Baja',  bars:1, color:C.meadow },
};

function StatusIcon({ type, color, size=13 }) {
  const s = { width:size, height:size, display:'block', flexShrink:0 };
  if (type==='ring') return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.6" strokeDasharray="2.6 1.8"/>
    </svg>
  );
  if (type==='arrow') return (
    <svg style={s} viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" fill={color} opacity="0.2"/>
      <path d="M4 7.2l2 2L10 4.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1" opacity="0.5"/>
      <text x="7" y="10.5" textAnchor="middle" fontSize="7" fill={color}>?</text>
    </svg>
  );
}



function MiniProgress({ pct }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
      <div style={{flex:1, height:'3px', background:C.borderLight, borderRadius:'2px', overflow:'hidden'}}>
        <div style={{height:'100%', width:`${pct}%`, background:C.meadow, borderRadius:'2px', transition:'width 0.5s'}}/>
      </div>
      <span style={{fontSize:'11px', fontFamily:SANS, color:C.inkMid, flexShrink:0}}>{pct}%</span>
    </div>
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


// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [rooms, setRooms] = useState(null);
  const [roomId, setRoomId] = useState(ROOMS0[0].id);
  const [view, setView] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [filt, setFilt] = useState('all');
  const [q, setQ] = useState('');
  const [boardMode, setBoardMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('d504-v7');
      setRooms(saved ? JSON.parse(saved) : ROOMS0);
    } catch { setRooms(ROOMS0); }
  }, []);

  useEffect(() => {
    if (rooms) try { localStorage.setItem('d504-v7', JSON.stringify(rooms)); } catch(e) {}
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
      const cost = (parseFloat(it.price)||0)*(parseInt(it.qty)||1);
      if (it.status==='tengo'||it.status==='comprado') { done++; spent+=cost; }
      else budget+=cost;
    }));
    return {total, done, pct:total?Math.round(done/total*100):0, budget, spent};
  }, [rooms]);

  function nav(id) { setRoomId(id); setView('list'); setEditItem(null); setFilt('all'); setQ(''); }

  function cycleStatus(itemId) {
    setRooms(prev => prev.map(r => ({
      ...r,
      items: r.items.map(it => it.id!==itemId ? it : {...it, status:CYCLE[(CYCLE.indexOf(it.status)+1)%CYCLE.length]})
    })));
  }

  function openAdd() {
    // Pick the first existing category in this room as default
    const defaultCat = (room?.items||[]).reduce((acc, it) => {
      if (!acc && it.category) return it.category; return acc;
    }, '') || 'General';
    setEditItem({id:null, name:'', qty:1, price:'', store:'', url:'', medidas:'', status:'necesito', priority:'media', notes:'', category:defaultCat, delivery:'', imageUrl:''});
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



  if (!rooms) return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:C.cream, fontFamily:SERIF, color:C.inkMid, fontSize:'16px', fontStyle:'italic'}}>
      Cargando inventario…
    </div>
  );

  const fmt = n => n ? `$${Math.round(n).toLocaleString('es-CL')}` : '—';

  return (
    <div style={{fontFamily:SANS, background:C.cream, minHeight:'100vh', color:C.ink}}>

      {/* ── HEADER ── */}
      <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, padding:'1.5rem 1.5rem 1rem'}}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.25rem'}}>
          <div>
            <h1 style={{fontFamily:SERIF, fontSize:'26px', fontWeight:500, margin:'0 0 2px', letterSpacing:'-0.01em', color:C.ink}}>
              Depto 504
            </h1>
            <p style={{fontFamily:SANS, fontSize:'12px', color:C.inkLight, margin:0, letterSpacing:'0.04em', textTransform:'uppercase'}}>
              Jardín del Este · Inventario mudanza
            </p>
          </div>
          <div style={{display:'flex', gap:'6px', flexWrap:'wrap', justifyContent:'flex-end'}}>
            <HeaderBtn onClick={()=>setBoardMode(b=>!b)} active={boardMode} label={boardMode?'← Lista':'Tablero'} icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="0.5" y="0.5" width="4" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                <rect x="7" y="0.5" width="4" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.1"/>
                <rect x="7" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/>
              </svg>
            }/>

          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px', marginBottom:'1rem'}}>
          {[
            {l:'Progreso',   v:`${stats.pct}%`,    accent:C.meadow,  bg:C.meadowBg},
            {l:'Listos',     v:`${stats.done}`,     accent:C.sage,    bg:C.sageBg},
            {l:'Por gastar', v:fmt(stats.budget),   accent:C.terra,   bg:C.terraBg},
            {l:'Gastado',    v:fmt(stats.spent),    accent:C.gold,    bg:C.goldBg},
          ].map(({l,v,accent,bg}) => (
            <div key={l} style={{background:bg, borderRadius:'10px', padding:'10px 12px', borderTop:`2px solid ${accent}`}}>
              <div style={{
                fontFamily:SANS, fontSize:'9px', fontWeight:500, color:accent,
                textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'5px',
              }}>{l}</div>
              <div style={{
                fontFamily:SANS, fontSize:'18px', fontWeight:300, color:C.ink,
                letterSpacing:'-0.02em', lineHeight:1,
              }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <MiniProgress pct={stats.pct}/>
      </div>

      {/* ── ROOM TABS ── */}
      {!boardMode && (
        <div style={{background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', overflowX:'auto'}}>
          {rooms.map(r => {
            const done = r.items.filter(it=>it.status==='tengo'||it.status==='comprado').length;
            const pct = r.items.length ? Math.round(done/r.items.length*100) : 0;
            const active = r.id===roomId;
            return (
              <button key={r.id} onClick={()=>nav(r.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
                padding:'10px 14px', border:'none', background:'none', cursor:'pointer', flexShrink:0,
                borderBottom: active ? `2px solid ${C.terra}` : '2px solid transparent',
              }}>
                <span style={{fontSize:'15px'}}>{r.emoji}</span>
                <span style={{
                  fontSize:'10px', fontWeight:active?500:400, whiteSpace:'nowrap',
                  fontFamily:SANS,
                  color: active ? C.terra : C.inkMid,
                }}>{r.name}</span>
                <div style={{display:'flex', gap:'2px'}}>
                  {[...Array(Math.min(r.items.length,5))].map((_,i) => (
                    <div key={i} style={{width:'4px',height:'4px',borderRadius:'50%', background: i < Math.round(pct/100*Math.min(r.items.length,5)) ? C.meadow : C.borderLight}}/>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── CONTENT ── */}
      {boardMode ? (
        <BoardView rooms={rooms} onCycle={cycleStatus} onEdit={it=>{setRoomId(it.roomId);setEditItem({...it});setView('form');setBoardMode(false);}}/>
      ) : view==='form' && editItem ? (
        <ItemForm item={editItem} roomName={room?.name} roomItems={room?.items||[]} onSave={saveItem} onDelete={delItem} onCancel={()=>{setView('list');setEditItem(null);}}/>
      ) : (
        <RoomView room={room} items={items} filt={filt} q={q}
          onFilt={setFilt} onQ={setQ} onAdd={openAdd}
          onEdit={it=>{setEditItem({...it});setView('form');}}
          onCycle={cycleStatus}
        />
      )}


    </div>
  );
}

function HeaderBtn({ onClick, label, icon, active }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:'5px',
      padding:'6px 12px', borderRadius:'8px', fontFamily:SANS,
      fontSize:'11px', fontWeight:500,
      border: active ? `1.5px solid ${C.meadow}` : `1px solid ${C.border}`,
      background: active ? C.meadowBg : C.surface,
      color: active ? C.meadowDark : C.inkMid,
    }}>
      {icon}{label}
    </button>
  );
}

// ── FILTER OPTIONS ────────────────────────────────────────────────────────
const FILTER_OPTS = [
  {k:'all',      l:'Todo'},
  {k:'necesito', l:'Falta',  ...STATUS.necesito},
  {k:'comprado', l:'Listo',  ...STATUS.comprado},
  {k:'tengo',    l:'Tengo',  ...STATUS.tengo},
  {k:'quizas',   l:'Quizás', ...STATUS.quizas},
];

// ── ROOM VIEW ─────────────────────────────────────────────────────────────
function RoomView({ room, items, filt, q, onFilt, onQ, onAdd, onEdit, onCycle }) {
  if (!room) return null;
  const done = room.items.filter(it=>it.status==='tengo'||it.status==='comprado').length;
  const pct = room.items.length ? Math.round(done/room.items.length*100) : 0;

  const grouped = useMemo(() => {
    if (q) return null;
    const g = {};
    items.forEach(it => {
      const cat = it.category || 'General';
      if (!g[cat]) g[cat] = [];
      g[cat].push(it);
    });
    return g;
  }, [items, q]);

  return (
    <div style={{padding:'1.25rem 1.5rem'}}>
      {/* Room header */}
      <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <span style={{fontSize:'20px'}}>{room.emoji}</span>
            <h2 style={{fontFamily:SERIF, fontSize:'20px', fontWeight:500, margin:0, color:C.ink}}>{room.name}</h2>
            <span style={{
              fontSize:'10px', padding:'2px 8px', borderRadius:'10px',
              background:C.meadowBg, color:C.meadowDark, fontWeight:500, fontFamily:SANS,
            }}>{pct}%</span>
          </div>
          <p style={{fontFamily:SANS, fontSize:'11px', color:C.inkLight, margin:'3px 0 0 30px'}}>{room.desc}</p>
        </div>
        <button onClick={onAdd} style={{
          padding:'7px 14px', background:C.terra, color:'#fff',
          border:'none', borderRadius:'8px', fontFamily:SANS, fontSize:'12px', fontWeight:500,
          flexShrink:0,
        }}>+ Agregar</button>
      </div>

      {/* Search */}
      <input type="text" value={q} onChange={e=>onQ(e.target.value)}
        placeholder="Buscar en este espacio…"
        style={{marginBottom:'10px'}}/>

      {/* Filters */}
      <div style={{display:'flex', gap:'5px', marginBottom:'1.25rem', flexWrap:'wrap'}}>
        {FILTER_OPTS.map(({k,l,border,bg,text,icon}) => {
          const active = filt===k;
          return (
            <button key={k} onClick={()=>onFilt(k)} style={{
              display:'flex', alignItems:'center', gap:'5px',
              padding:'5px 11px', borderRadius:'20px', fontFamily:SANS,
              fontSize:'11px', fontWeight: active?500:400,
              border: active ? `1.5px solid ${border||C.ink}` : `1px solid ${C.borderLight}`,
              background: active ? (bg||C.ink) : 'transparent',
              color: active ? (text||'#fff') : C.inkMid,
            }}>
              {icon && active && <StatusIcon type={icon} color={text} size={11}/>}
              {l}
            </button>
          );
        })}
      </div>

      {/* Items */}
      {items.length===0 ? (
        <div style={{textAlign:'center', padding:'3rem', color:C.inkLight, fontFamily:SERIF, fontStyle:'italic', fontSize:'14px'}}>
          {room.items.length===0 ? 'Espacio vacío — agrega el primer ítem.' : 'Sin resultados.'}
        </div>
      ) : grouped ? (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} style={{marginBottom:'8px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'8px', padding:'14px 0 6px'}}>
              <span style={{fontSize:'9px', fontWeight:500, color:C.inkLight, textTransform:'uppercase', letterSpacing:'0.1em', whiteSpace:'nowrap', fontFamily:SANS}}>{cat}</span>
              <div style={{flex:1, height:'1px', background:C.borderLight}}/>
            </div>
            {catItems.map(it => <ItemRow key={it.id} item={it} onEdit={()=>onEdit(it)} onCycle={()=>onCycle(it.id)}/>)}
          </div>
        ))
      ) : (
        items.map(it => <ItemRow key={it.id} item={it} onEdit={()=>onEdit(it)} onCycle={()=>onCycle(it.id)}/>)
      )}
    </div>
  );
}

// ── ITEM ROW ──────────────────────────────────────────────────────────────
function ItemRow({ item, onEdit, onCycle }) {
  const s = STATUS[item.status]||STATUS.quizas;
  const cost = (parseFloat(item.price)||0)*(parseInt(item.qty)||1);
  const delivLabel = item.delivery ? new Date(item.delivery+'T12:00').toLocaleDateString('es-CL',{day:'numeric',month:'short'}) : null;

  return (
    <div style={{
      background:C.surface,
      border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${s.border}`,
      borderRadius:'10px', padding:'10px 12px',
      display:'flex', alignItems:'center', gap:'10px',
      marginBottom:'5px',
    }}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt="" style={{width:'38px',height:'38px',borderRadius:'6px',objectFit:'cover',flexShrink:0,border:`1px solid ${C.border}`}} onError={e=>e.target.style.display='none'}/>
      )}

      <button onClick={onCycle} style={{
        display:'flex', alignItems:'center', gap:'5px',
        padding:'3px 9px 3px 6px', borderRadius:'20px',
        border:`1px solid ${s.border}60`,
        background:s.bg, color:s.text,
        fontFamily:SANS, fontSize:'10px', fontWeight:500,
        flexShrink:0, whiteSpace:'nowrap',
      }}>
        <StatusIcon type={s.icon} color={s.border} size={11}/>
        {s.short}
      </button>

      <div style={{flex:1, minWidth:0}}>
        <div style={{fontFamily:SANS, fontSize:'13px', fontWeight:500, color:C.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          {item.name}
          {item.qty>1 && <span style={{fontWeight:400, color:C.inkLight, fontSize:'12px'}}> ×{item.qty}</span>}
        </div>
        {(item.store||cost>0||delivLabel||item.medidas) && (
          <div style={{fontFamily:SANS, fontSize:'11px', color:C.inkMid, marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
            {[item.store, item.medidas, cost>0?`$${Math.round(cost).toLocaleString('es-CL')}`:null, delivLabel?`📦 ${delivLabel}`:null].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>


      {item.url && (
        <button onClick={()=>window.open(item.url,'_blank')} title="Ver en tienda" style={{
          width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center',
          border:`1px solid ${C.border}`, borderRadius:'50%',
          background:'none', color:C.sage, fontSize:'12px', flexShrink:0,
        }}>↗</button>
      )}

      <button onClick={onEdit} style={{
        width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center',
        border:`1px solid ${C.border}`, borderRadius:'50%',
        background:'none', color:C.inkLight, flexShrink:0,
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── ITEM FORM ─────────────────────────────────────────────────────────────
const LBL = {fontFamily:SANS, fontSize:'11px', fontWeight:500, color:C.inkMid, display:'block', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.05em'};

function ItemForm({ item, roomName, roomItems, onSave, onDelete, onCancel }) {
  const [f, setF] = useState({...item});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const [newCat, setNewCat] = useState('');

  // Unique categories from this room, preserving order of first appearance
  const existingCats = useMemo(() => {
    const seen = new Set();
    const cats = [];
    (roomItems||[]).forEach(it => {
      const cat = it.category || 'General';
      if (!seen.has(cat)) { seen.add(cat); cats.push(cat); }
    });
    return cats;
  }, [roomItems]);
  const cost = (parseFloat(f.price)||0)*(parseInt(f.qty)||1);

  return (
    <div style={{padding:'1.5rem', background:C.cream, minHeight:'100vh'}}>
      {/* Back nav */}
      <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem'}}>
        <button onClick={onCancel} style={{
          padding:'6px 12px', background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:'8px', fontFamily:SANS, fontSize:'12px', color:C.inkMid,
        }}>← Volver</button>
        <div>
          <span style={{fontFamily:SERIF, fontSize:'18px', fontWeight:500, color:C.ink}}>
            {f.id ? 'Editar ítem' : 'Nuevo ítem'}
          </span>
          <span style={{fontFamily:SANS, fontSize:'12px', color:C.inkLight, marginLeft:'8px'}}>· {roomName}</span>
        </div>
      </div>

      <div style={{background:C.surface, borderRadius:'14px', padding:'1.5rem', border:`1px solid ${C.border}`}}>
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>

          {/* Name */}
          <div>
            <label style={LBL}>Nombre *</label>
            <input value={f.name} onChange={e=>set('name',e.target.value)}
              placeholder="ej: Sofá seccional" style={{fontSize:'14px', padding:'10px 12px'}}/>
          </div>

          {/* Qty + Price */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div>
              <label style={LBL}>Cantidad</label>
              <input type="number" min="1" value={f.qty} onChange={e=>set('qty',e.target.value)}/>
            </div>
            <div>
              <label style={LBL}>Precio unitario (CLP)</label>
              <input type="number" min="0" value={f.price} onChange={e=>set('price',e.target.value)} placeholder="0"/>
            </div>
          </div>

          {cost>0 && (
            <div style={{textAlign:'right', fontFamily:SANS, fontSize:'12px', color:C.inkMid}}>
              Total: <strong style={{fontFamily:SERIF, fontSize:'15px', color:C.ink}}>${Math.round(cost).toLocaleString('es-CL')}</strong>
            </div>
          )}

          {/* Medidas */}
          <div>
            <label style={LBL}>Medidas</label>
            <input value={f.medidas||''} onChange={e=>set('medidas',e.target.value)} placeholder="ej: 230×90×80cm"/>
          </div>

          {/* Store */}
          <div>
            <label style={LBL}>Tienda</label>
            <input value={f.store} onChange={e=>set('store',e.target.value)} placeholder="ej: Fabrics, Pardecosas, IKEA…"/>
          </div>

          {/* URL */}
          <div>
            <label style={LBL}>Link del producto</label>
            <input type="url" value={f.url} onChange={e=>set('url',e.target.value)} placeholder="https://…"/>
          </div>

          {/* Image URL */}
          <div>
            <label style={LBL}>Imagen del producto (URL)</label>
            <input type="url" value={f.imageUrl||''} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://… (pega link de la foto)"/>
            {f.imageUrl && <img src={f.imageUrl} alt="" style={{marginTop:'8px',width:'80px',height:'80px',objectFit:'cover',borderRadius:'8px',border:`1px solid ${C.border}`}} onError={e=>e.target.style.display='none'}/>}
          </div>

          {/* Delivery */}
          <div>
            <label style={LBL}>Fecha de entrega estimada</label>
            <input type="date" value={f.delivery||''} onChange={e=>set('delivery',e.target.value)}/>
          </div>

          {/* Status + Priority */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <div>
              <label style={LBL}>Estado</label>
              <select value={f.status} onChange={e=>set('status',e.target.value)}>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Prioridad</label>
              <select value={f.priority} onChange={e=>set('priority',e.target.value)}>
                {Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={LBL}>Categoría</label>
            {f.category === '__nueva__' ? (
              <div style={{display:'flex', gap:'8px'}}>
                <input
                  value={newCat}
                  onChange={e=>setNewCat(e.target.value)}
                  placeholder="Nombre de la nueva categoría…"
                  style={{flex:1}}
                  autoFocus
                />
                <button
                  onClick={()=>{ if(newCat.trim()){ set('category', newCat.trim()); setNewCat(''); } }}
                  style={{padding:'8px 14px', background:C.terra, color:'#fff', border:'none', borderRadius:'8px', fontFamily:SANS, fontSize:'12px', fontWeight:500, flexShrink:0}}
                >OK</button>
                <button
                  onClick={()=>set('category', existingCats[0]||'General')}
                  style={{padding:'8px 10px', background:'none', border:`1px solid ${C.border}`, borderRadius:'8px', fontFamily:SANS, fontSize:'12px', color:C.inkMid, flexShrink:0}}
                >✕</button>
              </div>
            ) : (
              <select value={f.category||existingCats[0]||'General'} onChange={e=>set('category', e.target.value)}>
                {existingCats.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value="__nueva__">+ Nueva categoría…</option>
              </select>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={LBL}>Notas</label>
            <textarea value={f.notes} onChange={e=>set('notes',e.target.value)}
              placeholder="Detalles, consideraciones, recordatorios…"
              rows={3} style={{resize:'vertical'}}/>
          </div>

          {/* Actions */}
          <div style={{display:'flex', gap:'8px', paddingTop:'4px'}}>
            <button onClick={()=>{
              if(!f.name.trim()) return;
              const finalCat = (f.category==='__nueva__'||!f.category) ? (existingCats[0]||'General') : f.category;
              onSave({...f, qty:parseInt(f.qty)||1, category:finalCat});
            }} style={{
              flex:1, padding:'11px', fontFamily:SANS, fontWeight:500, fontSize:'14px',
              background:C.terra, color:'#fff', border:'none', borderRadius:'10px',
            }}>
              {f.id ? 'Guardar cambios' : 'Agregar ítem'}
            </button>
            {f.id && (
              <button onClick={()=>onDelete(f.id)} style={{
                padding:'11px 16px', fontFamily:SANS, fontSize:'13px',
                background:'none', border:`1px solid ${C.border}`, borderRadius:'10px', color:C.terra,
              }}>Eliminar</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BOARD VIEW ────────────────────────────────────────────────────────────
function BoardView({ rooms, onCycle, onEdit }) {
  const allItems = rooms.flatMap(r => r.items.map(it=>({...it, roomId:r.id, roomName:r.name, roomEmoji:r.emoji})));

  return (
    <div style={{padding:'1.25rem 1.5rem'}}>
      <p style={{fontFamily:SANS, fontSize:'11px', color:C.inkLight, marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.05em'}}>
        Vista tablero · {allItems.length} ítems · toca para editar
      </p>
      <div style={{display:'flex', gap:'12px', overflowX:'auto', alignItems:'flex-start', paddingBottom:'1rem'}}>
        {Object.entries(STATUS).map(([key, s]) => {
          const col = allItems.filter(it=>it.status===key);
          return (
            <div key={key} style={{flex:'0 0 220px'}}>
              <div style={{
                display:'flex', alignItems:'center', gap:'7px',
                padding:'8px 12px', borderRadius:'10px',
                background:s.bg, border:`1px solid ${s.border}40`,
                marginBottom:'8px',
              }}>
                <StatusIcon type={s.icon} color={s.border} size={13}/>
                <span style={{fontFamily:SERIF, fontSize:'13px', fontWeight:500, color:s.text, flex:1}}>{s.label}</span>
                <span style={{fontFamily:SANS, fontSize:'11px', fontWeight:600, color:'#fff', background:s.border, borderRadius:'10px', padding:'1px 7px'}}>{col.length}</span>
              </div>
              {col.length===0 && (
                <div style={{border:`1px dashed ${s.border}50`, borderRadius:'10px', padding:'2rem', textAlign:'center', fontFamily:SERIF, fontStyle:'italic', fontSize:'12px', color:s.border, opacity:.6}}>vacío</div>
              )}
              {col.map(it => <BoardCard key={it.id} item={it} s={s} onCycle={()=>onCycle(it.id)} onEdit={()=>onEdit(it)}/>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoardCard({ item, s, onCycle, onEdit }) {
  const cost = (parseFloat(item.price)||0)*(parseInt(item.qty)||1);
  const delivLabel = item.delivery ? new Date(item.delivery+'T12:00').toLocaleDateString('es-CL',{day:'numeric',month:'short'}) : null;

  return (
    <div onClick={onEdit} style={{
      background:C.surface, border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${s.border}`, borderRadius:'10px',
      padding:'10px 12px', cursor:'pointer', marginBottom:'6px',
    }}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt="" style={{width:'100%',height:'90px',objectFit:'cover',borderRadius:'6px',marginBottom:'8px',border:`1px solid ${C.border}`}} onError={e=>e.target.style.display='none'}/>
      )}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6px', marginBottom:'6px'}}>
        <span style={{fontFamily:SANS, fontSize:'12px', fontWeight:500, color:C.ink, lineHeight:1.35, flex:1}}>
          {item.name}{item.qty>1&&<span style={{color:C.inkLight}}> ×{item.qty}</span>}
        </span>
      </div>
      <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'8px'}}>
        <span style={{fontFamily:SANS, fontSize:'10px', padding:'2px 7px', borderRadius:'8px', background:C.cream, color:C.inkMid}}>{item.roomEmoji} {item.roomName}</span>
        {cost>0 && <span style={{fontFamily:SANS, fontSize:'10px', color:C.inkMid, fontWeight:500}}>${Math.round(cost).toLocaleString('es-CL')}</span>}
        {delivLabel && <span style={{fontFamily:SANS, fontSize:'10px', padding:'2px 7px', borderRadius:'8px', background:C.sageBg, color:C.sageDark}}>📦 {delivLabel}</span>}
      </div>
      <button onClick={e=>{e.stopPropagation();onCycle();}} style={{
        display:'flex', alignItems:'center', gap:'5px',
        padding:'3px 9px 3px 6px', borderRadius:'20px',
        border:`1px solid ${s.border}50`, background:s.bg, color:s.text,
        fontFamily:SANS, fontSize:'10px', fontWeight:500,
      }}>
        <StatusIcon type={s.icon} color={s.border} size={10}/>
        {s.short} <span style={{opacity:.5}}>→</span>
      </button>
    </div>
  );
}
