import React from "react";
import { Navbar } from "../../components/Navbar";
import AboutSection from "../../components/Landing/About";
import Explore from "../../components/Landing/Explore";
import Footer from "../../components/Landing/Footer";
import HeroSection from "../../components/Landing/Hero";
import Join from "../../components/Landing/Join";
import Popular from "../../components/Landing/Popular";


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection/>
      <AboutSection/>
      <Popular/>
      <Explore/>
      <Join/>
      <Footer/>
    </>
  );
};

export default LandingPage;
