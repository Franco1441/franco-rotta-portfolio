# Franco Rotta | Portfolio

Portfolio personal de desarrollo web: proyectos, experiencia, stack y contacto.

**[Ver portfolio](https://portfolio-bay-phi-49.vercel.app)** · **[GitHub](https://github.com/Franco1441)** · **[LinkedIn](https://www.linkedin.com/in/franco-rotta)**

## Proyectos

- **PokéRadar:** Next.js, TypeScript, MapLibre, Three.js, TanStack Query, Vitest y Playwright. Exploración geoespacial, Safari 360° y comparación de expediciones.
- **Tostadero Wellington:** pedidos, carrito, checkout con Mercado Pago, webhooks y operaciones internas con Supabase.
- **Cotizador Santa Fe:** cotización guiada, validación, PDF y envío por correo.
- **SEMO:** turnos por WhatsApp, disponibilidad y administración con React, Node.js y PostgreSQL.
- **Brazos Abiertos y Melany Altare:** sitios institucionales y experiencias de portfolio.

## Desarrollo local

```sh
npm ci
npm run build
npm run dev
```

El sitio se sirve en `http://localhost:3000`. Para reaplicar contenido sin volver a preparar todos los recursos:

```sh
npm run sync:content
npm run sync:watch
```

## Editar contenido

- `site-content.mjs`: perfil, enlaces, proyectos y degradados de las tarjetas (`styles.background`).
- `career-content.mjs`: presentación, formación, habilidades y experiencia.
- `public/`: ilustraciones e iconos personales.
- `sync-site-content.mjs` y `sync-career-content.mjs`: generan las páginas y sincronizan el contenido con la navegación del cliente.
- `server.mjs`: preview, chat y endpoint de contacto.

`dist/` es un resultado generado. Los cambios de contenido deben hacerse en los archivos anteriores para que persistan al sincronizar.

## Publicación

Repositorio conectado a Vercel. Las actualizaciones se verifican localmente antes de publicarse. Los proyectos técnicos se identifican como tales, separados de la experiencia freelance.
