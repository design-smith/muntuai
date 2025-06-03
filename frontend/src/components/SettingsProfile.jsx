import React, { useEffect, useState, useRef } from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box as MuiBox, Chip, TextField, IconButton } from '@mui/material';
import { TextInput, LongTextInput } from './BasicFormElements';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useUser } from '../App';
import SettingsProfileBusiness from './SettingsProfileBusiness';

const SettingsProfile = () => {
  const { user } = useUser();
  const [profileTab, setProfileTab] = useState('personal');
  // Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personalTitle, setPersonalTitle] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [editingPersonalName, setEditingPersonalName] = useState(false);
  const [editingPersonalTitle, setEditingPersonalTitle] = useState(false);
  const [editingPersonalEmail, setEditingPersonalEmail] = useState(false);
  const [editingPersonalPhone, setEditingPersonalPhone] = useState(false);
  // Products
  const [resumeName, setResumeName] = useState('');
  // Add state for resume fields
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [links, setLinks] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [editingLinkIdx, setEditingLinkIdx] = useState(null);
  const [addLinkMode, setAddLinkMode] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const resumeInputRef = useRef(null);

  // Fetch user profile and resume from backend
  const fetchUserProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch user profile: ${res.statusText}`);
      }
      const data = await res.json();
      
      // Update basic profile fields
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPersonalTitle(data.title || '');
      setPersonalEmail(data.email || '');
      setPersonalPhone(data.phone || '');

      // Handle resume data
      if (data.resume) {
        // Summary
        setSummary(data.resume.summary || '');
        
        // Skills - handle both array and string formats
        const skillsData = data.resume.skills || [];
        setSkills(Array.isArray(skillsData) ? skillsData : [skillsData].filter(Boolean));
        
        // Work Experience - ensure proper structure
        const workExp = data.resume.work_experience || [];
        setWorkExperience(Array.isArray(workExp) ? workExp.map(exp => ({
          company: exp.company || exp.organization || '',
          title: exp.title || exp.jobTitle || '',
          start: exp.start || exp.startDate || '',
          end: exp.end || exp.endDate || '',
          description: exp.description || exp.jobDescription || '',
          location: exp.location || '',
          skills_used: exp.skills_used || []
        })) : []);
        
        // Education - ensure proper structure
        const edu = data.resume.education || [];
        setEducation(Array.isArray(edu) ? edu.map(eduItem => ({
          school: eduItem.school || eduItem.organization || '',
          degree: eduItem.degree || eduItem.accreditation?.education || '',
          start: eduItem.start || eduItem.startDate || '',
          end: eduItem.end || eduItem.endDate || '',
          description: eduItem.description || '',
          location: eduItem.location || ''
        })) : []);
        
        // Certifications - handle both array and string formats
        const certs = data.resume.certifications || [];
        setCertifications(Array.isArray(certs) ? certs : [certs].filter(Boolean));
        
        // Languages - handle both array and string formats
        const langs = data.resume.languages || [];
        setLanguages(Array.isArray(langs) ? langs : [langs].filter(Boolean));
        
        // Links - handle both array and string formats
        const linksData = data.resume.links || data.resume.websites || [];
        setLinks(Array.isArray(linksData) ? linksData : [linksData].filter(Boolean));
      } else {
        // Reset all resume fields if no resume data
        setSummary('');
        setSkills([]);
        setWorkExperience([]);
        setEducation([]);
        setCertifications([]);
        setLanguages([]);
        setLinks([]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Optionally show error to user
      alert('Failed to load profile data. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Resume upload handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeName(file.name);
    setResumeLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.accessToken}` },
        body: formData,
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = null; }
      if (data && data.data) {
        // Normalize Affinda fields to our expected structure
        const affinda = data.data;
        console.log('Affinda parsed data:', affinda); // Debug: see the actual structure
        const normalized = {
          summary: affinda.summary || '',
          skills: Array.isArray(affinda.skills) ? affinda.skills : [],
          work_experience: Array.isArray(affinda.workExperience)
            ? affinda.workExperience.map(exp => ({
                company: exp.organization || '',
                title: exp.jobTitle || '',
                start: exp.dates?.startDate || '',
                end: exp.dates?.completionDate || '',
                description: exp.jobDescription || exp.description || '',
              }))
            : [],
          education: Array.isArray(affinda.education)
            ? affinda.education.map(edu => ({
                school: edu.organization || '',
                degree: edu.accreditation?.education || '',
                start: edu.dates?.startDate || '',
                end: edu.dates?.completionDate || '',
                description: edu.description || '',
              }))
            : [],
          certifications: Array.isArray(affinda.certifications) ? affinda.certifications : [],
          languages: Array.isArray(affinda.languages) ? affinda.languages : [],
          links: Array.isArray(affinda.websites) ? affinda.websites : [],
          phone: (Array.isArray(affinda.phoneNumbers) && affinda.phoneNumbers[0]) || affinda.mobile_number || '',
          first_name: affinda.name?.first || '',
          last_name: affinda.name?.last || '',
        };
        if (!user?.accessToken) {
          alert('You are not authenticated. Please log in again.');
          setResumeLoading(false);
          return;
        }
        await fetch(`http://localhost:8000/users/${user.id}/resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify(normalized),
        });
        // Also update first and last name, and phone if present
        if (normalized.first_name || normalized.last_name || normalized.phone) {
          await saveUserProfile({
            ...(normalized.first_name && { first_name: normalized.first_name }),
            ...(normalized.last_name && { last_name: normalized.last_name }),
            ...(normalized.phone && { phone: normalized.phone }),
          });
        }
        // Re-fetch user profile to update UI
        await fetchUserProfile();
      }
    } catch {
      alert('Resume parsing failed.');
    } finally {
      setResumeLoading(false);
    }
  };

  // Save user profile info (first/last name, title, phone)
  const saveUserProfile = async (fields) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(fields),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to save profile: ${res.statusText}`);
      }
      
      await fetchUserProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  // Save resume data
  const saveResumeData = async () => {
    if (!user?.id) return;
    try {
      const resumeData = {
        summary,
        skills,
        work_experience: workExperience.map(exp => ({
          company: exp.company,
          title: exp.title,
          start: exp.start,
          end: exp.end,
          description: exp.description,
          location: exp.location,
          skills_used: exp.skills_used || []
        })),
        education: education.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          start: edu.start,
          end: edu.end,
          description: edu.description,
          location: edu.location
        })),
        certifications,
        languages,
        links
      };

      const res = await fetch(`http://localhost:8000/users/${user.id}/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(resumeData),
      });

      if (!res.ok) {
        throw new Error(`Failed to save resume: ${res.statusText}`);
      }

      await fetchUserProfile();
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume changes. Please try again.');
    }
  };

  // Add auto-save functionality for resume fields
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (user?.id) {
        saveResumeData();
      }
    }, 2000); // Debounce for 2 seconds

    return () => clearTimeout(saveTimeout);
  }, [summary, skills, workExperience, education, certifications, languages, links]);

  return (
    <div className="settings-profile-root">
      <MuiTabs value={profileTab} onChange={(_, v) => setProfileTab(v)} className="settings-profile-tabs">
        <MuiTab label="Personal" value="personal" className="settings-profile-tab" />
        <MuiTab label="Business" value="business" className="settings-profile-tab" />
      </MuiTabs>
      <div className="settings-profile-tab-content">
        {/* Personal Tab */}
        {profileTab === 'personal' && (
          <form className="settings-profile-form">
            {/* Upload Resume Button at the top */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="file"
                id="resume-upload"
                ref={resumeInputRef}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleResumeUpload}
              />
              <button
                type="button"
                className="button button-outlined"
                style={{ fontWeight: 600, fontSize: '1rem', borderRadius: 8, padding: '0.6rem 1.2rem', background: 'rgba(60,72,132,0.18)', color: '#fff', border: '1.5px solid var(--desert-sand)' }}
                disabled={resumeLoading}
                onClick={() => resumeInputRef.current && resumeInputRef.current.click()}
              >
                {resumeLoading ? 'Parsing Resume...' : 'Upload Resume'}
              </button>
              {resumeName && <span style={{ color: 'var(--desert-sand)', marginLeft: 12 }}>{resumeName}</span>}
            </div>
            <h3>Name</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {editingPersonalName ? (
                <>
                  <TextInput
                    label="First Name"
                    value={firstName || ''}
                    onChange={e => {
                      setFirstName(e.target.value);
                      saveUserProfile({ first_name: e.target.value, last_name: lastName });
                    }}
                    onBlur={() => setEditingPersonalName(false)}
                    autoFocus
                    style={{ minWidth: 120, marginRight: 8 }}
                  />
                  <TextInput
                    label="Last Name"
                    value={lastName || ''}
                    onChange={e => {
                      setLastName(e.target.value);
                      saveUserProfile({ first_name: firstName, last_name: e.target.value });
                    }}
                    onBlur={() => setEditingPersonalName(false)}
                    style={{ minWidth: 120 }}
                  />
                </>
              ) : (
                <>
                  <span style={{ color: '#fff', fontSize: '1.18rem', fontWeight: 700 }}>{(firstName || '') + ' ' + (lastName || '')}</span>
                  <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 20 }} onClick={() => setEditingPersonalName(true)} />
                </>
              )}
            </div>
            <h3>Title</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {editingPersonalTitle ? (
                <TextInput
                  label="Title"
                  value={personalTitle || ''}
                  onChange={e => { setPersonalTitle(e.target.value); saveUserProfile({ title: e.target.value }); }}
                  onBlur={() => setEditingPersonalTitle(false)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalTitle(false); } }}
                  style={{ minWidth: 120 }}
                />
              ) : (
                <>
                  <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalTitle || ''}</span>
                  <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalTitle(true)} />
                </>
              )}
            </div>
            <h3>Email</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {editingPersonalEmail ? (
                <TextInput
                  label="Email"
                  value={personalEmail || ''}
                  onChange={e => { setPersonalEmail(e.target.value); saveUserProfile({ email: e.target.value }); }}
                  onBlur={() => setEditingPersonalEmail(false)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalEmail(false); } }}
                  style={{ minWidth: 180 }}
                />
              ) : (
                <>
                  <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalEmail || ''}</span>
                  <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalEmail(true)} />
                </>
              )}
            </div>
            <h3>Phone</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {editingPersonalPhone ? (
                <TextInput
                  label="Phone"
                  value={personalPhone || ''}
                  onChange={e => { setPersonalPhone(e.target.value); saveUserProfile({ phone: e.target.value }); }}
                  onBlur={() => setEditingPersonalPhone(false)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalPhone(false); } }}
                  style={{ minWidth: 120 }}
                />
              ) : (
                <>
                  <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalPhone || ''}</span>
                  <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalPhone(true)} />
                </>
              )}
            </div>
            {/* Resume Fields */}
            <h3>Summary</h3>
            <LongTextInput label="Professional Summary" value={summary || ''} onChange={e => setSummary(e.target.value)} />
            <h3>Skills</h3>
            <div style={{ marginBottom: 16 }}>
              <TextField
                label="Add a skill"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && skillInput.trim()) {
                    e.preventDefault();
                    if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
                    setSkillInput('');
                  } else if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
                    setSkills(skills.slice(0, -1));
                  }
                }}
                fullWidth
                variant="outlined"
                size="small"
                style={{ marginBottom: 8 }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill, idx) => {
                  let label = '';
                  if (typeof skill === 'string') label = skill;
                  else if (typeof skill === 'object' && skill !== null) label = skill.name || skill.skill || JSON.stringify(skill);
                  else label = String(skill);
                  return (
                    <Chip
                      key={idx}
                      label={label}
                      onDelete={() => setSkills(skills.filter((_, i) => i !== idx))}
                      style={{ background: 'var(--marian-blue)', color: '#fff' }}
                    />
                  );
                })}
              </div>
            </div>
            <h3>Work Experience</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 16 }}>
              {workExperience.map((exp, idx) => (
                <div key={idx} style={{ border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '1rem', marginBottom: 8 }}>
                  <TextInput label="Company" value={exp.company || ''} onChange={e => setWorkExperience(w => w.map((x, i) => i === idx ? { ...x, company: e.target.value } : x))} style={{ marginBottom: 8 }} />
                  <TextInput label="Title" value={exp.title || ''} onChange={e => setWorkExperience(w => w.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))} style={{ marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <TextInput label="Start" value={exp.start || ''} onChange={e => setWorkExperience(w => w.map((x, i) => i === idx ? { ...x, start: e.target.value } : x))} style={{ flex: 1 }} />
                    <TextInput label="End" value={exp.end || ''} onChange={e => setWorkExperience(w => w.map((x, i) => i === idx ? { ...x, end: e.target.value } : x))} style={{ flex: 1 }} />
                  </div>
                  <LongTextInput label="Description" value={exp.description || ''} onChange={e => setWorkExperience(w => w.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
                  <button type="button" className="button" style={{ background: 'none', color: '#FF7125', border: 'none', fontSize: 18, marginTop: 4 }} onClick={() => setWorkExperience(w => w.filter((_, i) => i !== idx))} disabled={workExperience.length === 1}>× Remove</button>
                </div>
              ))}
              <button type="button" className="button button-outlined" style={{ width: 'fit-content', marginTop: 4 }} onClick={() => setWorkExperience(w => [...w, { company: '', title: '', start: '', end: '', description: '' }])}>+ Add Experience</button>
            </div>
            <h3>Education</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 16 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '1rem', marginBottom: 8 }}>
                  <TextInput label="School" value={edu.school || ''} onChange={e => setEducation(education => education.map((x, i) => i === idx ? { ...x, school: e.target.value } : x))} style={{ marginBottom: 8 }} />
                  <TextInput label="Degree" value={edu.degree || ''} onChange={e => setEducation(education => education.map((x, i) => i === idx ? { ...x, degree: e.target.value } : x))} style={{ marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <TextInput label="Start" value={edu.start || ''} onChange={e => setEducation(education => education.map((x, i) => i === idx ? { ...x, start: e.target.value } : x))} style={{ flex: 1 }} />
                    <TextInput label="End" value={edu.end || ''} onChange={e => setEducation(education => education.map((x, i) => i === idx ? { ...x, end: e.target.value } : x))} style={{ flex: 1 }} />
                  </div>
                  <LongTextInput label="Description" value={edu.description || ''} onChange={e => setEducation(education => education.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
                  <button type="button" className="button" style={{ background: 'none', color: '#FF7125', border: 'none', fontSize: 18, marginTop: 4 }} onClick={() => setEducation(education => education.filter((_, i) => i !== idx))} disabled={education.length === 1}>× Remove</button>
                </div>
              ))}
              <button type="button" className="button button-outlined" style={{ width: 'fit-content', marginTop: 4 }} onClick={() => setEducation(e => [...e, { school: '', degree: '', start: '', end: '', description: '' }])}>+ Add Education</button>
            </div>
            <h3>Certifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                  <TextInput label={`Certification ${idx + 1}`} value={cert || ''} onChange={e => setCertifications(c => c.map((x, i) => i === idx ? e.target.value : x))} style={{ flex: 1 }} />
                  <button type="button" className="button" style={{ background: 'none', color: '#FF7125', border: 'none', fontSize: 18 }} onClick={() => setCertifications(c => c.filter((_, i) => i !== idx))} disabled={certifications.length === 1}>×</button>
                  </div>
              ))}
              <button type="button" className="button button-outlined" style={{ width: 'fit-content', marginTop: 4 }} onClick={() => setCertifications(c => [...c, ''])}>+ Add Certification</button>
                    </div>
            <h3>Languages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {languages.map((lang, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                  <TextInput label={`Language ${idx + 1}`} value={lang || ''} onChange={e => setLanguages(l => l.map((x, i) => i === idx ? e.target.value : x))} style={{ flex: 1 }} />
                  <button type="button" className="button" style={{ background: 'none', color: '#FF7125', border: 'none', fontSize: 18 }} onClick={() => setLanguages(l => l.filter((_, i) => i !== idx))} disabled={languages.length === 1}>×</button>
                    </div>
              ))}
              <button type="button" className="button button-outlined" style={{ width: 'fit-content', marginTop: 4 }} onClick={() => setLanguages(l => [...l, ''])}>+ Add Language</button>
                      </div>
            <h3>Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {links.map((link, idx) => (
                editingLinkIdx === idx ? (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320 }}>
                          <input
                      value={link}
                      onChange={e => setLinks(links => links.map((l, i) => i === idx ? e.target.value : l))}
                      onBlur={() => setEditingLinkIdx(null)}
                      autoFocus
                      style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
                    />
                    <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => setLinks(links => links.filter((_, i) => i !== idx))} />
                        </div>
                ) : (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320, cursor: 'pointer' }} onClick={() => setEditingLinkIdx(idx)}>
                    <span style={{ color: '#fff', fontSize: '1.1rem', flex: 1 }}>{link}</span>
                    <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLinks(links => links.filter((_, i) => i !== idx)); }} />
                    </div>
                )
              ))}
              {addLinkMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 320 }}>
                  <input
                    placeholder="Enter link URL"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: '1.5px solid #e3e8f0', color: '#fff', borderRadius: 8, padding: '0.4rem 1rem', fontSize: '1.1rem' }}
                  />
                  <button
                    type="button"
                    className="button button-contained"
                    style={{ height: 36, fontSize: '1rem', marginLeft: 4 }}
                    onClick={() => {
                      if (newLink) {
                        setLinks(links => [...links, newLink]);
                        setNewLink('');
                        setAddLinkMode(false);
                      }
                    }}
                  >Save</button>
                </div>
              ) : (
                <button type="button" className="button" style={{ background: 'rgba(60,72,132,0.18)', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: 8, marginTop: 4, width: 'fit-content' }} onClick={() => setAddLinkMode(true)}>
                  Add Link +
                </button>
            )}
          </div>
          </form>
        )}
        {/* Business Tab */}
        {profileTab === 'business' && (
          <SettingsProfileBusiness />
        )}
      </div>
    </div>
  );
};

export default SettingsProfile; 