# Identidad visual · Banco Crecer

## Dirección

Institucional, cercana y sobria. La página pública presenta la marca y los productos; la banca personal sirve al cliente. No se mezclan métricas de administración con información personal.

## Marca

Monograma C de trazos concéntricos, con una flecha ascendente en oro. Representa continuidad y crecimiento. Se acompaña de CRECER en mayúsculas y BANCO como descriptor. El SVG maestro está en `public/brand/logo.svg` y el isotipo en `public/favicon.svg`.

Mantener los trazos y proporciones. Usar azul sobre fondos claros o blanco sobre azul; el oro se conserva como acento. No usar el símbolo de hoja de la versión anterior.

## Tokens

| Uso                | Valor     |
| ------------------ | --------- |
| Azul institucional | `#122c3c` |
| Texto principal    | `#172d3a` |
| Oro discreto       | `#a48043` |
| Fondo cálido       | `#f5f3ee` |
| Texto secundario   | `#65737a` |
| Divisores          | `#e2e5e5` |

Libre Caslon Display para títulos institucionales; DM Sans para navegación, formularios y cifras. Los títulos de operaciones usan DM Sans para facilitar la consulta. El oro es un acento, no el color de párrafos ni botones principales.

## Composición

Contenedor máximo de 1240 px. Una navegación superior, sin sidebar. El inicio usa fotografía y bloques editoriales. Productos con bordes discretos; formularios y operaciones con espacios claros. Radios de 3–4 px y sombras mínimas. El contenido móvil cambia a una columna y mantiene el acceso visible.

## Interacción

Enfoque visible en teclado, etiquetas de campos, ventanas y acordeones con Radix UI, estados explícitos y movimiento reducido. Los desplegables, el deslizador y el calendario usan componentes React con estilos de la marca. Los errores de formularios aparecen dentro de la interfaz. No mostrar acciones de pagos o transferencias que no estén implementadas. Las condiciones de demostración se declaran en acceso, simulador y pie del sitio.
