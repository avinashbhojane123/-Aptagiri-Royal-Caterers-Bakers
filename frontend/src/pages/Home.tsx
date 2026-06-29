import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroBanner } from '../components/home/HeroBanner';
import { CakeCategories } from '../components/home/CakeCategories';
import { Services } from '../components/home/Services';
import { Decorations } from '../components/home/Decorations';
import { Gallery } from '../components/home/Gallery';
import { About } from './About';
import { Contact } from './Contact';

export const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Find element by hash selector
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, [location]);

  return (
    <div>
      <div id="home">
        <HeroBanner />
      </div>
      <div id="cakes">
        <CakeCategories />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="decorations">
        <Decorations />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};
