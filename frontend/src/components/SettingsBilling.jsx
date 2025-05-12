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
      setError('An unexpected error occurred. Please try again.');
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
  paymentMethods: initialPaymentMethods,
  handleSetDefault,
  handleAddNew,
  invoiceHistory
}) => {
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  
  // Sort payment methods to keep default at the top
  useEffect(() => {
    if (initialPaymentMethods) {
      const sortedMethods = [...initialPaymentMethods].sort((a, b) => {
        if (a.default) return -1;
        if (b.default) return 1;
        return 0;
      });
      setPaymentMethods(sortedMethods);
    }
  }, [initialPaymentMethods]);

  // Handler for setting a payment method as default
  const handleSetDefaultMethod = (idx) => {
    // Call the parent handler first
    handleSetDefault(idx);
    
    // Update local state to reorder cards
    const updatedMethods = paymentMethods.map((method, i) => ({
      ...method,
      default: i === idx
    }));
    
    // Sort methods to put default at the top
    const sortedMethods = updatedMethods.sort((a, b) => {
      if (a.default) return -1;
      if (b.default) return 1;
      return 0;
    });
    
    setPaymentMethods(sortedMethods);
  };
  
  // Handler for removing a payment method
  const handleRemovePaymentMethod = (idx) => {
    // In a real app, you would call your backend to delete the payment method
    // For demo, we'll just remove it from our local state
    const updatedMethods = [...paymentMethods];
    updatedMethods.splice(idx, 1);
    
    setPaymentMethods(updatedMethods);
    
    // You would typically also add a confirmation dialog in production
    console.log('Removed payment method at index:', idx);
  };
  
  // Handle successful payment method addition
  const handlePaymentMethodSuccess = (paymentMethod) => {
    // You would typically send this payment method to your backend
    console.log('New payment method added:', paymentMethod);
    
    // Create a new payment method object with the Stripe data
    const newMethod = {
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      exp: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
      default: paymentMethods.length === 0 // Set as default if this is the first card
    };
    
    // Add to local state
    const updatedMethods = [...paymentMethods];
    
    // If this is the first card or marked as default
    if (newMethod.default) {
      // Update all cards to not be default
      updatedMethods.forEach(method => {
        method.default = false;
      });
    }
    
    // Add the new method
    updatedMethods.push(newMethod);
    
    // Sort to keep default at top
    const sortedMethods = updatedMethods.sort((a, b) => {
      if (a.default) return -1;
      if (b.default) return 1;
      return 0;
    });
    
    setPaymentMethods(sortedMethods);
    
    // Call parent handler
    handleAddNew(newMethod);
    
    // Close the form
    setShowAddPaymentForm(false);
  };
  
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

  // Prepare invoice data for DataGrid
  const invoiceRows = invoiceHistory.map((inv, index) => ({
    id: index, // Required by DataGrid
    ...inv,
    download: inv.url // This makes the URL available to renderCell
  }));
  
  return (
    <Box className="page-container-inner">
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
          {plans.map((plan, idx) => (
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
                >
                  Upgrade
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
          {paymentMethods.map((pm, idx) => (
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
                  onChange={() => handleSetDefaultMethod(idx)}
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
                    onClick={() => handleSetDefaultMethod(idx)}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      color: 'var(--orange-crayola)',
                      borderColor: 'var(--orange-crayola)',
                    }}
                  >
                    Set as default
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
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsBilling;