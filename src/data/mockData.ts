export const TASA = 36.5;

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  costo: number;
  pvp: number;
  categoria: string;
  oferta: boolean;
}

export const productosMock: Producto[] = [
  { id: 1, codigo: 'P-001', nombre: 'Cemento Portland 50kg', stock: 120, costo: 5.5, pvp: 7.2, categoria: 'Construcción', oferta: true },
  { id: 2, codigo: 'P-002', nombre: 'Varilla Corrugada #4 (12m)', stock: 45, costo: 8.0, pvp: 10.5, categoria: 'Hierro', oferta: false },
  { id: 3, codigo: 'P-003', nombre: 'Pintura Latex Blanco 4L', stock: 78, costo: 12.0, pvp: 15.8, categoria: 'Pintura', oferta: false },
  { id: 4, codigo: 'P-004', nombre: 'Brocha 4" Profesional', stock: 32, costo: 2.8, pvp: 3.9, categoria: 'Pintura', oferta: true },
  { id: 5, codigo: 'P-005', nombre: 'Tubo PVC 1/2" x 3m', stock: 200, costo: 1.5, pvp: 2.1, categoria: 'Plomería', oferta: false },
  { id: 6, codigo: 'P-006', nombre: 'Alambre Galvanizado #16', stock: 15, costo: 18.0, pvp: 23.5, categoria: 'Hierro', oferta: false },
  { id: 7, codigo: 'P-007', nombre: 'Ladrillo Hueco 12x18x33', stock: 3000, costo: 0.25, pvp: 0.38, categoria: 'Construcción', oferta: false },
  { id: 8, codigo: 'P-008', nombre: 'Arena Fina por m³', stock: 80, costo: 8.0, pvp: 12.0, categoria: 'Construcción', oferta: false },
  { id: 9, codigo: 'P-009', nombre: 'Pintura Esmalte Rojo 1L', stock: 55, costo: 4.5, pvp: 6.2, categoria: 'Pintura', oferta: true },
  { id: 10, codigo: 'P-010', nombre: 'Codo PVC 1/2" 90°', stock: 150, costo: 0.25, pvp: 0.4, categoria: 'Plomería', oferta: false },
  { id: 11, codigo: 'P-011', nombre: 'Llave de Paso 1/2"', stock: 40, costo: 2.2, pvp: 3.5, categoria: 'Plomería', oferta: false },
  { id: 12, codigo: 'P-012', nombre: 'Martillo Carpintero 27mm', stock: 22, costo: 5.0, pvp: 7.8, categoria: 'Herramientas', oferta: true },
  { id: 13, codigo: 'P-013', nombre: 'Flexómetro 5m', stock: 60, costo: 2.5, pvp: 4.2, categoria: 'Herramientas', oferta: false },
  { id: 14, codigo: 'P-014', nombre: 'Tornillo Autoperforante 1" (100un)', stock: 85, costo: 3.0, pvp: 4.5, categoria: 'Ferretería', oferta: false },
  { id: 15, codigo: 'P-015', nombre: 'Lijas Multigrano Set 5uds', stock: 40, costo: 1.8, pvp: 2.9, categoria: 'Pintura', oferta: true },
];

export interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  totalGastado: number;
  ordenes: number;
  frecuencia: number;
}

export const clientesMock: Cliente[] = [
  { id: 1, nombre: 'Constructora del Norte', cedula: 'J-12345678-9', telefono: '0412-1112233', direccion: 'Av. Principal, Maturín', totalGastado: 12540, ordenes: 24, frecuencia: 12 },
  { id: 2, nombre: 'Ferretería La Esquina', cedula: 'J-87654321-0', telefono: '0414-2223344', direccion: 'Calle Bolívar, Maturín', totalGastado: 8320, ordenes: 18, frecuencia: 15 },
  { id: 3, nombre: 'Carlos Rodríguez', cedula: 'V-12345678', telefono: '0426-3334455', direccion: 'Urb. Los Olivos', totalGastado: 2150, ordenes: 8, frecuencia: 22 },
  { id: 4, nombre: 'Inversiones Sur C.A.', cedula: 'J-11223344-5', telefono: '0412-4445566', direccion: 'Zona Industrial', totalGastado: 18900, ordenes: 32, frecuencia: 9 },
  { id: 5, nombre: 'Grupo Constructor Alpha', cedula: 'J-55667788-1', telefono: '0416-5556677', direccion: 'Av. Bella Vista, Maturín', totalGastado: 34200, ordenes: 56, frecuencia: 8 },
  { id: 6, nombre: 'Materiales Delta 2020 C.A.', cedula: 'J-99887766-2', telefono: '0412-7778899', direccion: 'Zona Industrial Norte', totalGastado: 9870, ordenes: 21, frecuencia: 14 },
];

export interface Usuario {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  rol: 'Admin' | 'Vendedor' | 'Facturador' | 'Almacenista';
  semana: number;
  activo: boolean;
}

export const usuariosMock: Usuario[] = [
  { id: 1, nombre: 'María González', cedula: 'V-12345678', telefono: '0412-1111111', rol: 'Admin', semana: 2450, activo: true },
  { id: 2, nombre: 'José Pérez', cedula: 'V-87654321', telefono: '0414-2222222', rol: 'Vendedor', semana: 1890, activo: true },
  { id: 3, nombre: 'Ana Rodríguez', cedula: 'V-11223344', telefono: '0426-3333333', rol: 'Facturador', semana: 1200, activo: true },
  { id: 4, nombre: 'Luis Martínez', cedula: 'V-55667788', telefono: '0412-4444444', rol: 'Almacenista', semana: 0, activo: false },
];

export interface Pedido {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  metodo: string;
  estado: 'Completado' | 'Pendiente' | 'Por Entregar';
}

export const pedidosMock: Pedido[] = [
  { id: 1001, cliente: 'Constructora del Norte', fecha: 'Hoy 09:15', total: 450.5, metodo: 'Efectivo $', estado: 'Completado' },
  { id: 1002, cliente: 'Carlos Rodríguez', fecha: 'Hoy 10:42', total: 89.2, metodo: 'Pago Móvil', estado: 'Pendiente' },
  { id: 1003, cliente: 'Ferretería La Esquina', fecha: 'Hoy 11:05', total: 1250.0, metodo: 'Transferencia', estado: 'Por Entregar' },
  { id: 1004, cliente: 'Inversiones Sur C.A.', fecha: 'Hoy 11:38', total: 2300.0, metodo: 'Efectivo $', estado: 'Completado' },
];

export interface Credito {
  id: number;
  clienteId: number;
  clienteNombre: string;
  clienteCedula: string;
  fecha: string;
  totalUsd: number;
  abonadoUsd: number;
  pendienteUsd: number;
}

export const creditosMock: Credito[] = [
  { id: 2051, clienteId: 1, clienteNombre: 'Constructora del Norte', clienteCedula: 'J-12345678-9', fecha: '2026-05-15 09:30', totalUsd: 2450.0, abonadoUsd: 1200.0, pendienteUsd: 1250.0 },
  { id: 2063, clienteId: 3, clienteNombre: 'Carlos Rodríguez', clienteCedula: 'V-12345678', fecha: '2026-06-02 14:20', totalUsd: 890.5, abonadoUsd: 200.0, pendienteUsd: 690.5 },
  { id: 2072, clienteId: 4, clienteNombre: 'Inversiones Sur C.A.', clienteCedula: 'J-11223344-5', fecha: '2026-04-20 11:15', totalUsd: 3200.0, abonadoUsd: 2800.0, pendienteUsd: 400.0 },
  { id: 2081, clienteId: 2, clienteNombre: 'Ferretería La Esquina', clienteCedula: 'J-87654321-0', fecha: '2026-06-10 16:45', totalUsd: 1580.0, abonadoUsd: 0.0, pendienteUsd: 1580.0 },
  { id: 2095, clienteId: 5, clienteNombre: 'Grupo Constructor Alpha', clienteCedula: 'J-55667788-1', fecha: '2026-03-28 08:50', totalUsd: 5600.0, abonadoUsd: 4000.0, pendienteUsd: 1600.0 },
  { id: 2102, clienteId: 6, clienteNombre: 'Materiales Delta 2020 C.A.', clienteCedula: 'J-99887766-2', fecha: '2026-06-17 10:10', totalUsd: 720.0, abonadoUsd: 720.0, pendienteUsd: 0.0 },
];

export interface SaldoFavor {
  cedula: string;
  nombre: string;
  telefono: string;
  saldoUsd: number;
}

export const saldosFavorMock: SaldoFavor[] = [
  { cedula: 'V-12345678', nombre: 'Carlos Rodríguez', telefono: '0426-3334455', saldoUsd: 150.0 },
  { cedula: 'J-87654321-0', nombre: 'Ferretería La Esquina', telefono: '0414-2223344', saldoUsd: 320.0 },
  { cedula: 'J-11223344-5', nombre: 'Inversiones Sur C.A.', telefono: '0412-4445566', saldoUsd: 85.5 },
];

export const ventasChartData = [
  { dia: '01', monto: 1200 },
  { dia: '05', monto: 1900 },
  { dia: '10', monto: 1500 },
  { dia: '15', monto: 2400 },
  { dia: '20', monto: 2100 },
  { dia: '25', monto: 3200 },
  { dia: '30', monto: 2800 },
];

export interface FaqAI {
  icon: string;
  q: string;
  a: string;
}

export const faqsAI: { rol: string; preguntas: string[] }[] = [
  {
    rol: 'Admin',
    preguntas: [
      '¿Cuál es mi utilidad neta este mes?',
      'Productos con stock crítico',
      'Comparar ventas vs mes pasado',
      '¿Cuánto debo pagar en nómina?',
    ],
  },
  {
    rol: 'Vendedor',
    preguntas: [
      '¿Cómo crear una factura?',
      'Buscar cliente por cédula',
      'Aplicar descuento a un producto',
      'Ver mis ventas del día',
    ],
  },
  {
    rol: 'Facturador',
    preguntas: [
      'Procesar pedido pendiente',
      'Cambiar método de pago',
      'Generar nota de entrega',
      'Imprimir última factura',
    ],
  },
  {
    rol: 'Almacenista',
    preguntas: [
      'Registrar entrada de mercancía',
      'Hacer traslado entre almacenes',
      'Productos próximos a vencer',
      'Generar inventario físico',
    ],
  },
];

export const faqDataAI: Record<string, FaqAI[]> = {
  Admin: [
    { icon: 'building', q: '¿Cómo configuro los datos de mi empresa?', a: 'Para configurar los datos de tu empresa ve a **Ajustes → Configuración Empresa**. Allí podrás editar: nombre del negocio, RIF, dirección, teléfono y logo. Estos datos aparecen en facturas y reportes.' },
    { icon: 'users', q: '¿Cómo agrego un nuevo usuario?', a: 'Ve a **Personal → Usuarios** y haz clic en **Agregar Usuario**. Completa: nombre completo, teléfono (será su login), rol (admin, vendedor, facturador, almacenista) y contraseña inicial. El usuario podrá cambiar su contraseña después.' },
    { icon: 'chart-line', q: '¿Qué información muestra el dashboard?', a: 'El **Dashboard** principal muestra: balance del periodo con ingresos totales, ventas del día desglosadas por método de pago, indicadores rápidos (facturas por pagar, créditos a clientes, stock crítico), gráfico de ingresos de los últimos 30 días y acumulados históricos.' },
    { icon: 'calculator', q: '¿Cómo calculo la ganancia real de un producto?', a: 'Usa el **Simulador de Ganancia Neta Real** desde el dashboard. Ingresa precio de venta en USD, costo real en Bs y tasa de mercado actual. El simulador calcula la ganancia neta, el margen porcentual real y el diferencial cambiario.' },
    { icon: 'cash-register', q: '¿Cómo hago el cierre de caja diario?', a: 'El **Cierre de Caja** se encuentra en la sección de Ventas. Revisa que todas las ventas del día estén registradas, verifica los métodos de pago, confirma el cuadre entre sistema y físico, y genera el reporte de cierre. El sistema valida automáticamente los totales.' },
    { icon: 'key', q: '¿Cómo gestiono las licencias del sistema?', a: 'Las licencias se gestionan desde **Ajustes → Licencias**. Puedes ver vigencia de la licencia actual, renovar antes del vencimiento, ver historial de activaciones y contactar soporte si hay problemas de activación.' },
    { icon: 'brain', q: '¿Cómo configuro la API Key de Gemini?', a: 'Para usar la IA obtén una key gratuita en aistudio.google.com, ve a **Ajustes → Preferencias**, pega la API Key en el campo correspondiente y guarda los cambios. Sin API Key las preguntas frecuentes siguen disponibles.' },
    { icon: 'undo', q: '¿Cómo reinicio el sistema a valores de fábrica?', a: 'El **Factory Reset** se realiza desde **Ajustes → Mantenimiento**. ⚠️ Esta acción es irreversible y eliminará productos, historial de ventas, usuarios y configuraciones. Exporta respaldo antes de continuar.' },
    { icon: 'bell', q: '¿Cómo configuro las notificaciones del sistema?', a: 'Las notificaciones incluyen traslados pendientes de aprobación, ajustes de inventario por confirmar, compras por pagar vencidas y stock crítico. Se muestran automáticamente en el panel y en el menú lateral con un contador.' },
    { icon: 'dollar-sign', q: '¿Cómo actualizo la tasa del BCV?', a: 'Haz clic en el botón **Tasa** del dashboard, ingresa la nueva tasa oficial en Bs/USD y confirma. La tasa se usa para conversiones en facturas y reportes. Se recomienda actualizarla diariamente.' },
  ],
  Vendedor: [
    { icon: 'file-invoice', q: '¿Cómo creo una factura de venta?', a: 'Presiona **F3** o haz clic en **Nueva Factura**. Busca productos por código o nombre, selecciona cantidad, elige el método de pago y presiona **F8** para cobrar y emitir el ticket.' },
    { icon: 'percent', q: '¿Cómo aplico un descuento a una factura?', a: 'En la pantalla de facturación, antes de cobrar, usa el botón **Descuento** o presiona **F5**. Ingresa el porcentaje o monto fijo y confirma. El descuento se aplica al total general de la factura.' },
    { icon: 'hand-holding-usd', q: '¿Cómo divido un pago entre varios métodos?', a: 'Selecciona **Pago Dividido** al momento de cobrar. Puedes dividir entre efectivo + transferencia, punto + efectivo, pago móvil + transferencia y cualquier combinación. Ingresa los montos parciales; el sistema verifica que sumen el total.' },
    { icon: 'piggy-bank', q: '¿Cómo registro un abono a crédito?', a: 'Ve a **Notas → Créditos a Clientes**, busca la factura con saldo pendiente, haz clic en **Abonar**, ingresa el monto y el método de pago, y confirma. El saldo pendiente se actualiza automáticamente.' },
    { icon: 'search', q: '¿Cómo busco productos rápidamente?', a: 'Usa la barra de búsqueda en la pantalla de facturación. Escribe el código de barras o nombre del producto y presiona **Enter** para agregar directamente. También puedes escanear código de barras con la cámara.' },
    { icon: 'print', q: '¿Cómo imprimo el ticket de una venta?', a: 'Después de cobrar, el ticket se imprime automáticamente. Para reimprimir, ve a **Historial de Ventas**, busca la factura y haz clic en **Reimprimir**. Verifica que la impresora esté encendida y seleccionada.' },
    { icon: 'chart-simple', q: '¿Cómo veo mis ventas del día?', a: 'Tus ventas del día se muestran en el dashboard del vendedor: total vendido en USD y Bs, cantidad de tickets emitidos, métodos de pago usados y productos más vendidos.' },
    { icon: 'calendar-alt', q: '¿Cómo configuro un pago en cuotas?', a: 'Selecciona **Crédito** como método de pago, define el número de cuotas (3, 6, 12) y el sistema calcula automáticamente el monto por cuota. Se genera un plan de pagos con fechas de vencimiento.' },
    { icon: 'keyboard', q: '¿Cuáles son los atajos de teclado?', a: 'F3: buscar producto / nueva factura; F5: descuentos; F8: cobrar factura actual; F9: cambiar tipo de pago. Estos atajos aceleran el flujo de facturación diario.' },
    { icon: 'user-tie', q: '¿Qué es el POV del vendedor?', a: 'El **Punto de Venta** del vendedor es una vista simplificada para facturar rápido sin distracciones, ideal para días de alto flujo de clientes. Se activa desde el menú del vendedor.' },
  ],
  Facturador: [
    { icon: 'clipboard-list', q: '¿Cómo facturo un pedido ya creado?', a: 'Ve a **Pedidos Pendientes**, selecciona el pedido a facturar, revisa productos y cantidades, aplica descuentos si es necesario y presiona **Facturar** para emitir el comprobante.' },
    { icon: 'undo-alt', q: '¿Cómo hago una devolución o nota de crédito?', a: 'Busca la **factura original** en el historial, haz clic en **Nota de Crédito**, selecciona los productos a devolver y el sistema reintegra el stock automáticamente. El cliente recibe su reembolso según el método de pago original.' },
    { icon: 'print', q: '¿Cómo reimprimo una factura?', a: 'Ve a **Historial de Facturación**, busca por número de factura, cliente o fecha, haz clic en el ícono de **Imprimir** y selecciona ticket simple o factura completa. La reimpresión queda registrada.' },
    { icon: 'file-search', q: '¿Cómo busco una factura por número?', a: 'Usa el buscador de facturas en la sección de Facturación. Ingresa el número de factura y presiona **Enter**. También puedes buscar por nombre de cliente o fecha.' },
    { icon: 'shopping-cart', q: '¿Cómo creo un pedido desde facturación?', a: 'Presiona **F3** o **Nuevo Pedido**, agrega los productos con cantidad, selecciona el cliente y el pedido quedará **pendiente** hasta que se facture o confirme.' },
    { icon: 'credit-card', q: '¿Cómo creo una factura a crédito?', a: 'Al cobrar, selecciona **Crédito** como método de pago, define las cuotas o fecha de vencimiento, el cliente firma el comprobante y la factura aparece en **Créditos a Clientes** para seguimiento.' },
    { icon: 'money-bill-wave', q: '¿Qué métodos de pago están disponibles?', a: 'Efectivo (USD y Bs), punto de venta débito/crédito, transferencia bancaria, pago móvil, crédito con cuotas y pago dividido entre varios métodos.' },
    { icon: 'wallet', q: '¿Cómo consulto el saldo de crédito de un cliente?', a: 'Ve a **Notas → Créditos a Clientes**. Verás la lista de clientes con crédito activo, saldo pendiente, fecha de última cuota y días de mora si aplica.' },
    { icon: 'file-alt', q: '¿Cuál es la diferencia entre factura tipo A y B?', a: 'La **Factura Tipo A** lleva RIF del cliente y es válida para crédito fiscal (uso empresarial). La **Factura Tipo B** es consumidor final sin crédito fiscal y solo requiere nombre básico.' },
    { icon: 'camera', q: '¿Cómo uso la cámara para escanear productos?', a: 'En la pantalla de facturación haz clic en el ícono de cámara, permite el acceso, enfoca el código de barras del producto y el producto se agrega automáticamente a la factura. Funciona con códigos EAN-13 y UPC.' },
  ],
  Almacenista: [
    { icon: 'plus-circle', q: '¿Cómo agrego un producto nuevo al inventario?', a: 'Ve a **Inventario → Agregar Producto**. Completa nombre, código o código de barras, precio de compra, precio de venta, stock inicial, stock mínimo, categoría y proveedor. El producto aparecerá disponible en facturación inmediatamente.' },
    { icon: 'sliders-h', q: '¿Cómo hago un ajuste de inventario?', a: 'Ve a **Inventario → Ajuste de Stock**, busca el producto, ingresa la nueva cantidad o el ajuste (+/-) y agrega un motivo (merma, error de conteo, etc.). El ajuste queda pendiente de aprobación por admin.' },
    { icon: 'check-double', q: '¿Cómo apruebo una compra pendiente?', a: 'Las compras pendientes aparecen en el **Centro de Aprobaciones** del dashboard. Revisa proveedor, productos y montos, y haz clic en **Aprobar**. El stock se actualiza automáticamente.' },
    { icon: 'arrows-alt-v', q: '¿Cómo configuro el stock mínimo y máximo?', a: 'Al editar un producto en **Inventario** encontrarás los campos Stock Mínimo (cantidad antes de alertar reposición) y Stock Máximo (tope sugerido). Configúralos según la rotación del producto.' },
    { icon: 'exclamation-triangle', q: '¿Cómo veo los productos agotados?', a: 'Los productos agotados se muestran en el dashboard (tarjeta Stock Crítico), en **Inventario → Productos Agotados** y en el menú lateral con un contador. Desde allí puedes generar órdenes de reposición.' },
    { icon: 'edit', q: '¿Cómo edito precios en lote?', a: 'Ve a **Inventario → Edición Masiva**, selecciona productos por categoría o proveedor, define el nuevo precio o aplica un % de incremento/reducción y confirma. Útil para actualizaciones por inflación o promociones.' },
    { icon: 'tag', q: '¿Cómo creo una oferta o promoción?', a: 'Ve a **Inventario → Ofertas**, selecciona los productos, define el precio promocional o % de descuento y establece fecha de inicio y fin. Los productos aparecerán con etiqueta de oferta en facturación.' },
    { icon: 'chart-line', q: '¿Cómo calculo el precio de venta basado en el margen?', a: 'Precio de venta = Precio de compra ÷ (1 - margen deseado). Ejemplo: si compras en $10 y quieres 30% de margen, $10 ÷ (1 - 0.30) = $14.29. Puedes configurar el margen por defecto por categoría.' },
    { icon: 'barcode', q: '¿Cómo asigno un código de barras a un producto?', a: 'Edita el producto en **Inventario**, ingresa el número EAN-13 en el campo Código de Barras o deja que el sistema genere uno automáticamente. Luego podrás escanearlo al facturar.' },
    { icon: 'truck', q: '¿Cómo transfiero productos entre sucursales?', a: 'Ve a **Inventario → Generar Traslado**, selecciona la sucursal destino, agrega los productos y cantidades, y confirma. El stock se descuenta localmente y la otra sucursal recibe una notificación.' },
  ],
};
