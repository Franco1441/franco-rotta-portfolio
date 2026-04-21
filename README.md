# Franco Rotta Portfolio

Portfolio rebuilt on a normal editable structure:
- `src/` for pages, components, and styles
- `public/` for images and static assets
- `site-content.mjs` as the single source of truth for profile data, projects, experience, and contact info
- `server.mjs` for the local API (`/api/chat`, `/api/contact`) and production serving

## Scripts

- `npm run dev`
  Starts the local development server with Vite and the backend endpoints on the same port.

- `npm run build`
  Builds the frontend into `dist/`.

- `npm run start`
  Serves the built site from `dist/` together with the chat and contact endpoints.

## Main Editing Points

- `site-content.mjs`
  Edit your name, links, hero copy, about text, work experience, and project content here.
  Project title colors are controlled per project in `theme.title`.

- `src/styles.css`
  Edit colors, typography, spacing, card appearance, and title colors here.
  Work Experience role titles are controlled by `.timeline-item__content h2`.

- `src/pages/*`
  Edit page structure if you want to rearrange sections.

- `src/components/*`
  Edit reusable UI like the home cards, chat panel, contact form, and project cards.

## Contact Form

The form posts to `/api/contact`, which forwards to FormSubmit using `franco.rotta@hotmail.com`.
If FormSubmit asks for activation on the first real submission, confirm it once from your email inbox and it will keep working normally.

## Notes

Legacy mirror scripts are still in the repository for reference, but the current app no longer depends on the mirrored build workflow.
