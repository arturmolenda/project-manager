import React from 'react';
import Particles from 'react-particles-js';
const ParticlesBackground = ({ disableMove }) => {
  return (
    <Particles
      style={{
        background: 'rgb(35, 39, 65)',
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
      }}
      params={{
        particles: {
          number: {
            value: 200,
            density: {
              enable: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              speed: 4,
              size_min: 0.3,
            },
          },
          line_linked: {
            enable: false,
          },
          move: {
            enable: disableMove ? false : true,
            random: true,
            speed: 1,
            direction: 'top',
            out_mode: 'out',
          },
          opacity: {
            anim: {
              enable: disableMove ? false : true,
            },
            value: 0.4,
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: false,
            },
            onclick: {
              enable: false,
            },
          },
          modes: {
            enable: false,
            bubble: {
              enable: false,
              distance: 100,
              duration: 2,
              size: 0,
              opacity: 0,
            },
            repulse: {
              enable: false,
              distance: 250,
              duration: 4,
            },
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
