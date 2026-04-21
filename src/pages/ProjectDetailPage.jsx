import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../../site-content.mjs';
import ProjectCard from '../components/ProjectCard';

function themeVars(theme) {
  return {
    '--project-from': theme.from,
    '--project-to': theme.to,
    '--project-text': theme.text,
    '--project-muted': theme.muted,
    '--project-title': theme.title,
    '--project-icon-surface': theme.iconSurface,
    '--project-chip': theme.chip,
  };
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const related = projects.filter((item) => item.id !== project.id).slice(0, 4);

  return (
    <div className="page">
      <Link to="/projects" className="back-link">
        ← Back to Projects
      </Link>

      <section className="project-detail-hero" style={themeVars(project.theme)}>
        <div className="project-detail-hero__icon-wrap">
          <img src={project.thumbnail} alt={project.title} className="project-detail-hero__icon" />
        </div>
        <div className="project-detail-hero__copy">
          <div className="project-detail-hero__meta">
            <span>{project.category}</span>
            <span>{project.year}</span>
            {project.users && <span>{project.users}</span>}
          </div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
      </section>

      <section className="project-detail-grid">
        <div className="project-detail-grid__main">
          <article>
            <h2>About</h2>
            <p className="body-copy">{project.longDescription}</p>
          </article>

          <article>
            <h2>Key Features</h2>
            <ul className="detail-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="project-sidebar">
          <article>
            <h3>Links</h3>
            <div className="project-sidebar__links">
              <a href={project.links.website} target="_blank" rel="noreferrer">
                Visit project
              </a>
              <a href={project.links.github} target="_blank" rel="noreferrer">
                View repository
              </a>
            </div>
          </article>

          <article>
            <h3>Tech</h3>
            <div className="project-card__chips project-card__chips--sidebar">
              {project.technologies.map((technology) => (
                <span key={technology} className="project-chip project-chip--dark">
                  {technology}
                </span>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section>
        <h2>More Projects</h2>
        <div className="related-projects">
          {related.map((item) => (
            <ProjectCard key={item.id} project={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
