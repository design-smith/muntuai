import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Avatar } from '@mui/material';
import { TextInput, LongTextInput } from '../components/BasicFormElements';
import { CheckboxGroup, RadioGroup, Switch } from '../components/SelectionElements';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Box as MuiBox } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import { AssistantCard } from '../components/CardElements';
import { Tabs as MuiTabs, Tab as MuiTab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import Autocomplete from '@mui/material/Autocomplete';
import industries from '../assets/industries.json';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Slider from '@mui/material/Slider';
import SettingsGeneral from '../components/SettingsGeneral';
import SettingsBilling from '../components/SettingsBilling';
import SettingsSecurity from '../components/SettingsSecurity';
import SettingsIntegrations from '../components/SettingsIntegrations';
import SettingsAssistants from '../components/SettingsAssistants';
import SettingsProfile from '../components/SettingsProfile';
import SettingsConversations from '../components/SettingsConversations';
import { useUser } from '../App';

const SETTINGS_SECTIONS = [
  { label: 'General', value: 'general' },
  { label: 'Billing', value: 'billing' },
  { label: 'Security', value: 'security' },
  { label: 'Integrations', value: 'integrations' },
  { label: 'Assistants', value: 'assistants' },
  { label: 'Profile', value: 'profile' },
  { label: 'Conversations', value: 'conversations' },
];

const Settings = () => {
  const [selected, setSelected] = useState('general');
  // General settings state
  const [email] = useState('');
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  // const [language, setLanguage] = useState('en');
  // const [currency, setCurrency] = useState('USD');
  const [dataProtection, setDataProtection] = useState(false);
  const [integrationModal, setIntegrationModal] = useState({ open: false, type: null });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethods, setTwoFAMethods] = useState([
    { id: 1, name: 'SMS', value: '+1••• ••••45', selected: true },
    { id: 2, name: 'Email', value: 'z***@example.com', selected: false },
  ]);
  const handleSelectMethod = (id) => {
    setTwoFAMethods(methods => methods.map(m => ({ ...m, selected: m.id === id })));
  };
  const handleAddMethod = () => {};

  // const languageOptions = [
  //   { label: 'English', value: 'en' },
  //   { label: 'French', value: 'fr' },
  //   { label: 'Spanish', value: 'es' },
  // ];
  // const currencyOptions = [
  //   { label: 'USD ($)', value: 'USD' },
  //   { label: 'EUR (€)', value: 'EUR' },
  //   { label: 'KES (Ksh)', value: 'KES' },
  // ];

  // Static integration data
  const integrationTypes = [
    {
      key: 'email',
      title: 'Email Provider',
      desc: 'Connect your email service for sending and receiving messages',
      icon: <EmailOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Gmail', desc: 'Connect your Google Mail account', icon: <EmailOutlinedIcon color="error" /> },
        { name: 'Outlook', desc: 'Connect your Outlook account', icon: <EmailOutlinedIcon color="primary" /> },
      ],
      connected: [],
    },
    {
      key: 'calendar',
      title: 'Calendar',
      desc: 'Sync your appointments and scheduling',
      icon: <CalendarMonthOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Google Calendar', desc: 'Connect your Google Calendar', icon: <CalendarMonthOutlinedIcon color="primary" /> },
        { name: 'Outlook Calendar', desc: 'Connect your Outlook Calendar', icon: <CalendarMonthOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'crm',
      title: 'CRM Connections',
      desc: 'Connect your CRM tools',
      icon: <BusinessCenterOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Salesforce', desc: 'Connect Salesforce', icon: <BusinessCenterOutlinedIcon color="primary" /> },
        { name: 'HubSpot', desc: 'Connect HubSpot', icon: <BusinessCenterOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'payment',
      title: 'Payment Processing',
      desc: 'Connect payment providers',
      icon: <PaymentOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Stripe', desc: 'Connect Stripe', icon: <PaymentOutlinedIcon color="primary" /> },
        { name: 'PayPal', desc: 'Connect PayPal', icon: <PaymentOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'social',
      title: 'Social Media',
      desc: 'Connect your social channels',
      icon: <ChatOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'WhatsApp', desc: 'Connect WhatsApp', icon: <ChatOutlinedIcon color="success" /> },
        { name: 'Messenger', desc: 'Connect Messenger', icon: <ChatOutlinedIcon color="primary" /> },
        { name: 'LinkedIn', desc: 'Connect LinkedIn', icon: <ChatOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
    {
      key: 'phone',
      title: 'Phone/SMS',
      desc: 'Connect or generate a phone number',
      icon: <PhoneIphoneOutlinedIcon className="integration-icon" />,
      providers: [
        { name: 'Custom Number', desc: 'Connect your own number', icon: <PhoneIphoneOutlinedIcon color="primary" /> },
        { name: 'Generate New', desc: 'Generate a new number', icon: <PhoneIphoneOutlinedIcon color="action" /> },
      ],
      connected: [],
    },
  ];

  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleOpenModal = (type) => {
    setSelectedIntegration(type);
    setIntegrationModal({ open: true, type });
  };
  const handleCloseModal = () => {
    setIntegrationModal({ open: false, type: null });
    setSelectedIntegration(null);
  };

  // Assistants backend-driven state
  const [assistants, setAssistants] = useState([]);
  const [loadingAssistants, setLoadingAssistants] = useState(false);
  const [assistantError, setAssistantError] = useState('');

  // Fetch assistants from backend on load and when accessToken changes
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    const fetchAssistants = async () => {
      setLoadingAssistants(true);
      setAssistantError('');
      try {
        const res = await fetch('http://localhost:8000/assistants', {
          headers: { 'Authorization': `Bearer ${user.accessToken}` },
        });
        const data = await res.json();
        setAssistants(data.assistants || []);
      } catch {
        setAssistantError('Failed to load assistants');
      } finally {
        setLoadingAssistants(false);
      }
    };
    fetchAssistants();
  }, [user]);

  // Add, edit, delete logic using backend
  const handleSaveAssistant = async () => {
    const selectedResponsibilities = responsibilityOptions.filter(opt => assistantForm.responsibilities[opt.value]).map(opt => opt.value);
    const selectedChannels = channelOptions.filter(opt => assistantForm.channels[opt.value]).map(opt => opt.value);
    const payload = {
      name: assistantForm.name,
      type: assistantForm.type,
      isActive: assistantForm.isActive,
      responsibilities: selectedResponsibilities,
      instructions: assistantForm.instructions,
      respondAsMe: assistantForm.respondAsMe,
      channels: selectedChannels,
    };
    setAssistantError('');
    try {
      if (assistantModal.mode === 'edit') {
        const id = assistants[assistantModal.idx]._id;
        await fetch(`http://localhost:8000/assistants/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://localhost:8000/assistants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      }
      // Refresh assistants
      const res = await fetch('http://localhost:8000/assistants', {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      });
      const data = await res.json();
      setAssistants(data.assistants || []);
      closeAssistantModal();
    } catch {
      setAssistantError('Failed to save assistant');
    }
  };

  const handleDeleteAssistant = async (idx) => {
    setAssistantError('');
    try {
      const id = assistants[idx]._id;
      await fetch(`http://localhost:8000/assistants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      });
      // Refresh assistants
      const res = await fetch('http://localhost:8000/assistants', {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      });
      const data = await res.json();
      setAssistants(data.assistants || []);
    } catch {
      setAssistantError('Failed to delete assistant');
    }
  };

  // Profile tab state
  const [profileTab, setProfileTab] = useState('business');
  const [businessLogo, setBusinessLogo] = useState('/logo192.png');
  const [editingName, setEditingName] = useState(false);
  const [businessName, setBusinessName] = useState('Muntu AI');
  const [industry, setIndustry] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [companyDescription, setCompanyDescription] = useState('We build modern web apps.');
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [companyEmail, setCompanyEmail] = useState('info@acme.com');
  const [companyPhone, setCompanyPhone] = useState('+1 555-1234');
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBusinessLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Billing plans static data
  const [billYearly, setBillYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: '/month',
      description: 'Get started for free. Limited features.',
      features: [
        '1 user account',
        'Email channel only',
        '100 emails',
        'No phone or social media',
        '1GB communication storage',
      ],
    },
    {
      name: 'Pro Plan',
      price: 50,
      period: '/month',
      description: 'Perfect for individual professionals.',
      features: [
        '1 user account',
        'All Channels Included: Phone, Email, SMS, Social Media',
        '500 emails',
        '1000 call minutes',
        'Unlimited Social Media Messaging',
        '10GB communication storage',
      ],
    },
    {
      name: 'Pro Plan',
      price: 120,
      period: '/month',
      description: 'Growing businesses and teams',
      features: [
        '3 AI assistants (Both customer support and sales)',
        '3 user accounts included',
        '2,000 emails',
        '3000 call minutes',
        'Unlimited Social Media Messaging',
        '80GB communication storage',
      ],
    },
  ];
  const getPlanPrice = (plan) => {
    if (plan.price === 0) return 'Free';
    const price = billYearly ? Math.round(plan.price * 0.9) : plan.price;
    return `$${price}`;
  };

  // Payment methods static data
  // const [paymentMethods, setPaymentMethods] = useState([
  //   { brand: 'visa', last4: '1234', exp: '06/2024', default: true },
  //   { brand: 'mastercard', last4: '1234', exp: '06/2024', default: false },
  // ]);
  // const handleSetDefault = idx => {
  //   setPaymentMethods(methods => methods.map((m, i) => ({ ...m, default: i === idx })));
  // };
  // const handleAddNew = () => {};

  // Add after paymentMethods and before return
  // const invoiceHistory = [
  //   { date: '2024-06-01', number: 'INV-1001', amount: '$50.00', status: 'Paid', url: '#' },
  //   { date: '2024-05-01', number: 'INV-1000', amount: '$50.00', status: 'Paid', url: '#' },
  //   { date: '2024-04-01', number: 'INV-0999', amount: '$50.00', status: 'Paid', url: '#' },
  // ];

  // Add after twoFAEnabled state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const socialPlatforms = [
    { label: 'LinkedIn', value: 'linkedin', icon: <LinkedInIcon style={{ fontSize: 24 }} /> },
    { label: 'Twitter', value: 'twitter', icon: <TwitterIcon style={{ fontSize: 24 }} /> },
    { label: 'Facebook', value: 'facebook', icon: <FacebookIcon style={{ fontSize: 24 }} /> },
    { label: 'Instagram', value: 'instagram', icon: <InstagramIcon style={{ fontSize: 24 }} /> },
  ];
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'linkedin', url: 'linkedin.com/in/nathan-gandawa/' },
  ]);
  const [editingSocialIdx, setEditingSocialIdx] = useState(null);
  const [addSocialMode, setAddSocialMode] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

  const [locations, setLocations] = useState(['New York', 'London', 'Nairobi']);
  const [editingLocationIdx, setEditingLocationIdx] = useState(null);
  const [addLocationMode, setAddLocationMode] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  // Add state for personal info
  const [editingPersonalName, setEditingPersonalName] = useState(false);
  const [editingPersonalTitle, setEditingPersonalTitle] = useState(false);
  const [editingPersonalEmail, setEditingPersonalEmail] = useState(false);
  const [editingPersonalPhone, setEditingPersonalPhone] = useState(false);
  const [personalName, setPersonalName] = useState('Zeke G.');
  const [personalTitle, setPersonalTitle] = useState('Founder');
  const [personalEmail, setPersonalEmail] = useState('zeke@acme.com');
  const [personalPhone, setPersonalPhone] = useState('+1 555-5678');

  const pricingTypes = [
    'Fixed Price',
    'Hourly Rate',
    'Quoted Price',
    'Negotiable',
  ];
  const [products, setProducts] = useState([
    { name: 'AI Phone Assistant', description: 'Intelligent virtual assistant for phone calls', pricingType: 'Fixed Price', price: '99.99' },
    { name: 'Email Management System', description: 'Smart email handling with AI-powered responses', pricingType: 'Communication', price: '' },
  ]);
  const [productModal, setProductModal] = useState({ open: false, idx: null });
  const [productForm, setProductForm] = useState({ name: '', description: '', pricingType: 'Fixed Price', price: '' });

  const [autoResponse, setAutoResponse] = useState(false);
  const [emailSearchRange, setEmailSearchRange] = useState(30);

  const notificationOptions = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Push', value: 'push' },
  ];

  const [assistantModal, setAssistantModal] = useState({ open: false, mode: 'edit', idx: null });
  const [assistantForm, setAssistantForm] = useState({
    name: '',
    type: 'General',
    isActive: true,
    responsibilities: {},
    instructions: '',
    respondAsMe: false,
    channels: {},
  });

  const responsibilityOptions = [
    { label: 'Read and respond to emails', value: 'Read and respond to emails' },
    { label: 'Schedule meetings and appointments', value: 'Schedule meetings and appointments' },
    { label: 'Follow up with clients and leads', value: 'Follow up with clients and leads' },
    { label: 'Draft email responses for your review', value: 'Draft email responses for your review' },
    { label: 'Summarize long email threads', value: 'Summarize long email threads' },
  ];
  const typeOptions = [
    { label: 'General', value: 'General' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Customer Support', value: 'Customer Support' },
  ];
  const channelOptions = [
    { label: 'email', value: 'email' },
    { label: 'sms', value: 'sms' },
    { label: 'phone', value: 'phone' },
    { label: 'whatsapp', value: 'whatsapp' },
    { label: 'messenger', value: 'messenger' },
    { label: 'linkedin', value: 'linkedin' },
  ];

  const openEditModal = (idx) => {
    const a = assistants[idx];
    setAssistantForm({
      name: a.name,
      type: a.type,
      isActive: a.isActive,
      responsibilities: Object.fromEntries(responsibilityOptions.map(opt => [opt.value, a.responsibilities.includes(opt.value)])),
      instructions: a.instructions,
      respondAsMe: a.respondAsMe,
      channels: Object.fromEntries(channelOptions.map(opt => [opt.value, a.channels.includes(opt.value)])),
    });
    setAssistantModal({ open: true, mode: 'edit', idx });
  };
  const openAddModal = () => {
    setAssistantForm({
      name: '',
      type: 'General',
      isActive: true,
      responsibilities: {},
      instructions: '',
      respondAsMe: false,
      channels: {},
    });
    setAssistantModal({ open: true, mode: 'add', idx: null });
  };
  const closeAssistantModal = () => setAssistantModal({ open: false, mode: 'edit', idx: null });

  const handleAssistantFormChange = (field, value) => {
    setAssistantForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleResponsibilitiesChange = (e) => {
    setAssistantForm((prev) => ({ ...prev, responsibilities: { ...prev.responsibilities, [e.target.name]: e.target.checked } }));
  };
  const handleChannelsChange = (e) => {
    setAssistantForm((prev) => ({ ...prev, channels: { ...prev.channels, [e.target.name]: e.target.checked } }));
  };

  return (  
      <Box className="settings-page-root">
        <Box className="settings-menu">
          <Tabs
            orientation="vertical"
            value={selected}
            onChange={(_, v) => setSelected(v)}
            className="settings-tabs"
          >
            {SETTINGS_SECTIONS.map((section) => (
              <Tab
                key={section.value}
                label={section.label}
                value={section.value}
                className="settings-tab"
              />
            ))}
          </Tabs>
        </Box>
        <Box className="settings-content">
          {selected === 'general' ? (
            <SettingsGeneral
              email={email}
              notifications={notifications}
              notificationOptions={notificationOptions}
              handleNotificationChange={handleNotificationChange}
            />
          ) : selected === 'billing' ? (
            <SettingsBilling
              billYearly={billYearly}
              setBillYearly={setBillYearly}
              plans={plans}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              getPlanPrice={getPlanPrice}
              user={user}
            />
          ) : selected === 'security' ? (
            <SettingsSecurity
              twoFAEnabled={twoFAEnabled}
              setTwoFAEnabled={setTwoFAEnabled}
              twoFAMethods={twoFAMethods}
              handleSelectMethod={handleSelectMethod}
              handleAddMethod={handleAddMethod}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              dataProtection={dataProtection}
              setDataProtection={setDataProtection}
            />
          ) : selected === 'integrations' ? (
            <SettingsIntegrations
              integrationTypes={integrationTypes}
              handleOpenModal={handleOpenModal}
              integrationModal={integrationModal}
              handleCloseModal={handleCloseModal}
              selectedIntegration={selectedIntegration}
            />
          ) : selected === 'assistants' ? (
            <SettingsAssistants
              assistants={assistants}
              setAssistants={setAssistants}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              assistantModal={assistantModal}
              closeAssistantModal={closeAssistantModal}
              assistantForm={assistantForm}
              handleAssistantFormChange={handleAssistantFormChange}
              responsibilityOptions={responsibilityOptions}
              handleResponsibilitiesChange={handleResponsibilitiesChange}
              typeOptions={typeOptions}
              channelOptions={channelOptions}
              handleChannelsChange={handleChannelsChange}
              handleSaveAssistant={handleSaveAssistant}
              handleDeleteAssistant={handleDeleteAssistant}
              loading={loadingAssistants}
              error={assistantError}
            />
          ) : selected === 'profile' ? (
            <SettingsProfile
              profileTab={profileTab}
              setProfileTab={setProfileTab}
              businessLogo={businessLogo}
              handleLogoUpload={handleLogoUpload}
              editingName={editingName}
              setEditingName={setEditingName}
              businessName={businessName}
              setBusinessName={setBusinessName}
              industry={industry}
              setIndustry={setIndustry}
              industries={industries}
              editingDescription={editingDescription}
              setEditingDescription={setEditingDescription}
              companyDescription={companyDescription}
              setCompanyDescription={setCompanyDescription}
              editingEmail={editingEmail}
              setEditingEmail={setEditingEmail}
              companyEmail={companyEmail}
              setCompanyEmail={setCompanyEmail}
              editingPhone={editingPhone}
              setEditingPhone={setEditingPhone}
              companyPhone={companyPhone}
              setCompanyPhone={setCompanyPhone}
              socialPlatforms={socialPlatforms}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              editingSocialIdx={editingSocialIdx}
              setEditingSocialIdx={setEditingSocialIdx}
              addSocialMode={addSocialMode}
              setAddSocialMode={setAddSocialMode}
              newSocial={newSocial}
              setNewSocial={setNewSocial}
              locations={locations}
              setLocations={setLocations}
              editingLocationIdx={editingLocationIdx}
              setEditingLocationIdx={setEditingLocationIdx}
              addLocationMode={addLocationMode}
              setAddLocationMode={setAddLocationMode}
              newLocation={newLocation}
              setNewLocation={setNewLocation}
              editingPersonalName={editingPersonalName}
              setEditingPersonalName={setEditingPersonalName}
              editingPersonalTitle={editingPersonalTitle}
              setEditingPersonalTitle={setEditingPersonalTitle}
              editingPersonalEmail={editingPersonalEmail}
              setEditingPersonalEmail={setEditingPersonalEmail}
              editingPersonalPhone={editingPersonalPhone}
              setEditingPersonalPhone={setEditingPersonalPhone}
              personalName={personalName}
              setPersonalName={setPersonalName}
              personalTitle={personalTitle}
              setPersonalTitle={setPersonalTitle}
              personalEmail={personalEmail}
              setPersonalEmail={setPersonalEmail}
              personalPhone={personalPhone}
              setPersonalPhone={setPersonalPhone}
              products={products}
              setProducts={setProducts}
              productModal={productModal}
              setProductModal={setProductModal}
              productForm={productForm}
              setProductForm={setProductForm}
              pricingTypes={pricingTypes}
            />
          ) : selected === 'conversations' ? (
            <SettingsConversations
              autoResponse={autoResponse}
              setAutoResponse={setAutoResponse}
              emailSearchRange={emailSearchRange}
              setEmailSearchRange={setEmailSearchRange}
            />
          ) : (
            <>
              <h2>{SETTINGS_SECTIONS.find(s => s.value === selected).label}</h2>
              <div>Settings content for {SETTINGS_SECTIONS.find(s => s.value === selected).label}.</div>
            </>
          )}
        </Box>
      </Box>
  );
};

export default Settings; 