import React, { useEffect, useState } from 'react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 8) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 transition-colors duration-300 ${
        scrolled ? 'bg-black' : 'bg-transparent'
      }`}
      id="header"
    >
      <nav className="p-5 flex justify-between items-center">
        <a
          href="#"
          className="font-montserrat font-semibold text-lg"
        >
          Globe Trekker
        </a>
        <div>
          <ul className="flex gap-8">
            <li>
              <a href="#home" className='hover:text-[var(--clr-text-light)]'>
                Home
              </a>
            </li>
            <li>
              <a href="#about" className='hover:text-[var(--clr-text-light)]'>
                About
              </a>
            </li>
            <li>
              <a href="#popular" className='hover:text-[var(--clr-text-light)]'>
                Popular
              </a>
            </li>
            <li>
              <a href="#explore" className='hover:text-[var(--clr-text-light)]'>
                Explore
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};