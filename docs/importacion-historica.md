# Importación histórica de MandáTodo

Este repositorio conserva el trabajo colaborativo desarrollado en [Practicas-Pre-Profesionales-1-Grupo-9](https://github.com/Benjabb2005/Practicas-Pre-Profesionales-1-Grupo-9). La importación se presenta en PRs por etapas para facilitar su revisión. Las PRs de esta cuenta son registros nuevos de importación y enlazan a las PRs originales cuando existen; no reemplazan ni trasladan los registros originales.

Los commits fuente mantienen su autor y fecha. Las fechas de apertura de estas PRs corresponden a la publicación escalonada en Dinaitos. Se preservan los aportes de Benjamín Abbatiello, Sabrina Villano, Julián Ramos, Santiago Filipeli y Tomás Laruina.

## Calendario acordado

La primera etapa se abre el lunes 16 de noviembre de 2026 por pedido expreso. Desde entonces, se abre como máximo una PR por día y solo viernes, sábados y domingos, a las 17:17 hora de Buenos Aires. GitHub Actions usa 20:17 UTC; la ejecución puede retrasarse unos minutos por la cola de GitHub.

| Etapa | Fecha | Alcance fuente |
| --- | --- | --- |
| 01 | Lun 16 nov | Prototipo de acceso y gestión de pedidos (PR original #1) |
| 02 | Vie 20 nov | Perfil y rol en la barra lateral (#2) |
| 03 | Sáb 21 nov | Vista de chofer y paradas (#3) |
| 04 | Dom 22 nov | Validación y normalización de direcciones (#4) |
| 05 | Vie 27 nov | Georef, provincias y localidades (#5) |
| 06 | Sáb 28 nov | Clientes, pedidos y duplicados (#6) |
| 07 | Dom 29 nov | Geolocalización y confirmación (#7) |
| 08 | Vie 4 dic | Operación de entregas y chofer (#54) |
| 09 | Sáb 5 dic | Sugerencia de costo de envío (#55) |
| 10 | Dom 6 dic | Prueba cruzada documentada (#60) |
| 11 | Vie 11 dic | Previsualización de ubicación (#61) |
| 12 | Sáb 12 dic | Exportación y cálculo de envío (#62) |
| 13 | Dom 13 dic | Experiencia integrada MVP-1 (#64) |
| 14 | Vie 18 dic | Integración MVP-1 en `main` y ajuste final del mapa (#65) |

Las PRs intermedias se apilan sobre la etapa anterior para que cada diff muestre el cambio incremental. La etapa 14 apunta a `main` e integra el estado MVP-1 completo. Ningún merge se ejecuta automáticamente.

## Automatización

`.github/workflows/publish-next-historical-pr.yml` abre la siguiente etapa automáticamente viernes, sábado y domingo. La primera PR se crea por separado, a pedido del usuario. El flujo no publica en otros días, no reescribe autores o fechas y no hace merges. Si una ejecución falla, la etapa se reintenta en el siguiente día permitido.

GitHub debe permitir que Actions cree pull requests con `GITHUB_TOKEN` para que las aperturas programadas funcionen. La licencia de reutilización del proyecto no está especificada en el repositorio fuente.
