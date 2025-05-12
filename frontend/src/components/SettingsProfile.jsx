import React from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box as MuiBox } from '@mui/material';
import { TextInput, LongTextInput } from './BasicFormElements';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const SettingsProfile = ({
  profileTab,
  setProfileTab,
  businessLogo,
  handleLogoUpload,
  editingName,
  setEditingName,
  businessName,
  setBusinessName,
  industry,
  setIndustry,
  industries,
  editingDescription,
  setEditingDescription,
  companyDescription,
  setCompanyDescription,
  editingEmail,
  setEditingEmail,
  companyEmail,
  setCompanyEmail,
  editingPhone,
  setEditingPhone,
  companyPhone,
  setCompanyPhone,
  socialPlatforms,
  socialLinks,
  setSocialLinks,
  editingSocialIdx,
  setEditingSocialIdx,
  addSocialMode,
  setAddSocialMode,
  newSocial,
  setNewSocial,
  locations,
  setLocations,
  editingLocationIdx,
  setEditingLocationIdx,
  addLocationMode,
  setAddLocationMode,
  newLocation,
  setNewLocation,
  editingPersonalName,
  setEditingPersonalName,
  editingPersonalTitle,
  setEditingPersonalTitle,
  editingPersonalEmail,
  setEditingPersonalEmail,
  editingPersonalPhone,
  setEditingPersonalPhone,
  personalName,
  setPersonalName,
  personalTitle,
  setPersonalTitle,
  personalEmail,
  setPersonalEmail,
  personalPhone,
  setPersonalPhone,
  products,
  setProducts,
  productModal,
  setProductModal,
  productForm,
  setProductForm,
  pricingTypes
}) => (
  <div className="settings-profile-root">
    <MuiTabs value={profileTab} onChange={(_, v) => setProfileTab(v)} className="settings-profile-tabs">
      <MuiTab label="Business" value="business" className="settings-profile-tab" />
      <MuiTab label="Personal" value="personal" className="settings-profile-tab" />
      <MuiTab label="Products" value="products" className="settings-profile-tab" />
    </MuiTabs>
    <div className="settings-profile-tab-content">
      {/* Business Tab */}
      {profileTab === 'business' && (
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
              <input type="file" accept="image/*" style={{ display: 'none' }} id="logo-upload" onChange={handleLogoUpload} />
              <label htmlFor="logo-upload" style={{ position: 'absolute', left: 70, top: 70, zIndex: 3, background: 'rgba(39,45,79,0.9)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '2px solid #232b3e', cursor: 'pointer' }}>
                <UploadIcon style={{ color: 'var(--desert-sand)' }} />
              </label>
            </div>
            <div>
              {editingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
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
            onChange={(_, v) => setIndustry(v || '')}
            renderInput={(params) => (
              <TextInput {...params} label="Industry" value={industry} onChange={e => setIndustry(e.target.value)} />
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
                onChange={e => setCompanyDescription(e.target.value)}
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
                  onChange={e => setCompanyEmail(e.target.value)}
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
                  onChange={e => setCompanyPhone(e.target.value)}
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
                    onChange={e => setSocialLinks(links => links.map((l, i) => i === idx ? { ...l, url: e.target.value } : l))}
                    onBlur={() => setEditingSocialIdx(null)}
                    autoFocus
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
                  />
                  <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => setSocialLinks(links => links.filter((_, i) => i !== idx))} />
                </div>
              ) : (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320, cursor: 'pointer' }} onClick={() => setEditingSocialIdx(idx)}>
                  {platformObj?.icon}
                  <span style={{ color: '#fff', fontSize: '1.1rem', flex: 1 }}>{link.url}</span>
                  <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setSocialLinks(links => links.filter((_, i) => i !== idx)); }} />
                </div>
              );
            })}
            {addSocialMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 320 }}>
                <select
                  value={newSocial.platform}
                  onChange={e => setNewSocial(s => ({ ...s, platform: e.target.value }))}
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
                  onChange={e => setNewSocial(s => ({ ...s, url: e.target.value }))}
                  style={{ flex: 1, background: 'transparent', border: '1.5px solid #e3e8f0', color: '#fff', borderRadius: 8, padding: '0.4rem 1rem', fontSize: '1.1rem' }}
                />
                <button
                  type="button"
                  className="button button-contained"
                  style={{ height: 36, fontSize: '1rem', marginLeft: 4 }}
                  onClick={() => {
                    if (newSocial.platform && newSocial.url) {
                      setSocialLinks(links => [...links, { ...newSocial }]);
                      setNewSocial({ platform: '', url: '' });
                      setAddSocialMode(false);
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
                    onChange={e => setLocations(locs => locs.map((l, i) => i === idx ? e.target.value : l))}
                    onBlur={() => setEditingLocationIdx(null)}
                    autoFocus
                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none' }}
                  />
                  <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={() => setLocations(locs => locs.filter((_, i) => i !== idx))} />
                </div>
              ) : (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e3e8f0', borderRadius: 12, padding: '0.7rem 1.2rem', background: 'transparent', gap: 10, minWidth: 320, cursor: 'pointer' }} onClick={() => setEditingLocationIdx(idx)}>
                  <span style={{ color: '#fff', fontSize: '1.1rem', flex: 1 }}>{loc}</span>
                  <CloseIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLocations(locs => locs.filter((_, i) => i !== idx)); }} />
                </div>
              )
            ))}
            {addLocationMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 320 }}>
                <input
                  placeholder="Enter location"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
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
      )}
      {/* Personal Tab */}
      {profileTab === 'personal' && (
        <form className="settings-profile-form">
          <h3>Name</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {editingPersonalName ? (
              <TextInput
                label="Full Name"
                value={personalName}
                onChange={e => setPersonalName(e.target.value)}
                onBlur={() => setEditingPersonalName(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalName(false); } }}
                style={{ minWidth: 180 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.18rem', fontWeight: 700 }}>{personalName}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 20 }} onClick={() => setEditingPersonalName(true)} />
              </>
            )}
          </div>
          <h3>Title</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {editingPersonalTitle ? (
              <TextInput
                label="Title"
                value={personalTitle}
                onChange={e => setPersonalTitle(e.target.value)}
                onBlur={() => setEditingPersonalTitle(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalTitle(false); } }}
                style={{ minWidth: 120 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalTitle}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalTitle(true)} />
              </>
            )}
          </div>
          <h3>Email</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {editingPersonalEmail ? (
              <TextInput
                label="Email"
                value={personalEmail}
                onChange={e => setPersonalEmail(e.target.value)}
                onBlur={() => setEditingPersonalEmail(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalEmail(false); } }}
                style={{ minWidth: 180 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalEmail}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalEmail(true)} />
              </>
            )}
          </div>
          <h3>Phone</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {editingPersonalPhone ? (
              <TextInput
                label="Phone"
                value={personalPhone}
                onChange={e => setPersonalPhone(e.target.value)}
                onBlur={() => setEditingPersonalPhone(false)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditingPersonalPhone(false); } }}
                style={{ minWidth: 120 }}
              />
            ) : (
              <>
                <span style={{ color: '#fff', fontSize: '1.08rem' }}>{personalPhone}</span>
                <EditIcon style={{ color: 'var(--desert-sand)', cursor: 'pointer', fontSize: 18 }} onClick={() => setEditingPersonalPhone(true)} />
              </>
            )}
          </div>
        </form>
      )}
      {/* Products Tab */}
      {profileTab === 'products' && (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2 style={{ marginBottom: 0 }}>Products & Services</h2>
              <div style={{ color: 'var(--bone)', fontSize: '1.08rem', marginTop: 2 }}>Manage your offerings</div>
            </div>
            <button className="button button-contained" style={{ fontWeight: 600, fontSize: '1rem', padding: '0.5rem 1.5rem' }} onClick={() => { setProductForm({ name: '', description: '', pricingType: 'Fixed Price', price: '' }); setProductModal({ open: true, idx: null }); }}>+ Add Product/Service</button>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
            {products.map((prod, idx) => (
              <div
                key={idx}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #2a2e3e',
                  borderRadius: 16,
                  minWidth: 340,
                  maxWidth: 420,
                  flex: '1 1 340px',
                  padding: '1.2rem 1.5rem 1.2rem 1.5rem',
                  position: 'relative',
                  transition: 'box-shadow 0.18s',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  marginBottom: 24,
                  overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.classList.add('hovered')}
                onMouseLeave={e => e.currentTarget.classList.remove('hovered')}
              >
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff', marginBottom: 8 }}>{prod.name}</div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ background: 'rgba(60,72,132,0.18)', color: '#fff', borderRadius: 16, padding: '0.2em 1em', fontSize: '0.98rem', fontWeight: 600 }}>{prod.pricingType}</span>
                </div>
                <div style={{ color: '#fff', fontSize: '1.05rem', minHeight: 32, marginBottom: 16 }}>{prod.description}</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'absolute', bottom: 16, right: 24, opacity: 0, transition: 'opacity 0.18s', pointerEvents: 'none' }} className="product-card-actions">
                  <EditOutlinedIcon style={{ color: '#bdbdbd', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setProductForm(prod); setProductModal({ open: true, idx }); }} />
                  <DeleteOutlineIcon style={{ color: '#ff5252', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setProducts(ps => ps.filter((_, i) => i !== idx)); }} />
                </div>
                <style>{`
                  div:hover > .product-card-actions { opacity: 1 !important; pointer-events: auto !important; }
                `}</style>
              </div>
            ))}
          </div>
          {productModal.open && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,20,26,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#181e36', borderRadius: 18, minWidth: 420, maxWidth: 520, padding: '2.2rem 2.2rem 1.2rem 2.2rem', boxShadow: '0 4px 32px 0 rgba(39,45,79,0.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>{productModal.idx === null ? 'Add Product' : 'Edit Product'}</div>
                  <CloseIcon style={{ color: '#bdbdbd', cursor: 'pointer' }} onClick={() => setProductModal({ open: false, idx: null })} />
                </div>
                <div style={{ color: 'var(--bone)', fontSize: '1.08rem', marginBottom: 18 }}>Update the details of your product or service</div>
                <form onSubmit={e => { e.preventDefault(); if (productModal.idx === null) { setProducts(ps => [...ps, productForm]); } else { setProducts(ps => ps.map((p, i) => i === productModal.idx ? productForm : p)); } setProductModal({ open: false, idx: null }); }}>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>Name</div>
                    <input
                      value={productForm.name}
                      onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(39,45,79,0.7)', border: '1.5px solid #2a2e3e', borderRadius: 10, color: '#fff', fontSize: '1.08rem', padding: '0.7rem 1.2rem', marginBottom: 0 }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>Description</div>
                    <textarea
                      value={productForm.description}
                      onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(39,45,79,0.7)', border: '1.5px solid #2a2e3e', borderRadius: 10, color: '#fff', fontSize: '1.08rem', padding: '0.7rem 1.2rem', minHeight: 70, resize: 'vertical' }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 18, display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>Pricing Type</div>
                      <select
                        value={productForm.pricingType}
                        onChange={e => setProductForm(f => ({ ...f, pricingType: e.target.value, price: e.target.value === 'Quoted Price' ? '' : f.price }))}
                        style={{ width: '100%', background: 'rgba(39,45,79,0.7)', border: '1.5px solid #2a2e3e', borderRadius: 10, color: '#fff', fontSize: '1.08rem', padding: '0.7rem 1.2rem' }}
                        required
                      >
                        {pricingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    {productForm.pricingType !== 'Quoted Price' && (
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>Price</div>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                          style={{ width: '100%', background: 'rgba(39,45,79,0.7)', border: '1.5px solid #2a2e3e', borderRadius: 10, color: '#fff', fontSize: '1.08rem', padding: '0.7rem 1.2rem' }}
                          min="0"
                          step="0.01"
                          required={productForm.pricingType !== 'Negotiable'}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
                    <button type="button" className="button button-outlined" style={{ minWidth: 100 }} onClick={() => setProductModal({ open: false, idx: null })}>Cancel</button>
                    <button type="submit" className="button button-contained" style={{ minWidth: 140 }}>{productModal.idx === null ? 'Add Product' : 'Update Product'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default SettingsProfile; 