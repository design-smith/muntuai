import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Mustache from 'mustache';
import baseTemplate from '../assets/template-base.html?raw';

// Social media platform data
const SOCIAL_MEDIA_PLATFORMS = {
  facebook: {
    name: 'Facebook',
    icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    placeholder: 'https://facebook.com/your-profile'
  },
  twitter: {
    name: 'Twitter',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
    placeholder: 'https://twitter.com/your-handle'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    placeholder: 'https://linkedin.com/in/your-profile'
  },
  instagram: {
    name: 'Instagram',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
    placeholder: 'https://instagram.com/your-handle'
  },
  github: {
    name: 'GitHub',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733609.png',
    placeholder: 'https://github.com/your-username'
  },
  youtube: {
    name: 'YouTube',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733646.png',
    placeholder: 'https://youtube.com/@your-channel'
  },
  tiktok: {
    name: 'TikTok',
    icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
    placeholder: 'https://tiktok.com/@your-username'
  },
  medium: {
    name: 'Medium',
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968885.png',
    placeholder: 'https://medium.com/@your-username'
  }
};

const BASE_TEMPLATE_TITLES = ['Base Template', 'Default', 'base']; // Add more if needed

const TemplateEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;
  const fileInputRef = useRef(null);
  const profilePictureInputRef = useRef(null);

  const [formData, setFormData] = useState({
    NAME: '',
    TITLE: '',
    LOGO: '',
    PROFILE_PICTURE: '',
    EMAIL: '',
    WEBSITE: '',
    PHONE: '',
    SOCIAL_MEDIA: []
  });

  const [previewHtml, setPreviewHtml] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  // Helper to determine if this is the base template
  const isBaseTemplate = template && (
    BASE_TEMPLATE_TITLES.includes(template.title) || template.id === 0
  );

  useEffect(() => {
    if (!template) {
      navigate('/settings');
      return;
    }

    // Initialize form data with any existing values
    const initialData = {
      NAME: template.data?.NAME || '',
      TITLE: template.data?.TITLE || '',
      LOGO: template.data?.LOGO || '',
      PROFILE_PICTURE: template.data?.PROFILE_PICTURE || '',
      EMAIL: template.data?.EMAIL || '',
      WEBSITE: template.data?.WEBSITE || '',
      PHONE: template.data?.PHONE || '',
      SOCIAL_MEDIA: template.data?.SOCIAL_MEDIA || []
    };

    setFormData(initialData);
    setLogoPreview(initialData.LOGO);
    setProfilePicturePreview(initialData.PROFILE_PICTURE);

    // Initial preview render
    try {
      const templateContent = isBaseTemplate ? baseTemplate : (template.content || baseTemplate);
      const renderedHtml = Mustache.render(templateContent, initialData);
      setPreviewHtml(renderedHtml);
    } catch (error) {
      console.error('Error rendering initial template:', error);
    }
  }, [template, navigate, isBaseTemplate]);

  useEffect(() => {
    // Update preview whenever form data changes
    try {
      const templateContent = isBaseTemplate ? baseTemplate : (template?.content || baseTemplate);
      const renderedHtml = Mustache.render(templateContent, formData);
      setPreviewHtml(renderedHtml);
    } catch (error) {
      console.error('Error rendering template:', error);
    }
  }, [formData, template, isBaseTemplate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (type === 'logo') {
          setLogoPreview(base64String);
          setFormData(prev => ({
            ...prev,
            LOGO: base64String
          }));
        } else {
          setProfilePicturePreview(base64String);
          setFormData(prev => ({
            ...prev,
            PROFILE_PICTURE: base64String
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialMediaChange = (index, field, value) => {
    setFormData(prev => {
      const newSocialMedia = [...prev.SOCIAL_MEDIA];
      if (!newSocialMedia[index]) {
        newSocialMedia[index] = { LINK: '', ICON: '', PLATFORM: '' };
      }
      newSocialMedia[index][field] = value;
      return {
        ...prev,
        SOCIAL_MEDIA: newSocialMedia
      };
    });
  };

  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      SOCIAL_MEDIA: [...prev.SOCIAL_MEDIA, { LINK: '', ICON: '', PLATFORM: '' }]
    }));
  };

  const removeSocialMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      SOCIAL_MEDIA: prev.SOCIAL_MEDIA.filter((_, i) => i !== index)
    }));
  };

  const handlePlatformSelect = (index, platform) => {
    if (platform) {
      const platformData = SOCIAL_MEDIA_PLATFORMS[platform];
      handleSocialMediaChange(index, 'PLATFORM', platform);
      handleSocialMediaChange(index, 'ICON', platformData.icon);
      handleSocialMediaChange(index, 'LINK', '');
    }
  };

  const handleSave = () => {
    const updatedTemplate = {
      ...template,
      data: formData,
      content: isBaseTemplate ? baseTemplate : template.content
    };
    
    // Save to localStorage
    const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    const updatedTemplates = savedTemplates.map(t => 
      t.id === template.id ? updatedTemplate : t
    );
    localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));

    // Navigate back with updated template
    navigate('/settings', { 
      state: { 
        updatedTemplate,
        showTemplates: true
      }
    });
  };

  if (!template) return null;

  return (
    <div className="template-editor" style={{ minWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Form Section */}
        <div style={{ flex: 1, background: 'rgba(39, 45, 79, 0.7)', borderRadius: 12, minWidth: 600, padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Edit Template</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', width: '40%' }}>Profile Picture</label>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                alignItems: 'center'
              }}>
                {profilePicturePreview && (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}>
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile Preview" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  width: '100%'
                }}>
                  <input
                    type="file"
                    ref={profilePictureInputRef}
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => profilePictureInputRef.current?.click()}
                    style={{
                      flex: 1,
                      background: 'var(--orange-crayola)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '40%'
                    }}
                  >
                    {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {profilePicturePreview && (
                    <button
                      onClick={() => {
                        setProfilePicturePreview('');
                        setFormData(prev => ({ ...prev, PROFILE_PICTURE: '' }));
                      }}
                      style={{
                        background: '#ff4444',
                        color: '#fff',
                        border: 'none',
                        padding: '0.8rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  Recommended size: 200x200px. Max file size: 2MB
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem'}}>Name</label>
              <input
                type="text"
                name="NAME"
                value={formData.NAME}
                onChange={handleInputChange}
                style={{
                  width: '60%',
                  padding: '0.8rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
                placeholder="Your Name"
              />
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Title</label>
              <input
                type="text"
                name="TITLE"
                value={formData.TITLE}
                onChange={handleInputChange}
                style={{
                  width: '60%',
                  padding: '0.8rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
                placeholder="Your Title"
              />
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Company Logo</label>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                alignItems: 'center'
              }}>
                {logoPreview && (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}>
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  width: '100%'
                }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      flex: 1,
                      background: 'var(--orange-crayola)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  {logoPreview && (
                    <button
                      onClick={() => {
                        setLogoPreview('');
                        setFormData(prev => ({ ...prev, LOGO: '' }));
                      }}
                      style={{
                        background: '#ff4444',
                        color: '#fff',
                        border: 'none',
                        padding: '0.8rem',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  Recommended size: 200x200px. Max file size: 2MB
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                name="EMAIL"
                value={formData.EMAIL}
                onChange={handleInputChange}
                style={{
                  width: '60%',
                  padding: '0.8rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Website</label>
              <input
                type="url"
                name="WEBSITE"
                value={formData.WEBSITE}
                onChange={handleInputChange}
                style={{
                  minWidth: '60%',
                  maxWidth: '80%',
                  padding: '0.8rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Phone</label>
              <input
                type="tel"
                name="PHONE"
                value={formData.PHONE}
                onChange={handleInputChange}
                style={{
                  minWidth: '60%',
                  maxWidth: '80%',
                  padding: '0.8rem',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff'
                }}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: '#fff' }}>Social Media Links</label>
                <button
                  onClick={addSocialMedia}
                  style={{
                    background: 'var(--orange-crayola)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  Add Link
                </button>
              </div>
              
              {formData.SOCIAL_MEDIA.map((social, index) => (
                <div key={index} style={{ 
                  marginBottom: '1rem', 
                  display: 'flex', 
                  gap: '0.5rem',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '1rem',
                  borderRadius: 8
                }}>
                  <select
                    value={social.PLATFORM || ''}
                    onChange={(e) => handlePlatformSelect(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Platform</option>
                    {Object.entries(SOCIAL_MEDIA_PLATFORMS).map(([key, platform]) => (
                      <option key={key} value={key}>{platform.name}</option>
                    ))}
                  </select>
                  
                  {social.PLATFORM && (
                    <>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={social.ICON} 
                          alt={SOCIAL_MEDIA_PLATFORMS[social.PLATFORM]?.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        value={social.LINK}
                        onChange={(e) => handleSocialMediaChange(index, 'LINK', e.target.value)}
                        style={{
                          flex: 2,
                          padding: '0.8rem',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fff'
                        }}
                        placeholder={SOCIAL_MEDIA_PLATFORMS[social.PLATFORM]?.placeholder}
                      />
                    </>
                  )}
                  
                  <button
                    onClick={() => removeSocialMedia(index)}
                    style={{
                      background: '#ff4444',
                      color: '#fff',
                      border: 'none',
                      padding: '0.8rem',
                      borderRadius: 8,
                      cursor: 'pointer',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              style={{
                background: 'var(--orange-crayola)',
                color: '#fff',
                border: 'none',
                padding: '1rem',
                borderRadius: 8,
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div style={{ flex: 1, background: 'rgba(39, 45, 79, 0.7)', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Preview</h2>
          <div 
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '1rem',
              height: 'calc(100vh - 200px)',
              overflow: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor; 