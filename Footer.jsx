import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { categories } from "../utils/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <FiGithub />, link: "https://www.github.com/SaniyaAtar" },
    
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      link: "https://www.linkedin.com/in/saniya-atar",
    },
  
  ];

  return (
    <footer className="w-full mx-auto px-32 py-16 h-max border-t border-gray-200 bg-gray-100">
     
      <div className="mt-12 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-800">Custom Craft</span>
        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li key={name}>
              <a href={link} target="_blank" rel="noopener noreferrer" aria-label={name}>
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} Saniya Atar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
