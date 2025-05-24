import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Typography,
  Radio,
  IconButton
} from '@mui/material';
import { Switch } from '../components/SelectionElements';
import { DataGrid } from '@mui/x-data-grid';
import { 
  CardElement, 
  useStripe, 
  useElements, 
  Elements 
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import visaLogo from '../assets/visa.svg';
import mastercardLogo from '../assets/mastercard.svg';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Initialize Stripe
const stripePromise = loadStripe('your_publishable_key'); // Replace with your actual key

// Payment Method Form Component with Stripe Elements
const AddPaymentMethodForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    const cardElement = elements.getElement(CardElement);
    
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        setError(error.message);
      } else {
        onSuccess(paymentMethod);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Box className="settings-payment-method-card">
      <form onSubmit={handleSubmit} className="settings-payment-method-add-form">
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--orange-crayola)' }}>
          Add New Payment Method
        </Typography>
        
        <Box sx={{ mb: 2, p: 2, borderRadius: '8px', backgroundColor: 'rgba(39, 45, 79, 0.9)' }}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  fontFamily: '"Open Sans", system-ui, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#FF7125',
                },
              },
            }}
          />
        </Box>
        
        {error && (
          <Box sx={{ 
            color: '#FF7125', 
            mb: 1.5, 
            p: 1, 
            borderRadius: '4px', 
            backgroundColor: 'rgba(255, 113, 37, 0.1)' 
          }}>
            {error}
          </Box>
        )}
        
        <Box className="settings-payment-method-actions">
          <Button 
            onClick={onCancel} 
            className="settings-payment-method-action"
            disabled={isProcessing}
            variant="outlined"
            sx={{ 
              color: 'var(--bone)', 
              borderColor: 'var(--marian-blue)',
              mr: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isProcessing || !stripe} 
            className="settings-payment-method-action button button-contained"
            variant="contained"
            sx={{ backgroundColor: 'var(--orange-crayola)' }}
          >
            {isProcessing ? 'Processing...' : 'Add Payment Method'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const SettingsBilling = ({
  billYearly,
  setBillYearly,
  plans,
  selectedPlan,
  setSelectedPlan,
  getPlanPrice,
  user,
  accessToken
}) => {
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [settingDefault, setSettingDefault] = useState(null); // index of card being set as default

  // Fetch billing data on mount
  const fetchBilling = async () => {
    if (!user?.id || !accessToken) return;
    setLoading(true);
    setError(null);
    try {
      // Plan (not used directly, but could be used for current plan info)
      await fetch('http://localhost:8000/billing/plan', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      // Payment Methods
      const pmRes = await fetch('http://localhost:8000/billing/payment-methods', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const pmData = await pmRes.json();
      setPaymentMethods(pmData.payment_methods || []);
      // Invoices
      const invRes = await fetch('http://localhost:8000/billing/invoices', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const invData = await invRes.json();
      setInvoices(invData.invoices || []);
    } catch (err) {
      setError(err.message || 'Failed to load billing data.');
    }
    setLoading(false);
  };
  useEffect(() => { fetchBilling(); /* eslint-disable-next-line */ }, [user?.id, accessToken]);

  // Add payment method
  const handlePaymentMethodSuccess = async (paymentMethod) => {
    if (!user?.id || !accessToken) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fetch('http://localhost:8000/billing/payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ payment_method_id: paymentMethod.id, user_id: user.id })
      });
      setSuccess('Payment method added!');
      await fetchBilling();
    } catch (err) {
      setError(err.message || 'Failed to add payment method.');
    }
    setShowAddPaymentForm(false);
    setLoading(false);
  };

  // Remove payment method
  const handleRemovePaymentMethod = async (idx) => {
    if (!user?.id || !accessToken) return;
    const pm = paymentMethods[idx];
    if (!pm?.id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fetch(`http://localhost:8000/billing/payment-method/${pm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setSuccess('Payment method removed.');
      await fetchBilling();
    } catch (err) {
      setError(err.message || 'Failed to remove payment method.');
    }
    setLoading(false);
  };

  // Set default payment method
  const handleSetDefault = async (idx) => {
    if (!user?.id || !accessToken) return;
    const pm = paymentMethods[idx];
    if (!pm?.id) return;
    setSettingDefault(idx);
    setError(null);
    setSuccess(null);
    try {
      await fetch('http://localhost:8000/billing/set-default-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ payment_method_id: pm.id })
      });
      setSuccess('Default payment method updated.');
      await fetchBilling();
    } catch (err) {
      setError(err.message || 'Failed to set default payment method.');
    }
    setSettingDefault(null);
  };

  // Upgrade/downgrade plan
  const handleUpgradePlan = async (planIdx) => {
    if (!user?.id || !accessToken) return;
    setUpgrading(true);
    setError(null);
    setSuccess(null);
    try {
      const plan = plans[planIdx];
      await fetch('http://localhost:8000/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ price_id: plan.stripe_price_id, user_id: user.id })
      });
      setSuccess('Plan updated!');
      await fetchBilling();
    } catch (err) {
      setError(err.message || 'Failed to update plan.');
    }
    setUpgrading(false);
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!user?.id || !accessToken) return;
    setCanceling(true);
    setError(null);
    setSuccess(null);
    try {
      await fetch('http://localhost:8000/billing/cancel', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setSuccess('Subscription canceled.');
      await fetchBilling();
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription.');
    }
    setCanceling(false);
  };

  // Prepare invoice data for DataGrid
  const invoiceRows = invoices.map((inv, index) => ({
    id: index,
    date: new Date(inv.created * 1000).toLocaleDateString(),
    number: inv.number,
    amount: `$${(inv.amount_paid / 100).toFixed(2)}`,
    status: inv.status,
    url: inv.invoice_pdf || '#'
  }));

  // DataGrid columns for invoice history
  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 130,
      headerClassName: 'settings-invoice-header',
    },
    { 
      field: 'number', 
      headerName: 'Invoice #', 
      width: 150,
      headerClassName: 'settings-invoice-header',
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 130,
      headerClassName: 'settings-invoice-header',
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      headerClassName: 'settings-invoice-header',
      renderCell: (params) => (
        <Box sx={{ 
          color: params.value === 'Paid' ? '#21a300' : 
                 params.value === 'Pending' ? '#FF7125' : 
                 'white'
        }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'download',
      headerName: '',
      width: 130,
      headerClassName: 'settings-invoice-header',
      renderCell: (params) => (
        <a 
          href={params.row.url} 
          download 
          className="settings-invoice-download"
          style={{
            color: 'var(--orange-crayola)',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          Download
        </a>
      ),
      sortable: false,
    },
  ];

  return (
    <Box className="page-container-inner">
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Typography variant="h4" sx={{ 
        mb: 3, 
        color: 'var(--orange-crayola)',
        fontFamily: '"Work Sans", sans-serif',
        fontWeight: 700
      }}>
        Billing
      </Typography>
      
      {/* Plans Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ 
          mb: 2, 
          color: 'var(--white)',
          fontFamily: '"Work Sans", sans-serif',
          fontWeight: 600
        }}>
          Plan & Usage
        </Typography>
        
        <Box className="settings-billing-plan-toggle-row" sx={{ mb: 3 }}>
          <Box className="settings-billing-plan-toggle-label" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="body1" sx={{ color: 'var(--bone)' }}>
              Bill yearly
            </Typography>
            <Switch 
              checked={billYearly}
              onChange={e => setBillYearly(e.target.checked)}
              className="settings-billing-plan-toggle"
              disabled={loading}
            />
            {billYearly && (
              <Typography variant="caption" sx={{ 
                color: 'var(--orange-crayola)', 
                ml: 1, 
                backgroundColor: 'rgba(255, 113, 37, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Save 20%
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box className="settings-billing-plans-row" >
          {plans.length === 0 ? (
            <Typography color="var(--bone)">No plans available.</Typography>
          ) : plans.map((plan, idx) => (
            <Box 
              key={idx} 
              className={`settings-billing-plan-card${selectedPlan === idx ? ' selected' : ''}`}
              onClick={() => setSelectedPlan(idx)}
              sx={{
                backgroundColor: selectedPlan === idx ? 'rgba(255, 113, 37, 0.08)' : 'rgba(39, 45, 79, 0.85)',
                borderRadius: 2,
                padding: 2.5,
                border: selectedPlan === idx ? '1px solid var(--orange-crayola)' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box className="settings-billing-plan-header-row" sx={{ mb: 1 }}>
                <Typography variant="h6" className="settings-billing-plan-name" sx={{ 
                  color: 'var(--orange-crayola)', 
                  fontWeight: 600 
                }}>
                  {plan.name}
                </Typography>
              </Box>
              
              <Box className="settings-billing-plan-price-row" sx={{ mb: 2 }}>
                <Typography 
                  variant="h4" 
                  className="settings-billing-plan-price" 
                  sx={{ color: 'var(--white)', fontWeight: 700 }}
                >
                  {getPlanPrice(plan)}
                </Typography>
                
                {plan.price !== 0 && (
                  <Typography 
                    variant="body2" 
                    className="settings-billing-plan-period" 
                    sx={{ color: 'var(--bone)', ml: 1 }}
                  >
                    {plan.period}
                  </Typography>
                )}
              </Box>
              
              <Typography 
                variant="body2" 
                className="settings-billing-plan-desc"
                sx={{ 
                  color: 'var(--bone)', 
                  mb: 2.5,
                  minHeight: '40px'
                }}
              >
                {plan.description}
              </Typography>
              
              {selectedPlan === idx ? (
                <Button 
                  className="settings-billing-plan-btn current" 
                  variant="contained"
                  disabled
                  fullWidth
                  sx={{ 
                    mb: 1,
                    backgroundColor: 'rgba(39, 45, 79, 0.5)',
                    color: 'var(--bone)',
                  }}
                >
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="settings-billing-plan-btn button button-contained" 
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mb: 1,
                    backgroundColor: 'var(--orange-crayola)',
                  }}
                  onClick={() => handleUpgradePlan(idx)}
                  disabled={
                    upgrading || loading || selectedPlan === idx ||
                    (idx < selectedPlan && selectedPlan === 0) || // Can't downgrade from free
                    (idx > selectedPlan && selectedPlan === plans.length - 1) // Can't upgrade from last
                  }
                >
                  {idx > selectedPlan ? 'Upgrade' : 'Downgrade'}
                </Button>
              )}
              
              <Typography 
                variant="caption" 
                className="settings-billing-plan-btn-caption"
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  color: 'var(--bone)',
                  opacity: 0.7,
                  mb: 2
                }}
              >
                per user
              </Typography>
              
              <Box 
                component="ul" 
                className="settings-billing-plan-features"
                sx={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  '& li': {
                    position: 'relative',
                    paddingLeft: '1.5rem',
                    marginBottom: '0.5rem',
                    color: 'var(--bone)',
                    fontSize: '0.9rem',
                    '&:before': {
                      content: '"✓"',
                      position: 'absolute',
                      left: 0,
                      color: 'var(--orange-crayola)',
                      fontWeight: 'bold'
                    }
                  }
                }}
              >
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Payment Methods Section */}
      <Box className="settings-billing-section" sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          className="settings-billing-title"
          sx={{ 
            mb: 2, 
            color: 'var(--white)',
            fontFamily: '"Work Sans", sans-serif',
            fontWeight: 600
          }}
        >
          Payment Methods
        </Typography>
        
        <Box className="settings-payment-methods-list" sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {paymentMethods.length === 0 ? (
            <Typography color="var(--bone)">No payment methods added yet.</Typography>
          ) : paymentMethods.map((pm, idx) => (
            <Box 
              key={idx} 
              className={`settings-payment-method-card${pm.default ? ' selected' : ''}`}
              sx={{
                backgroundColor: pm.default ? 'rgba(255, 113, 37, 0.08)' : 'rgba(39, 45, 79, 0.85)',
                borderRadius: 2,
                padding: 2,
                border: pm.default ? '1px solid var(--orange-crayola)' : '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
              }}
            >
              <Box 
                className="settings-payment-method-header"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {pm.brand === 'visa' && (
                    <img 
                      src={visaLogo} 
                      alt="Visa" 
                      className="settings-payment-method-logo visa-logo"
                      style={{ 
                        height: '24px',
                        marginRight: '12px'
                      }}
                    />
                  )}
                  {pm.brand === 'mastercard' && (
                    <img 
                      src={mastercardLogo} 
                      alt="Mastercard" 
                      className="settings-payment-method-logo mc-logo"
                      style={{ 
                        height: '24px',
                        marginRight: '12px'
                      }}
                    />
                  )}
                  <Typography 
                    variant="body1" 
                    className="settings-payment-method-title"
                    sx={{ color: 'var(--white)' }}
                  >
                    {pm.brand === 'visa' ? 'Visa' : pm.brand === 'mastercard' ? 'Mastercard' : 'Card'} ending in {pm.last4}
                  </Typography>
                  
                  {/* Badge for default card */}
                  {pm.default && (
                    <Box
                      sx={{
                        ml: 2,
                        backgroundColor: 'rgba(255, 113, 37, 0.7)',
                        color: 'white',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontWeight: 'bold'
                      }}
                    >
                      DEFAULT
                    </Box>
                  )}
                </Box>
                
                <Radio
                  checked={pm.default}
                  onChange={() => handleRemovePaymentMethod(idx)}
                  className="settings-payment-method-radio"
                  sx={{
                    '&.Mui-checked': {
                      color: 'var(--orange-crayola)',
                    },
                  }}
                />
              </Box>
              
              <Typography 
                variant="body2" 
                className="settings-payment-method-details"
                sx={{ 
                  color: 'var(--bone)',
                  mb: 1.5
                }}
              >
                Expiry {pm.exp}
              </Typography>
              
              <Box 
                className="settings-payment-method-actions"
                sx={{
                  display: 'flex',
                  gap: 1
                }}
              >
                {!pm.default && (
                  <Button 
                    className="settings-payment-method-action button button-outlined" 
                    onClick={() => handleSetDefault(idx)}
                    variant="outlined"
                    size="small"
                    disabled={settingDefault === idx || loading}
                    sx={{ 
                      color: 'var(--orange-crayola)',
                      borderColor: 'var(--orange-crayola)',
                    }}
                  >
                    {settingDefault === idx ? <CircularProgress size={16} sx={{ color: 'var(--orange-crayola)', mr: 1 }} /> : 'Set as default'}
                  </Button>
                )}
                <Button 
                  className="settings-payment-method-action button button-outlined" 
                  variant="outlined"
                  size="small"
                  sx={{ 
                    color: 'var(--bone)',
                    borderColor: 'var(--marian-blue)',
                  }}
                  disabled
                >
                  Edit
                </Button>
              </Box>
              
              {/* Delete Button */}
              {!pm.default && (
                <IconButton
                  aria-label="delete payment method"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePaymentMethod(idx);
                  }}
                  sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      color: 'var(--orange-crayola)'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          {/* Stripe Elements Integration for New Payment Method */}
          {showAddPaymentForm ? (
            <Elements stripe={stripePromise}>
              <AddPaymentMethodForm 
                onSuccess={handlePaymentMethodSuccess}
                onCancel={() => setShowAddPaymentForm(false)}
              />
            </Elements>
          ) : (
            <Button 
              className="settings-payment-method-add button button-outlined" 
              variant="outlined"
              onClick={() => setShowAddPaymentForm(true)}
              sx={{ 
                color: 'var(--orange-crayola)',
                borderColor: 'var(--marian-blue)',
                backgroundColor: 'rgba(39, 45, 79, 0.5)',
                borderStyle: 'dashed',
                borderWidth: '1px',
                padding: '12px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(39, 45, 79, 0.8)',
                  borderColor: 'var(--orange-crayola)',
                }
              }}
              disabled={loading}
            >
              + Add new payment method
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Invoice History Section - MUI X Data Grid */}
      <Box>
        <Typography 
          variant="h5" 
          className="settings-billing-title"
          sx={{ 
            mb: 2, 
            color: 'var(--white)',
            fontFamily: '"Work Sans", sans-serif',
            fontWeight: 600
          }}
        >
          Billing History & Invoices
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          {invoices.length === 0 ? (
            <Typography color="var(--bone)">No invoices found.</Typography>
          ) : (
            <DataGrid
              rows={invoiceRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
              sx={{
                backgroundColor: 'rgba(39, 45, 79, 0.5)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                '& .MuiDataGrid-cell': {
                  borderColor: 'rgba(255, 255, 255, 0.08)'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(39, 45, 79, 0.9)',
                  color: 'var(--orange-crayola)',
                  fontWeight: 600
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none'
                },
                '& .MuiDataGrid-menuIconButton': {
                  color: 'var(--white)'
                },
                '& .MuiDataGrid-sortIcon': {
                  color: 'var(--white)'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(255, 113, 37, 0.08)'
                },
                '& .MuiDataGrid-footer': {
                  color: 'var(--bone)',
                },
                '& .MuiTablePagination-root': {
                  color: 'var(--bone)',
                },
                '& .MuiTablePagination-actions button': {
                  color: 'var(--bone)',
                }
              }}
            />
          )}
        </Box>
      </Box>
      {/* Cancel subscription button at the very bottom */}
      {selectedPlan !== 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="error"
            sx={{ minWidth: 220, fontWeight: 600, fontSize: '1.1rem' }}
            onClick={handleCancelSubscription}
            disabled={canceling || loading}
          >
            {canceling ? <CircularProgress size={20} sx={{ color: 'red', mr: 1 }} /> : 'Cancel Subscription'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SettingsBilling;