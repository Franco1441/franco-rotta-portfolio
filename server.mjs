import express from "express";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  profile as profileContent,
  projects as projectContent,
} from "./site-content.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 3000);

const profile = {
  name: profileContent.name,
  title: profileContent.title,
  location: profileContent.location,
  languageSummary: "Spanish (Native), English (B2)",
  spokenLanguages: ["Spanish (Native)", "English (B2)"],
  contact: {
    email: profileContent.email,
    github: profileContent.github,
    linkedin: profileContent.linkedin,
    contactPage: profileContent.contactPage,
  },
};

const projects = projectContent.map((project) => ({
  id: project.id,
  name: project.title,
  route: `/projects/${project.id}`,
  description: project.description,
  subtitle: project.subtitle,
  category: project.category,
  technologies: project.technologies.map((technology) => technology.name),
}));

const workHighlights = [
  {
    title: "Full Stack Developer - Freelance",
    period: "2024 - Present",
    summary:
      "Built product-focused client work across Tostadero Wellington, SEMO and Sancor, covering commerce flows, scheduling, integrations and internal tooling.",
  },
  {
    title: "Audiovisual Production & Streaming",
    period: "2021 - Present",
    summary:
      "Leads multicamera production, post-production and streaming support across Insert BIC, Insert Beat and Iglesia Brazos Abiertos.",
  },
];

const stackGroups = [
  {
    label: "Frontend",
    value: "React, Next.js, Vite, Tailwind CSS, Framer Motion",
  },
  {
    label: "Backend",
    value: "Node.js, Express, REST APIs, serverless functions, webhooks",
  },
  {
    label: "Data & Integrations",
    value: "PostgreSQL, Supabase, Mercado Pago, Twilio WhatsApp, Railway",
  },
  {
    label: "Automation & Tooling",
    value: "Codex, Claude, Netlify Functions, Git, GitHub, product operations",
  },
];

function json(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function getLastUserText(messages = []) {
  const reversed = [...messages].reverse();
  const userMessage = reversed.find((message) => message?.role === "user");

  if (!userMessage) return "";
  if (typeof userMessage.content === "string") return userMessage.content;

  if (Array.isArray(userMessage.parts)) {
    return userMessage.parts
      .filter((part) => part?.type === "text")
      .map((part) => part.text)
      .join(" ")
      .trim();
  }

  return "";
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function detectLanguage(text) {
  const normalized = normalizeText(text);
  const spanishSignals = [
    "que",
    "como",
    "donde",
    "quien",
    "proyectos",
    "experiencia",
    "contacto",
    "trabajo",
  ];
  const englishSignals = [
    "who",
    "what",
    "how",
    "where",
    "projects",
    "experience",
    "contact",
    "work",
  ];

  const spanishScore = spanishSignals.filter((word) => normalized.includes(word)).length;
  const englishScore = englishSignals.filter((word) => normalized.includes(word)).length;

  return englishScore > spanishScore ? "en" : "es";
}

function t(language, spanish, english) {
  return language === "en" ? english : spanish;
}

function formatProjects(language) {
  const heading = t(language, "Estos son sus proyectos destacados:", "These are his featured projects:");
  const list = projects
    .map((project) => `- **${project.name}**: ${project.description} (${project.route})`)
    .join("\n");
  return `${heading}\n${list}`;
}

function formatStack(language) {
  const heading = t(
    language,
    "El stack de Franco está orientado a construir productos web modernos:",
    "Franco's stack is centered on shipping modern web products:"
  );

  const groups = stackGroups.map((group) => `- ${group.label}: ${group.value}`).join("\n");
  return `${heading}\n${groups}`;
}

function buildAnswer(messageText) {
  const language = detectLanguage(messageText);
  const normalized = normalizeText(messageText);

  if (!normalized) {
    return t(
      language,
      "Preguntame sobre Franco: experiencia, stack, proyectos o contacto.",
      "Ask me about Franco: experience, stack, projects, or contact."
    );
  }

  if (/who is franco|quien es franco|quien es franco rotta/.test(normalized)) {
    return t(
      language,
      `${profile.name} es ${profile.title} en ${profile.location}. Tiene un perfil orientado a producto: construye aplicaciones web, integraciones y automatizaciones para clientes reales, y además combina desarrollo con producción audiovisual y streaming.`,
      `${profile.name} is a ${profile.title} based in ${profile.location}. He has a product-focused profile: he builds web applications, integrations and automations for real clients, and also combines development with audiovisual production and streaming.`
    );
  }

  if (/how much experience|experience does he have|experiencia|anos|años|trayectoria/.test(normalized)) {
    const summary = workHighlights
      .map((item) => `- ${item.title} (${item.period})`) 
      .join("\n");

    return t(
      language,
      `Franco tiene experiencia práctica en varios frentes.\n${summary}\nAdemás, ya tiene proyectos web publicados y orientados a producto.`,
      `Franco has hands-on experience across several tracks.\n${summary}\nHe has also shipped multiple product-focused web projects.`
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
        "Podés contactarlo de estas formas:",
        `- Email: ${profile.contact.email}`,
        `- GitHub: [Franco1441](${profile.contact.github})`,
        `- LinkedIn: [franco-rotta](${profile.contact.linkedin})`,
        `- Formulario del sitio: [Contacto](${profile.contact.contactPage})`,
      ].join("\n"),
      [
        "You can reach him here:",
        `- Email: ${profile.contact.email}`,
        `- GitHub: [Franco1441](${profile.contact.github})`,
        `- LinkedIn: [franco-rotta](${profile.contact.linkedin})`,
        `- Site form: [Contact](${profile.contact.contactPage})`,
      ].join("\n")
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
      "Tostadero Wellington es una plataforma de pedidos online con checkout, sincronización por webhook y operaciones internas de pedidos.",
      "Tostadero Wellington is an online ordering platform with checkout, webhook sync and internal order operations."
    );
  }

  if (/cotizador|santa fe/.test(normalized)) {
    return t(
      language,
      "Cotizador Santa Fe es un simulador de cotizaciones con flujo guiado, generación de PDF y envío por email.",
      "Cotizador Santa Fe is a quote simulator with a guided flow, PDF generation and email delivery."
    );
  }

  if (/semo|turnero|appointments|scheduling|whatsapp/.test(normalized)) {
    return t(
      language,
      "Turnero SEMO es un sistema de turnos con automatización por WhatsApp, roles de acceso y lógica operativa de agenda.",
      "Turnero SEMO is an appointment system with WhatsApp automation, role-based access and scheduling logic."
    );
  }

  if (/melany/.test(normalized)) {
    return t(
      language,
      "Melany Altare Portfolio es un portfolio creativo con dirección visual, transiciones y storytelling responsive.",
      "Melany Altare Portfolio is a creative portfolio with art direction, transitions and responsive storytelling."
    );
  }

  if (/brazos|iglesia|church|streaming/.test(normalized)) {
    return t(
      language,
      "Brazos Abiertos Web es un sitio institucional responsive. Además, Franco sigue colaborando en streaming y producción digital para la iglesia.",
      "Brazos Abiertos Web is a responsive institutional website. Franco also continues supporting church streaming and digital production."
    );
  }

  if (/insert|audiovis|rap|beat|bic|premiere|multi camera|multicamera/.test(normalized)) {
    return t(
      language,
      [
        "En audiovisual, Franco lideró la producción de Insert BIC e Insert Beat.",
        "- Planificó preproducción, cámaras, dirección, edición, color y sonido.",
        "- Coordinó equipos con 3 a 5 cámaras simultáneas en 4K/S-Log3.",
        "- Editó y entregó más de 50 piezas, muchas con tiempos de entrega menores a 24 horas.",
      ].join("\n"),
      [
        "On the audiovisual side, Franco led production for Insert BIC and Insert Beat.",
        "- He planned pre-production, camera setup, direction, editing, color and audio.",
        "- He coordinated teams working with 3 to 5 simultaneous cameras in 4K/S-Log3.",
        "- He edited and delivered 50+ pieces, often under 24-hour deadlines.",
      ].join("\n")
    );
  }

  return t(
    language,
    [
      "Puedo ayudarte con información sobre Franco en estos temas:",
      "- experiencia",
      "- stack y tecnologías",
      "- proyectos",
      "- contacto",
      "",
      'Probá con algo como: “¿Qué proyectos hizo?” o “¿Cómo puedo contactarlo?”.',
    ].join("\n"),
    [
      "I can help with Franco's profile in these areas:",
      "- experience",
      "- stack and technologies",
      "- projects",
      "- contact",
      "",
      'Try something like: "What projects has he built?" or "How can I contact him?"',
    ].join("\n")
  );
}

function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function splitIntoChunks(text, maxLength = 26) {
  const tokens = text.match(/\S+\s*/g) || [text];
  const chunks = [];
  let current = "";

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

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  writeSse(res, { type: "start", messageId });
  writeSse(res, { type: "text-start", id: textId });

  for (const chunk of splitIntoChunks(answer)) {
    writeSse(res, { type: "text-delta", id: textId, delta: chunk });
    await delay(18);
  }

  writeSse(res, { type: "text-end", id: textId });
  writeSse(res, { type: "finish" });
  res.write("data: [DONE]\n\n");
  res.end();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitContactMessage(payload) {
  const referer = "http://localhost:3000/contact/";

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(profile.contact.email)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
        Referer: referer,
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company,
        message: payload.message,
        _subject: "New portfolio contact request",
        _template: "table",
      }),
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    result = {
      success: false,
      message: "The contact service returned an unexpected response.",
    };
  }

  return {
    ok:
      response.ok &&
      (result.success === true ||
        /submitted successfully|message has been sent/i.test(result.message || "")),
    result,
  };
}

function isActivationMessage(message = "") {
  return /needs Activation|Activate Form|activated!/i.test(message);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveFilePath(pathname) {
  const cleanPath = decodeURIComponent(pathname.split("?")[0]);
  const relativePath = cleanPath.replace(/^\/+/, "");
  const exact = path.normalize(path.join(distDir, relativePath));

  if (!exact.startsWith(distDir)) {
    return null;
  }

  const candidates = [];

  if (!relativePath) {
    candidates.push(path.join(distDir, "index.html"));
  } else {
    candidates.push(exact);
    candidates.push(`${exact}.html`);
    candidates.push(path.join(exact, "index.html"));
  }

  for (const candidate of candidates) {
    if (candidate.startsWith(distDir) && (await fileExists(candidate))) {
      return candidate;
    }
  }

  return null;
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(distDir, { index: false }));

app.post("/api/chat", async (req, res) => {
  try {
    const lastUserText = getLastUserText(req.body?.messages);
    const answer = buildAnswer(lastUserText);
    await streamChatResponse(res, answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    json(res, 500, { success: false, message });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const payload = {
      name: String(req.body?.name || "").trim(),
      email: String(req.body?.email || "").trim(),
      company: String(req.body?.company || "").trim(),
      message: String(req.body?.message || "").trim(),
    };

    if (!payload.name) {
      json(res, 400, { success: false, message: "Name is required." });
      return;
    }

    if (!isValidEmail(payload.email)) {
      json(res, 400, {
        success: false,
        message: "Enter a valid email address.",
      });
      return;
    }

    if (payload.message.length < 15) {
      json(res, 400, {
        success: false,
        message: "Message should be at least 15 characters.",
      });
      return;
    }

    const { ok, result } = await submitContactMessage(payload);

    if (isActivationMessage(result.message)) {
      json(res, 200, {
        success: true,
        message:
          "Activation email sent to franco.rotta@hotmail.com. Open it once and the contact form will start delivering messages normally.",
      });
      return;
    }

    if (!ok) {
      json(res, 502, {
        success: false,
        message:
          result.message ||
          "The contact service could not process the message right now.",
      });
      return;
    }

    json(res, 200, {
      success: true,
      message:
        result.message ||
        "Thanks for reaching out. I will get back to you soon.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    json(res, 500, { success: false, message });
  }
});

app.use(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    json(res, 405, { success: false, message: "Method Not Allowed" });
    return;
  }

  const filePath = await resolveFilePath(req.path);

  if (!filePath) {
    if (!path.extname(req.path)) {
      res.sendFile(path.join(distDir, "index.html"));
      return;
    }

    json(res, 404, { success: false, message: "Not Found" });
    return;
  }

  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Portfolio mirror server running on http://localhost:${port}`);
});
