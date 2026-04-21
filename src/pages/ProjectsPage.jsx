import { Link } from 'react-router-dom';
import { projects, projectsPageCta } from '../../site-content.mjs';
import ProjectCard from '../components/ProjectCard';

export default function ProjectsPage() {
  return (
    <div className="page">
      <section className="section-heading">
        <span className="section-heading__eyebrow">Projects</span>
        <h1>Selected products, client builds, and launch-ready work.</h1>
        <p>
          A focused set of projects that represent Franco&apos;s product thinking, integration work,
          and frontend execution across different types of clients and use cases.
        </p>
      </section>

      <section className="projects-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>

      <section className="cta-panel">
        <div>
          <span className="section-heading__eyebrow">{projectsPageCta.title}</span>
          <h2>{projectsPageCta.description}</h2>
        </div>
        <Link className="button button--dark" to="/contact">
          {projectsPageCta.label}
        </Link>
      </section>
    </div>
  );
}
