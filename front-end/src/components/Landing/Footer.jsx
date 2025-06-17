import React from "react";
import { Link } from "react-router-dom"; 

const Footer = () => {
  return (
    <footer className="p-4 mt-10 bg-[var(--clr-gold-dark)]">
      <div className="mx-auto">
        <div className="text-center">
          <Link to="/" className="font-montserrat font-semibold text-lg">
            Globe Trekker
          </Link>
          <p className="mt-1 text-sm">
            Explore the world with us. Your journey begins here.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;