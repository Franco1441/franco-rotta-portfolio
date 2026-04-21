import { Link } from 'react-router-dom';

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

export default function ProjectCard({ project, compact = false }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`project-card${compact ? ' project-card--compact' : ''}`}
      style={themeVars(project.theme)}
    >
      <div className="project-card__surface" />
      <div className="project-card__body">
        <div className="project-card__icon-wrap">
          <img src={project.thumbnail} alt={project.title} className="project-card__icon" />
        </div>

        <div className="project-card__copy">
          <div className="project-card__meta">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>

          {!compact && (
            <div className="project-card__chips">
              {project.technologies.slice(0, 4).map((technology) => (
                <span key={technology} className="project-chip">
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
