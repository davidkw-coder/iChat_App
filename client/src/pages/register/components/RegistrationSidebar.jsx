import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RegistrationSidebar = () => {
  const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Math Teacher",
    avatar: "https://images.unsplash.com/photo-1730573520149-7a5b97d35ccc",
    avatarAlt: "Professional headshot of blonde woman teacher in blue blouse smiling at camera",
    quote: "SchoolChat has revolutionized how I communicate with my students. The real-time messaging makes it so easy to provide instant feedback and support."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1698072556534-40ec6e337311",
    avatarAlt: "Young Asian male student with black hair wearing casual shirt smiling outdoors",
    quote: "I love how I can quickly ask questions and get help from my teachers. The group chats for class projects are incredibly useful too."
  },
  {
    id: 3,
    name: "Dr. Patricia Williams",
    role: "Principal",
    avatar: "https://images.unsplash.com/photo-1590649880765-91b1956b8276",
    avatarAlt: "Professional African American woman principal in dark blazer with warm smile in office setting",
    quote: "The administrative oversight features give me confidence that our school communications are safe, secure, and appropriate for our educational environment."
  }];


  const benefits = [
  {
    icon: "MessageCircle",
    title: "Instant Communication",
    description: "Connect with teachers, students, and staff in real-time"
  },
  {
    icon: "Users",
    title: "Group Collaboration",
    description: "Create class groups and project teams for better teamwork"
  },
  {
    icon: "FileText",
    title: "File Sharing",
    description: "Share assignments, resources, and documents securely"
  },
  {
    icon: "Bell",
    title: "Smart Notifications",
    description: "Stay updated with important messages and announcements"
  }];


  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent p-12 text-white">
      <div className="flex flex-col justify-between w-full">
        {/* Header Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-semibold">
              Welcome to the Future of School Communication
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of educators and students already using SchoolChat to enhance their educational experience.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-6">
            {benefits?.map((benefit) =>
            <div key={benefit?.title} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={benefit?.icon} size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">{benefit?.title}</h3>
                  <p className="text-sm opacity-80">{benefit?.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-medium">What Our Community Says</h3>
          
          <div className="space-y-6">
            {testimonials?.map((testimonial) =>
            <div key={testimonial?.id} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.avatarAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{testimonial?.name}</h4>
                      <span className="text-sm opacity-70">•</span>
                      <span className="text-sm opacity-70">{testimonial?.role}</span>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">
                      "{testimonial?.quote}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-semibold">10K+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">500+</div>
              <div className="text-sm opacity-80">Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">99.9%</div>
              <div className="text-sm opacity-80">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default RegistrationSidebar;