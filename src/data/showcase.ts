export interface ShowcaseItem {
  img: string;
  n: string;
  t: string;
  d: string;
  chips: string[];
}

export const SHOWCASE_DATA: ShowcaseItem[] = [
  {img:"/Facturación Inteligente.png",n:"01 · Punto de Venta",t:"Facturación Inteligente",d:"Emite facturas, notas de entrega y presupuestos en segundos. Identifica clientes por cédula o RIF al instante. Tabla editable con precios, cantidades y subtotales en USD y Bs.",chips:["Nota de Entrega","Factura Fiscal","Presupuestos","Multi-método"]},
  {img:"/Dashboard Inteligente.png",n:"02 · Administración",t:"Dashboard Inteligente",d:"Ventas en tiempo real, control de gastos, nómina, KPI cards con sparklines y reportes financieros. Calcula tu utilidad neta pura al instante.",chips:["KPIs en vivo","Utilidad Neta","Nómina","Exportar Excel"]},
  {img:"/Control de Stock Total.png",n:"03 · Inventario",t:"Control de Stock Total",d:"Gestiona tu inventario con búsqueda inteligente, alertas de stock crítico (rojo), fotos por producto, y paginación. Precios en $ y Bs.",chips:["Alertas Stock","Proveedores","Carga Masiva","Fotos"]},
  {img:"/Vendedores + Roles.png",n:"04 · Personal",t:"Vendedores + Roles",d:"Perfiles individuales con control de acceso, historial por vendedor y cierre de caja automatizado. Estado online/offline en tiempo real.",chips:["Perfiles","Cierre de Caja","Comisiones","Online/Offline"]},
  {img:"/Clientes a Crédito.png",n:"05 · Créditos",t:"Clientes a Crédito",d:"Administra ventas a crédito con control de pagos, saldos pendientes y recordatorios automáticos. Estados: Pendiente, Al día, Vencido.",chips:["Ventas a Crédito","Abonos","Historial","Notificaciones"]},
  {img:"/HEXIA AI.png",n:"06 · Inteligencia Artificial",t:"HEXIA AI",d:"Asistente inteligente local que analiza tus ventas, responde preguntas y genera recomendaciones sin internet. Datos 100% seguros.",chips:["IA Local","Análisis","Reportes","Recomendaciones"]},
];
