import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom"; 
import { navData, homeNavData } from "@/data/navData"; 

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); 
  const currentLinks = location.pathname === '/' ? navData : homeNavData;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 12) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
      }`}
      id="header"
    >
      <nav className="p-3 px-10 flex justify-between items-center">
        <a href="#" className="font-montserrat font-semibold text-lg">
          Globe Trekker
        </a>
        <div>
          <ul className="flex gap-8 items-center">
            {currentLinks.map((link, index) => (
              <li key={index}>
                {link.isButton ? (
                  <Link to={link.href}>
                    <Button variant="gold">{link.name}</Button>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="transition-all  hover:text-gold"
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};