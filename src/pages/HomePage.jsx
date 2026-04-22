import { Link } from 'react-router-dom';
import { hero, profile } from '../../site-content.mjs';
import HeroRotator from '../components/HeroRotator';
import HomeFeatureGrid from '../components/HomeFeatureGrid';
import AskFrancoGPT from '../components/AskFrancoGPT';

export default function HomePage() {
  return (
    <div className="page page--home">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="hero-kicker">{profile.location}</span>
          <h1>{profile.name}</h1>
          <div className="home-hero__rotator-wrap">
            <HeroRotator titles={hero.rotatingTitles} />
          </div>
          <p>{hero.intro}</p>

          <div className="hero-actions">
            <Link className="button button--dark" to={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </Link>
            <Link className="button button--ghost" to={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <HomeFeatureGrid />
      <AskFrancoGPT />
    </div>
  );
}
