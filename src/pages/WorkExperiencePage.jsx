import { workExperience } from '../../site-content.mjs';

export default function WorkExperiencePage() {
  return (
    <div className="page">
      <section className="section-heading">
        <span className="section-heading__eyebrow">Work Experience</span>
        <h1>Development roles, freelance delivery, and production leadership.</h1>
        <p>
          The work below prioritizes product building and operations-heavy execution, while also
          showing the delivery rigor Franco brings from audiovisual production.
        </p>
      </section>

      <div className="work-hero-art">
        <img src="/bitmoji.webp" alt="Franco avatar on laptop" />
      </div>

      <section className="timeline">
        {workExperience.map((experience) => (
          <article key={`${experience.title}-${experience.period}`} className="timeline-item">
            <div className="timeline-item__meta">{experience.period}</div>
            <div className="timeline-item__content">
              <h2>{experience.title}</h2>
              <ul className="detail-list">
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
