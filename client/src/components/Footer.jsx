import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const companyName = 'Company';
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: <Github className="w-5 h-5" /> },
    { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="w-5 h-5" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Email', href: 'mailto:hello@company.com', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-zinc-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="font-bold text-2xl mb-2">{companyName}</div>
            <div className="text-zinc-300 text-sm">
              © {currentYear} {companyName}. All rights reserved.
            </div>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-600 transition-colors cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Additional footer decoration */}
        <motion.div
          className="mt-12 pt-8 border-t border-zinc-600/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-zinc-300 text-sm hover:text-zinc-200 transition-colors duration-300"
          >
            Built with ❤️ using modern web technologies
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};