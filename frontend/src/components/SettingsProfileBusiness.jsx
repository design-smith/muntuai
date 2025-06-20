import React, { useEffect, useState } from 'react';
import { TextInput, LongTextInput, Button } from './BasicFormElements';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../App';
import industries from '../assets/industries.json';

const SettingsProfileBusiness = () => {
  const { user } = useUser();
  const [businessId, setBusinessId] = useState(null);
  const [businessLogo, setBusinessLogo] = useState('/logo192.png');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);
  const [socialPlatforms] = useState([
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
  ]);
  const [editingSocialIdx, setEditingSocialIdx] = useState(null);
  const [addSocialMode, setAddSocialMode] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [locations, setLocations] = useState([]);
  const [editingLocationIdx, setEditingLocationIdx] = useState(null);
  const [addLocationMode, setAddLocationMode] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/businesses', {
          headers: { 'Authorization': `Bearer ${user?.accessToken}` },
        });
        console.log('Fetch profile response status:', res.status);
        const data = await res.json();
        console.log('Fetch profile data:', data);
        const business = data.businesses && data.businesses[0];
        if (business) {
          setBusinessId(business._id);
          setBusinessName(business.businessName || '');
          setIndustry(business.industry || '');
          setCompanyDescription(business.companyDescription || '');
          setCompanyEmail(business.companyEmail || '');
          setCompanyPhone(business.companyPhone || '');
          setBusinessLogo(business.businessLogo || '/logo192.png');
          setSocialLinks(business.socialLinks || []);
          setLocations(business.locations || []);
        } else {
          console.log('No business found in response.');
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      }
    };
    if (user?.accessToken) fetchProfile();
  }, [user]);

  const saveFullBusinessProfile = async (overrides = {}) => {
    if (!businessId) {
      console.log('No businessId, not saving.');
      return;
    }
    const fullProfile = {
      businessName,
      industry,
      companyDescription,
      companyEmail,
      companyPhone,
      socialLinks,
      locations,
      ...overrides,
    };
    console.log('Saving business profile:', businessId, fullProfile);
    try {
      const res = await fetch(`http://localhost:8000/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(fullProfile),
      });
      console.log('Save response status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        console.error('Save failed:', res.status, text);
      } else {
        const data = await res.json().catch(() => null);
        console.log('Save succeeded:', data);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div className="settings-profile-business-root">
      <form className="settings-profile-form">
        <h3 style={{ display: 'none' }}>Business Name and Logo</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: 110, height: 110 }}>
            <div style={{
              position: 'absolute',
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'rgba(219, 186, 167, 0.06)',
              left: 0,
              top: 0,
              zIndex: 1,
            }} />
            <div style={{ width: 80, height: 80, position: 'absolute', left: 15, top: 15, zIndex: 2, background: 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={businessLogo} alt="Business Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', background: 'transparent' }} />
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} id="logo-upload" onChange={() => {}} />
            <label htmlFor="logo-upload" style={{ position: 'absolute', left: 70, top: 70, zIndex: 3, background: 'rgba(39,45,79,0.9)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '2px solid #232b3e', cursor: 'pointer' }}>
              <UploadIcon style={{ color: 'var(--desert-sand)' }} />
            </label>
          </div>
          <div>
            {editingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  value={businessName}
                  onChange={e => { setBusinessName(e.target.value); saveFullBusinessProfile({ businessName: e.target.value }); }}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                  style={{
                    fontWeight: 700,
                    fontSize: '1.6rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    borderBottom: '2px solid var(--orange-crayola)',
                    width: 'auto',
                    minWidth: 120,
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>{businessName}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => setEditingName(true)} />
              </div>
            )}
          </div>
        </div>
        <Autocomplete
          options={industries}
          value={industry}
          onChange={(_, v) => { setIndustry(v || ''); saveFullBusinessProfile({ industry: v || '' }); }}
          renderInput={(params) => (
            <TextInput {...params} label="Industry" value={industry} onChange={e => { setIndustry(e.target.value); saveFullBusinessProfile({ industry: e.target.value }); }} />
          )}
          freeSolo
          autoHighlight
          fullWidth
          sx={{ mb: 2 }}
        />
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Company Description
            {!editingDescription && (
              <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 20 }} onClick={() => setEditingDescription(true)} />
            )}
          </h3>
          {editingDescription ? (
            <LongTextInput
              label="Description"
              value={companyDescription}
              onChange={e => { setCompanyDescription(e.target.value); saveFullBusinessProfile({ companyDescription: e.target.value }); }}
              onBlur={() => setEditingDescription(false)}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditingDescription(false); } }}
            />
          ) : (
            <div style={{ color: '#fff', fontSize: '1.08rem', minHeight: 32 }}>{companyDescription}</div>
          )}
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '1rem', color: 'var(--desert-sand)', marginBottom: 2 }}>Email</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editingEmail ? (
              <TextInput
                label="Email"
                value={companyEmail}
                onChange={e => { setCompanyEmail(e.target.value); saveFullBusinessProfile({ companyEmail: e.target.value }); }}
                onBlur={() => setEditingEmail(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingEmail(false); } }}
                style={{ minWidth: 180 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.08rem' }}>{companyEmail}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingEmail(true)} />
              </>
            )}
          </div>
        </div>
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '1rem', color: 'var(--desert-sand)', marginBottom: 2 }}>Phone</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editingPhone ? (
              <TextInput
                label="Phone"
                value={companyPhone}
                onChange={e => { setCompanyPhone(e.target.value); saveFullBusinessProfile({ companyPhone: e.target.value }); }}
                onBlur={() => setEditingPhone(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPhone(false); } }}
                style={{ minWidth: 120 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.08rem' }}>{companyPhone}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPhone(true)} />
              </>
            )}
          </div>
        </div>
        <h3>Social Media Links</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {socialLinks.map((link, idx) => {
            const platformObj = socialPlatforms.find(p => p.value === link.platform);
            return editingSocialIdx === idx ? (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320 }}>
                {platformObj?.icon}
                <input
                  value={link.url}
                  onChange={e => { setSocialLinks(links => links.map((l, i) => i === idx ? { ...l, url: e.target.value } : l)); saveFullBusinessProfile(); }}
                  onBlur={() => setEditingSocialIdx(null)}
                  autoFocus
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
                />
                <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => { setSocialLinks(links => links.filter((_, i) => i !== idx)); saveFullBusinessProfile(); }} />
              </div>
            ) : (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320, cursor: 'pointer' }} onClick={() => setEditingSocialIdx(idx)}>
                {platformObj?.icon}
                <span style={{ color: '#fff', fontSize: '1.1rem', flex: 1 }}>{link.url}</span>
                <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setSocialLinks(links => links.filter((_, i) => i !== idx)); saveFullBusinessProfile(); }} />
              </div>
            );
          })}
          {addSocialMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 320 }}>
              <select
                value={newSocial.platform}
                onChange={e => { setNewSocial(s => ({ ...s, platform: e.target.value })); }}
                style={{ background: 'transparent', color: '#fff', border: '1.5px solid #e3e8f0', borderRadius: 8, padding: '0.4rem 1rem', minWidth: 110 }}
              >
                <option value="" disabled>Select platform</option>
                {socialPlatforms.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <input
                placeholder="Enter link"
                value={newSocial.url}
                onChange={e => { setNewSocial(s => ({ ...s, url: e.target.value })); }}
                style={{ flex: 1, background: 'transparent', border: '1.5px solid #e3e8f0', color: '#fff', borderRadius: 8, padding: '0.4rem 1rem', fontSize: '1.1rem' }}
              />
              <button
                type="button"
                className="button button-contained"
                style={{ height: 36, fontSize: '1rem', marginLeft: 4 }}
                onClick={() => {
                  if (newSocial.platform && newSocial.url) {
                    setSocialLinks(links => [...links, newSocial]);
                    setNewSocial({ platform: '', url: '' });
                    setAddSocialMode(false);
                    saveFullBusinessProfile({ socialLinks: [...socialLinks, newSocial] });
                  }
                }}
              >Save</button>
            </div>
          ) : (
            <button type="button" className="button" style={{ background: 'rgba(60,72,132,0.18)', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: 8, marginTop: 4, width: 'fit-content' }} onClick={() => setAddSocialMode(true)}>
              Add Social Link +
            </button>
          )}
        </div>
        <h3>Branch Locations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {locations.map((loc, idx) => (
            editingLocationIdx === idx ? (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320 }}>
                <input
                  value={loc}
                  onChange={e => { setLocations(locs => locs.map((l, i) => i === idx ? e.target.value : l)); saveFullBusinessProfile(); }}
                  onBlur={() => setEditingLocationIdx(null)}
                  autoFocus
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
                />
                <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => { setLocations(locs => locs.filter((_, i) => i !== idx)); saveFullBusinessProfile(); }} />
              </div>
            ) : (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320, cursor: 'pointer' }} onClick={() => setEditingLocationIdx(idx)}>
                <span style={{ color: '#fff', fontSize: '1.1rem', flex: 1 }}>{loc}</span>
                <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLocations(locs => locs.filter((_, i) => i !== idx)); saveFullBusinessProfile(); }} />
              </div>
            )
          ))}
          {addLocationMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 320 }}>
              <input
                placeholder="Enter location"
                value={newLocation}
                onChange={e => { setNewLocation(e.target.value); }}
                style={{ flex: 1, background: 'transparent', border: '1.5px solid #e3e8f0', color: '#fff', borderRadius: 8, padding: '0.4rem 1rem', fontSize: '1.1rem' }}
              />
              <button
                type="button"
                className="button button-contained"
                style={{ height: 36, fontSize: '1rem', marginLeft: 4 }}
                onClick={() => {
                  if (newLocation) {
                    setLocations(locs => [...locs, newLocation]);
                    setNewLocation('');
                    setAddLocationMode(false);
                    saveFullBusinessProfile({ locations: [...locations, newLocation] });
                  }
                }}
              >Save</button>
            </div>
          ) : (
            <button type="button" className="button" style={{ background: 'rgba(60,72,132,0.18)', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', borderRadius: 8, marginTop: 4, width: 'fit-content' }} onClick={() => setAddLocationMode(true)}>
              Add Location +
            </button>
          )}
        </div>
        <h3>Business Hours by Location</h3>
        <LongTextInput label="Business Hours" value="NY: 9-5, London: 8-4, Nairobi: 8-5" onChange={() => {}} />
      </form>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <Button variant="contained" color="primary" onClick={() => saveFullBusinessProfile()}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default SettingsProfileBusiness; 