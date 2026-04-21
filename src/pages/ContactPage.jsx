import { contactIntro, contactLinks } from '../../site-content.mjs';
import ContactForm from '../components/ContactForm';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.477 2 2 6.589 2 12.25c0 4.528 2.865 8.37 6.839 9.725.5.096.682-.223.682-.495 0-.245-.009-.893-.014-1.752-2.782.618-3.369-1.373-3.369-1.373-.455-1.18-1.11-1.495-1.11-1.495-.908-.638.069-.625.069-.625 1.004.072 1.532 1.056 1.532 1.056.893 1.566 2.341 1.114 2.91.852.091-.664.35-1.114.637-1.37-2.221-.259-4.555-1.137-4.555-5.063 0-1.119.389-2.034 1.029-2.751-.103-.26-.446-1.306.098-2.723 0 0 .84-.276 2.75 1.05A9.325 9.325 0 0 1 12 7.17c.85.004 1.706.117 2.505.343 1.91-1.326 2.748-1.05 2.748-1.05.546 1.417.203 2.463.1 2.723.64.717 1.027 1.632 1.027 2.751 0 3.936-2.338 4.801-4.566 5.055.359.319.679.947.679 1.909 0 1.378-.012 2.49-.012 2.829 0 .275.18.596.688.494C19.138 20.616 22 16.776 22 12.25 22 6.589 17.523 2 12 2Z"
      />
    </svg>
  );
}

function LinkIcon({ icon, label }) {
  if (icon === 'github') {
    return <GithubIcon />;
  }

  return <img src={icon} alt="" aria-hidden="true" />;
}

export default function ContactPage() {
  return (
    <div className="page page--contact">
      <section className="section-heading">
        <span className="section-heading__eyebrow">{contactIntro.eyebrow}</span>
        <h1>{contactIntro.title}</h1>
        <p>{contactIntro.body}</p>
      </section>

      <section className="contact-page-grid">
        <div className="contact-links-panel">
          <h2>Direct Links</h2>
          <div className="contact-links-list">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                className="contact-link"
              >
                <span className="contact-link__icon">
                  <LinkIcon icon={link.icon} label={link.label} />
                </span>
                <span>
                  <strong>{link.label}</strong>
                  <small>{link.href.replace('mailto:', '')}</small>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="contact-form-panel">
          <h2>Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
