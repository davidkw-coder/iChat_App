import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfoForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData?.phone && !/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData?.website && !/^https?:\/\/.+\..+/?.test(formData?.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData?.bio && formData?.bio?.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSave(formData);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-educational">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground">Update your personal details and contact information</p>
        </div>
      </div>
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-success font-medium">Profile updated successfully!</span>
        </div>
      )}
      {/* Error Message */}
      {errors?.submit && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3">
          <Icon name="AlertCircle" size={20} className="text-error" />
          <span className="text-error font-medium">{errors?.submit}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            error={errors?.name}
            required
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleChange}
            error={errors?.email}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData?.phone}
            onChange={handleChange}
            error={errors?.phone}
            placeholder="+1 (555) 123-4567"
            description="Optional - for emergency contact"
          />
          
          <Input
            label="Location"
            type="text"
            name="location"
            value={formData?.location}
            onChange={handleChange}
            placeholder="City, State/Country"
            description="Your current location"
          />
        </div>

        <Input
          label="Website"
          type="url"
          name="website"
          value={formData?.website}
          onChange={handleChange}
          error={errors?.website}
          placeholder="https://yourwebsite.com"
          description="Personal or professional website"
        />

        {/* Bio Section */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData?.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            placeholder="Tell us about yourself..."
          />
          {errors?.bio && (
            <p className="mt-1 text-sm text-error">{errors?.bio}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {formData?.bio?.length}/500 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="sm:w-auto"
          >
            Save Changes
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                bio: user?.bio || '',
                location: user?.location || '',
                website: user?.website || ''
              });
              setErrors({});
            }}
            className="sm:w-auto"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;