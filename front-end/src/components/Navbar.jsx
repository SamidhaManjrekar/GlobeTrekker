import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { navData, homeNavData } from "@/data/navData";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const currentLinks = location.pathname === "/" ? navData : homeNavData;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 32) {
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
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="p-3 px-10 flex justify-between items-center print:hidden">
          <a href="#" className="font-montserrat font-semibold text-lg">
            Globe Trekker
          </a>
          <div className="hidden md:flex">
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
                      className="transition-all hover:text-gold"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:hidden">
            <div
              className="cursor-pointer z-50" 
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X /> : <Menu />}
            </div>
          </div>
        </nav>
      </header>
      
      <div
        className={`fixed top-0 right-0 w-full h-full z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-500 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {open && (
          <ul className="flex flex-col gap-8 items-center ">
            {currentLinks.map((link, index) => (
              <li key={index}>
                {link.isButton ? (
                  <Link to={link.href}>
                    <Button
                      variant="gold"
                      onClick={() => setOpen(false)} 
                    >
                      {link.name}
                    </Button>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="transition-all hover:text-gold"
                    onClick={() => setOpen(false)} 
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};