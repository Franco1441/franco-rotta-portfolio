import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { homeCards, projects } from '../../site-content.mjs';
import EyesOverlay from './EyesOverlay';

const aboutEyes = [
  { x: 0.48, y: 0.52, size: 22, radius: 4.5 },
  { x: 0.58, y: 0.56, size: 22, radius: 4.5 },
];

const marqueeProjects = [...projects, ...projects];

function ProjectTicker() {
  return (
    <div className="project-ticker">
      <div className="project-ticker__track">
        {marqueeProjects.map((project, index) => (
          <div key={`${project.id}-${index}`} className="project-ticker__icon">
            <img src={project.thumbnail} alt={project.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactBubbles() {
  return (
    <div className="contact-bubbles" aria-hidden="true">
      <span className="contact-bubbles__bubble contact-bubbles__bubble--green" />
      <span className="contact-bubbles__bubble contact-bubbles__bubble--blue" />
      <span className="contact-bubbles__bubble contact-bubbles__bubble--green" />
      <span className="contact-bubbles__bubble contact-bubbles__bubble--blue" />
    </div>
  );
}

function HomeCard({ title, description, href, className = '', children }) {
  return (
    <Link to={href} className={`home-card ${className}`.trim()}>
      <div className="home-card__content">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="home-card__visual">{children}</div>
    </Link>
  );
}

export default function HomeFeatureGrid() {
  const avatarRef = useRef(null);

  return (
    <section className="home-grid" aria-label="Portfolio sections">
      <HomeCard
        title={homeCards.about.title}
        description={homeCards.about.description}
        href={homeCards.about.href}
        className="home-card--about"
      >
        <div ref={avatarRef} className="avatar-split avatar-split--top">
          <img src="/finalincon.png" alt="Franco avatar" />
          <EyesOverlay containerRef={avatarRef} eyes={aboutEyes} />
        </div>
      </HomeCard>

      <HomeCard
        title={homeCards.work.title}
        description={homeCards.work.description}
        href={homeCards.work.href}
        className="home-card--work"
      >
        <div className="avatar-split avatar-split--bottom">
          <img src="/finalincon.png" alt="Franco avatar" />
        </div>
      </HomeCard>

      <HomeCard
        title={homeCards.projects.title}
        description={homeCards.projects.description}
        href={homeCards.projects.href}
        className="home-card--projects"
      >
        <ProjectTicker />
      </HomeCard>

      <HomeCard
        title={homeCards.contact.title}
        description={homeCards.contact.description}
        href={homeCards.contact.href}
        className="home-card--contact"
      >
        <ContactBubbles />
      </HomeCard>
    </section>
  );
}
