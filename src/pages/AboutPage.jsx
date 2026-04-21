import { about } from '../../site-content.mjs';

export default function AboutPage() {
  return (
    <div className="page page--narrow">
      <section className="section-heading">
        <span className="section-heading__eyebrow">About</span>
        <h1>Product-focused development with strong delivery discipline.</h1>
      </section>

      <section className="content-stack">
        {about.intro.map((paragraph) => (
          <p key={paragraph} className="body-copy">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="two-column-panel">
        <div>
          <h2>The Specs</h2>
          <ul className="detail-list">
            {about.specs.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Education</h2>
          <ul className="detail-list">
            {about.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <div className="stack-groups">
          {about.stackGroups.map((group) => (
            <article key={group.label} className="stack-group">
              <h3>{group.label}</h3>
              <p>{group.value}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
