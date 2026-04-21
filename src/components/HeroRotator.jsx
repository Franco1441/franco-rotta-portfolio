import { useEffect, useState } from 'react';

export default function HeroRotator({ titles }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % titles.length);
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, [titles.length]);

  return <span key={titles[index]} className="hero-rotator">{titles[index]}</span>;
}
