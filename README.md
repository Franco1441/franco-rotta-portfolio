# Franco Rotta Portfolio Mirror

Este proyecto sigue teniendo una base de mirror estático del sitio original, pero ahora la personalización del contenido vive en archivos propios para no editar `dist/` a mano cada vez.

Snapshot local del sitio [franckpoingt.dev](https://www.franckpoingt.dev) para mantener el clon visual exacto.

## Flujo

1. `npm run mirror`
   Descarga otra vez las rutas y assets del sitio base hacia `dist/`.

2. `npm run sync:content`
   Reaplica el contenido de Franco sobre el mirror usando:
   - `site-content.mjs` como fuente central de datos y copy
   - `sync-site-content.mjs` como script de sincronización
   - `update-profile-content.mjs` como capa final de ajustes sobre el HTML y bundles espejados

3. `npm run dev`
   Levanta el sitio local con:
   - archivos estáticos desde `dist/`
   - `Ask FrancoGPT`
   - endpoint local para el formulario de contacto

## Comandos

- `npm run mirror`: vuelve a descargar rutas y assets desde el sitio online.
- `npm run sync:content`: reaplica el contenido local sobre el mirror.
- `npm run build`: ejecuta mirror + sync en un solo paso.
- `npm run dev`: levanta preview local en `http://localhost:3000`.
- `npm run start`: sirve el mismo preview estático y las APIs locales.

## Archivos clave

- `site-content.mjs`: perfil, hero, contacto y contenido de proyectos.
- `sync-site-content.mjs`: aplica el contenido al mirror compilado.
- `update-profile-content.mjs`: corrige texto, header y páginas estáticas del snapshot.
- `server.mjs`: sirve el sitio, el chat y el endpoint de contacto.
- `mirror-site.mjs`: vuelve a descargar el snapshot del sitio base.

## Nota importante

- El mirror genera archivos estáticos en `dist/`.
- Fecha de snapshot actual: `2026-04-15`.
- Como la base sigue siendo un build espejado, parte del trabajo todavía se aplica sobre bundles compilados.
- La mejora real de mantenibilidad en una siguiente etapa sería reconstruir esto con una estructura `src/` propia y un build controlado por nosotros, pero sin cambiar el diseño aprobado.
