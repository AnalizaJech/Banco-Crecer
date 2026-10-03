# Banco Crecer

Sitio institucional y experiencia de banca personal en español. React 19, TypeScript y Vite 8, con iconos de Lucide.

## Desarrollo

Requiere Node.js 22.14 o superior.

```sh
npm ci
npm run dev
```

Abrir la dirección que muestra Vite, con la ruta `/Banco-Crecer/`.

```sh
npm run build
npm run preview
```

## Experiencia

- Inicio institucional: seis productos, propuesta del banco, negocios y preguntas frecuentes.
- Apartados de canales digitales, seguridad y educación financiera.
- Simulador interactivo con monto, plazo, cuota y detalle del cálculo. TEA ficticia de 18 %, sin seguros ni comisiones.
- Acceso separado a una banca personal de demostración, sin solicitar credenciales.
- Perfil ficticio de Mariana Torres: crédito, saldo, pagos registrados y capital amortizado.
- Filtro por periodo y descarga CSV del estado de crédito.
- Banca personal con documentos y ayuda, además de productos, movimientos y detalle del crédito.
- Área de gestión con resumen, cartera, clientes y reportes. Búsqueda sin acentos, filtro por estado, ordenación y detalle completo.
- Alta y edición de créditos con persistencia en el navegador y validación de montos. Los cambios del crédito de Mariana se reflejan en su banca personal.
- Navegación superior única, menú móvil, diálogos nativos y soporte para teclado.
- Logo vectorial propio, favicon y sistema visual documentado en `DESIGN_SYSTEM.md`.

## Rutas

`#inicio`: sitio público. `#acceso`: acceso a la banca personal. `#banca`: banca personal después de entrar. `#gestion`: área administrativa. El enlace a gestión está en la barra superior, el acceso y el pie del sitio. Los enlaces de secciones funcionan con anclas. La sesión vive en memoria y se reinicia al recargar; no representa autenticación real.

Los registros de cartera se guardan en `localStorage` con la clave `crecer-portfolio-v1`. No se sincronizan con un servidor. La exportación CSV permite conservar una copia. No almacenar información personal real en esta aplicación; gestión es un área de muestra sin control de acceso.

## Publicación

La base de Vite es `/Banco-Crecer/`. GitHub Actions valida, compila y publica `dist` al modificar `master`. GitHub Pages usa **Source → GitHub Actions**.

## Alcance y recursos

Esta aplicación no es una entidad bancaria operativa. Los productos, datos, pagos y tasas son ejemplos; no ofrece apertura de cuentas, solicitudes, pagos ni transferencias reales. Para conectar datos reales se necesita un backend con autenticación, autorización, auditoría y persistencia protegida.

Fotografía institucional: [Unsplash, recurso original](https://images.unsplash.com/photo-1511895426328-dc8714191300), guardada localmente para evitar dependencia externa durante la carga. Tipografías DM Sans y Libre Caslon Display, a través de Google Fonts. Símbolo y logotipo propios en SVG.

Proyecto original de Lisset Yataco Tasayco / [Analiza Jech](https://github.com/AnalizaJech).
