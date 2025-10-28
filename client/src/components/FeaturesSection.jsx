import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, Users, Globe } from 'lucide-react';

export const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    once: true, 
    margin: "-100px 0px -100px 0px"
  });
  
  const title = 'Why Choose Our Platform';
  const description = 'Everything you need to build modern applications, from development to deployment.';
  
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast Performance',
      description: 'Built for speed with optimized architecture and modern best practices.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure by Default',
      description: 'Enterprise-grade security with encryption and compliance standards.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration tools.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Scale',
      description: 'Deploy worldwide with our global infrastructure and CDN.',
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="py-20 px-6 bg-zinc-50"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-xl text-zinc-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white p-8 rounded-lg border border-zinc-200 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <div className="w-16 h-16 bg-zinc-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-zinc-700 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};