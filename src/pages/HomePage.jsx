import { hero, profile } from '../../site-content.mjs';
import HeroRotator from '../components/HeroRotator';
import HomeFeatureGrid from '../components/HomeFeatureGrid';
import AskFrancoGPT from '../components/AskFrancoGPT';

export default function HomePage() {
  return (
    <div className="page page--home">
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>{profile.name}</h1>
          <div className="home-hero__rotator-wrap">
            <HeroRotator titles={hero.rotatingTitles} />
          </div>
        </div>
      </section>

      <HomeFeatureGrid />
      <AskFrancoGPT />
    </div>
  );
}
