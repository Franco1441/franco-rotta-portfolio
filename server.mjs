import express from 'express';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  about,
  profile,
  projects,
  workExperience,
} from './site-content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;
const distDir = resolve(rootDir, 'dist');
const port = Number(process.env.PORT || 3000);
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV !== 'production';

const app = express();
app.use(express.json({ limit: '1mb' }));

function getLastUserText(messages = []) {
  const reversed = [...messages].reverse();
  const userMessage = reversed.find((message) => message?.role === 'user');

  if (!userMessage) return '';
  if (typeof userMessage.content === 'string') return userMessage.content;

  if (Array.isArray(userMessage.parts)) {
    return userMessage.parts
      .filter((part) => part?.type === 'text')
      .map((part) => part.text)
      .join(' ')
      .trim();
  }

  return '';
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function detectLanguage(text) {
  const normalized = normalizeText(text);
  const spanishSignals = ['que', 'como', 'donde', 'quien', 'proyectos', 'experiencia', 'contacto'];
  const englishSignals = ['who', 'what', 'how', 'where', 'projects', 'experience', 'contact'];

  const spanishScore = spanishSignals.filter((word) => normalized.includes(word)).length;
  const englishScore = englishSignals.filter((word) => normalized.includes(word)).length;

  return englishScore > spanishScore ? 'en' : 'es';
}

function t(language, spanish, english) {
  return language === 'en' ? english : spanish;
}

function formatProjects(language) {
  const heading = t(language, 'Estos son sus proyectos destacados:', 'These are his featured projects:');
  const list = projects
    .map((project) => `- **${project.title}**: ${project.description} (/projects/${project.id})`)
    .join('\n');
  return `${heading}\n${list}`;
}

function formatStack(language) {
  const heading = t(
    language,
    'El stack de Franco está orientado a construir productos web modernos:',
    "Franco's stack is centered on shipping modern web products:"
  );

  const groups = about.stackGroups.map((group) => `- ${group.label}: ${group.value}`).join('\n');
  return `${heading}\n${groups}`;
}

function buildAnswer(messageText) {
  const language = detectLanguage(messageText);
  const normalized = normalizeText(messageText);

  if (!normalized) {
    return t(
      language,
      'Preguntame sobre Franco: experiencia, stack, proyectos o contacto.',
      'Ask me about Franco: experience, stack, projects, or contact.'
    );
  }

  if (/who is franco|quien es franco|quien es franco rotta/.test(normalized)) {
    return t(
      language,
      `${profile.name} es ${profile.title} en ${profile.location}. Tiene un perfil muy hands-on: aprende enviando productos reales para clientes y comunidades, y combina desarrollo web con producción audiovisual y streaming.`,
      `${profile.name} is a ${profile.title} based in ${profile.location}. He has a hands-on profile: he learns by shipping real products for clients and communities, and combines web development with audiovisual production and streaming.`
    );
  }

  if (/how much experience|experience does he have|experiencia|anos|años|trayectoria/.test(normalized)) {
    const summary = workExperience
      .slice(0, 2)
      .map((item) => `- ${item.title} (${item.period})`)
      .join('\n');

    return t(
      language,
      `Franco tiene experiencia práctica en varios frentes.\n${summary}\nAdemás, ya tiene proyectos web publicados y orientados a producto.`,
      `Franco has hands-on experience across several tracks.\n${summary}\nOn top of that, he has already shipped multiple product-focused web projects.`
    );
  }

  if (/which languages does he speak|what languages does he speak|idiomas|english|ingles|b2/.test(normalized)) {
    return t(
      language,
      `Habla ${profile.languageSummary}.`,
      `He speaks ${profile.languageSummary}.`
    );
  }

  if (/contact|contacto|contactar|reach him|hire|github|linkedin|email/.test(normalized)) {
    return t(
      language,
      [
        'Podés contactarlo de estas formas:',
        `- Email: ${profile.email}`,
        `- GitHub: [Franco1441](${profile.github})`,
        `- LinkedIn: [franco-rotta](${profile.linkedin})`,
        `- Formulario del sitio: [Contacto](${profile.contactPage})`,
      ].join('\n'),
      [
        'You can reach him here:',
        `- Email: ${profile.email}`,
        `- GitHub: [Franco1441](${profile.github})`,
        `- LinkedIn: [franco-rotta](${profile.linkedin})`,
        `- Site form: [Contact](${profile.contactPage})`,
      ].join('\n')
    );
  }

  if (/project|proyecto|portfolio|trabajos/.test(normalized)) {
    return formatProjects(language);
  }

  if (/stack|tech|frontend|backend|typescript|react|tailwind|supabase|node/.test(normalized)) {
    return formatStack(language);
  }

  if (/tostadero|wellington/.test(normalized)) {
    return t(
      language,
      'Tostadero Wellington es su proyecto principal: una plataforma de pedidos online con checkout, páginas de estado de pago y gestión interna de pedidos.',
      'Tostadero Wellington is his main product: an online ordering platform with checkout, payment status pages, and internal order management.'
    );
  }

  if (/cotizador|santa fe/.test(normalized)) {
    return t(
      language,
      'Cotizador Santa Fe permite simular planes previsionales, generar cotizaciones PDF y enviar resultados por email.',
      'Cotizador Santa Fe lets users simulate retirement plans, generate PDF quotes, and send results by email.'
    );
  }

  if (/semo|turnero|appointments|scheduling/.test(normalized)) {
    return t(
      language,
      'Turnero SEMO es una plataforma de turnos con automatización por WhatsApp, roles y lógica operativa de agenda.',
      'Turnero SEMO is a scheduling platform with WhatsApp automation, role-based flows, and appointment logic.'
    );
  }

  if (/melany/.test(normalized)) {
    return t(
      language,
      'Melany Altare Portfolio es un portfolio one-page con identidad visual personalizada, transiciones y una presentación responsive cuidada.',
      'Melany Altare Portfolio is a one-page portfolio with a custom visual identity, transitions, and a polished responsive presentation.'
    );
  }

  if (/brazos|iglesia|church|streaming/.test(normalized)) {
    return t(
      language,
      'Brazos Abiertos Web es un sitio institucional responsive. Además, Franco sigue dando soporte de streaming y producción digital para la iglesia desde 2021.',
      'Brazos Abiertos Web is a responsive institutional website. Franco also continues supporting church streaming and digital production since 2021.'
    );
  }

  if (/insert|audiovis|rap|beat|bic|premiere|multi camera|multicamera/.test(normalized)) {
    return t(
      language,
      [
        'En audiovisual, Franco lideró la producción de Insert BIC e Insert Beat.',
        '- Planificó preproducción, cámaras, dirección, edición, color y sonido.',
        '- Coordinó equipos con 3 a 5 cámaras simultáneas en 4K/S-Log3.',
        '- Editó y entregó más de 50 piezas, muchas con tiempos de entrega menores a 24 horas.',
      ].join('\n'),
      [
        'On the audiovisual side, Franco led production for Insert BIC and Insert Beat.',
        '- He planned pre-production, camera setup, direction, editing, color, and audio.',
        '- He coordinated teams working with 3 to 5 simultaneous cameras in 4K/S-Log3.',
        '- He edited and delivered 50+ pieces, often under 24-hour deadlines.',
      ].join('\n')
    );
  }

  return t(
    language,
    [
      'Puedo ayudarte con información sobre Franco en estos temas:',
      '- experiencia',
      '- stack y tecnologías',
      '- proyectos',
      '- contacto',
      '',
      'Probá con algo como: “¿Qué proyectos hizo?” o “¿Cómo puedo contactarlo?”.',
    ].join('\n'),
    [
      "I can help with Franco's profile in these areas:",
      '- experience',
      '- stack and technologies',
      '- projects',
      '- contact',
      '',
      'Try something like: "What projects has he built?" or "How can I contact him?"',
    ].join('\n')
  );
}

function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function splitIntoChunks(text, maxLength = 26) {
  const tokens = text.match(/\S+\s*/g) || [text];
  const chunks = [];
  let current = '';

  for (const token of tokens) {
    if ((current + token).length > maxLength && current) {
      chunks.push(current);
      current = token;
    } else {
      current += token;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function delay(ms) {
  return new Promise((resolveDelay) => {
    setTimeout(resolveDelay, ms);
  });
}

async function streamChatResponse(res, answer) {
  const messageId = randomUUID();
  const textId = randomUUID();

  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();

  writeSse(res, { type: 'start', messageId });
  writeSse(res, { type: 'text-start', id: textId });

  for (const chunk of splitIntoChunks(answer)) {
    writeSse(res, { type: 'text-delta', id: textId, delta: chunk });
    await delay(18);
  }

  writeSse(res, { type: 'text-end', id: textId });
  writeSse(res, { type: 'finish' });
  res.write('data: [DONE]\n\n');
  res.end();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitContactMessage(payload) {
  const baseUrl = `http://localhost:${port}`;
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: baseUrl,
      Referer: `${baseUrl}/contact`,
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      company: payload.company,
      message: payload.message,
      _subject: 'New portfolio contact request',
      _template: 'table',
    }),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    result = {
      success: false,
      message: 'The contact service returned an unexpected response.',
    };
  }

  return {
    ok:
      response.ok &&
      (result.success === true ||
        /submitted successfully|message has been sent/i.test(result.message || '')),
    result,
  };
}

function isActivationMessage(message = '') {
  return /needs Activation|Activate Form|activated!/i.test(message);
}

app.post('/api/chat', async (req, res, next) => {
  try {
    const lastUserText = getLastUserText(req.body?.messages);
    const answer = buildAnswer(lastUserText);
    await streamChatResponse(res, answer);
  } catch (error) {
    next(error);
  }
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const payload = {
      name: String(req.body?.name || '').trim(),
      email: String(req.body?.email || '').trim(),
      company: String(req.body?.company || '').trim(),
      message: String(req.body?.message || '').trim(),
    };

    if (!payload.name) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }

    if (!isValidEmail(payload.email)) {
      res.status(400).json({ success: false, message: 'Enter a valid email address.' });
      return;
    }

    if (payload.message.length < 15) {
      res.status(400).json({ success: false, message: 'Message should be at least 15 characters.' });
      return;
    }

    const { ok, result } = await submitContactMessage(payload);

    if (isActivationMessage(result.message)) {
      res.status(200).json({
        success: true,
        message:
          'Activation email sent to franco.rotta@hotmail.com. Open it once and the contact form will start delivering messages normally.',
      });
      return;
    }

    if (!ok) {
      res.status(502).json({
        success: false,
        message:
          result.message || 'The contact service could not process the message right now.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message || 'Thanks for reaching out. I will get back to you soon.',
    });
  } catch (error) {
    next(error);
  }
});

async function startServer() {
  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      root: rootDir,
      appType: 'spa',
      server: { middlewareMode: true },
    });

    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        next();
        return;
      }

      try {
        const template = await readFile(resolve(rootDir, 'index.html'), 'utf8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  } else {
    app.use(express.static(distDir, { index: false }));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }

      res.sendFile(resolve(distDir, 'index.html'));
    });
  }

  app.use((error, _req, res, _next) => {
    const message = error instanceof Error ? error.message : 'Unexpected server error';

    if (!res.headersSent) {
      res.status(500).json({ success: false, message });
      return;
    }

    res.end();
  });

  app.listen(port, () => {
    const mode = isDev ? 'development' : 'production';
    console.log(`Portfolio server running in ${mode} mode on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
