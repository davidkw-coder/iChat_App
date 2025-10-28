import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export const CTASection = () => {
  const title = 'Contact Us';
  const description = 'Ready to get started? Get in touch with our team.';
  
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: 'hello@company.com',
      href: 'mailto:hello@company.com',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Address',
      value: 'San Francisco, CA',
      href: '#',
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-20 px-6 bg-zinc-50"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-xl text-zinc-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-lg p-8 shadow-sm border border-zinc-200"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-2xl font-semibold text-zinc-900 mb-6">Send us a message</h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-zinc-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div>
              <h3 className="text-2xl font-semibold text-zinc-800 mb-6">Get in touch</h3>
              <p className="text-zinc-700 mb-8">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="flex items-center p-4 bg-white rounded-2xl border border-zinc-200 hover:bg-zinc-50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 group shadow-lg hover:shadow-xl cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-200"
                  >
                    {item.icon}
                  </motion.div>
                  <div>
                    <div className="font-medium text-zinc-800">{item.label}</div>
                    <div className="text-zinc-700 group-hover:text-zinc-800 transition-colors">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};