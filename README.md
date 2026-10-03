# Banco Crecer · Banca digital

Portal de gestión de cartera con una interfaz adaptable en español. Migración del sitio original con Bootstrap y jQuery a React, TypeScript y Vite, con iconos de Lucide y un sistema visual propio.

## Ejecutar

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

## Funciones

- Resumen de saldos calculados desde la cartera y distribución por estado.
- Consulta de créditos y clientes con búsqueda sin distinción de acentos, filtros y ordenación.
- Detalle de crédito con monto, capital, saldo vencido, plazo, desembolso y mora.
- Exportación CSV de los resultados filtrados, compatible con Excel.
- Vista de reportes, preferencias para ocultar saldos y centro de ayuda.
- Navegación móvil, soporte para teclado y diálogos nativos con gestión de foco.

## Publicación

La compilación usa la base `/Banco-Crecer/`, siguiendo la [configuración de Vite para GitHub Pages](https://vite.dev/guide/static-deploy.html). En GitHub, seleccionar **Settings → Pages → Source → GitHub Actions**. El flujo valida, compila y publica automáticamente el contenido de `dist` cuando se modifica `master`.

## Alcance

Aplicación de demostración con registros ficticios. No es un sistema de banca transaccional y no ofrece autenticación real, pagos ni transferencias. Para operar con datos bancarios reales se necesita un backend, autorización por usuario, auditoría y persistencia protegida. No ingresar información personal en el repositorio público.

Proyecto original de Lisset Yataco Tasayco / [Analiza Jech](https://github.com/AnalizaJech).
