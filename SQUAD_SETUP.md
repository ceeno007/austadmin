# Squad Payment Modal Integration

This document explains how to set up Squad Payment Modal (by GTBank) in the application using the official Squad widget as documented at [Squad API Documentation](https://squadinc.gitbook.io/squad-api-documentation/payments/accept-payments).

## Quick Setup

1. **Environment Variables**: A `.env` file has been created with default values
2. **Get Squad API Keys**: Visit [Squad Dashboard](https://dashboard.squadco.com) or [Squad Sandbox](https://sandbox.squadco.com)
3. **Update .env**: Replace the default Squad public key with your actual key
4. **Test Integration**: Run the application and test the payment flow

## Environment Variables

The `.env` file has been created with the following variables:

```env
# Squad Payment Gateway (GTBank)
REACT_APP_SQUAD_PUBLIC_KEY=test_pk_sample-public-key-1
# For production, replace with your live key: pk_live_xxxxxxxxxx

# Paystack Payment Gateway (Alternative)  
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# Application Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development

# Squad Environment (sandbox or production)
REACT_APP_SQUAD_ENVIRONMENT=sandbox

# Other configurations
GENERATE_SOURCEMAP=false
REACT_APP_VERSION=1.0.0
```

**Important**: Update `REACT_APP_SQUAD_PUBLIC_KEY` with your actual Squad public key!

## How It Works

The integration uses **Squad's official Payment Modal widget** which provides:
- **Native Modal Experience**: Similar to Paystack, Squad's widget creates its own secure modal overlay
- **Multiple Payment Channels**: Card, Bank Transfer, USSD, and Direct Transfer
- **Built-in Security**: PCI DSS compliant payment processing
- **Automatic Callbacks**: onSuccess, onClose, onLoad event handling

## Getting Squad API Keys

1. Visit [Squad Dashboard](https://dashboard.squadco.com) or [Squad Sandbox](https://sandbox.squadco.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Copy your Public Key (starts with `test_pk_` for sandbox or `pk_live_` for production)
5. Replace the default key in your `.env` file:
   ```env
   REACT_APP_SQUAD_PUBLIC_KEY=test_pk_your_actual_key_here
   ```

## Integration Architecture

### 1. Squad Widget Script
The Squad widget is automatically loaded via CDN:
```html
<script src="https://checkout.squadco.com/widget/squad.min.js"></script>
```

### 2. Modal Implementation
```javascript
const squadInstance = new window.squad({
  onClose: () => console.log("Widget closed"),
  onLoad: () => console.log("Widget loaded successfully"), 
  onSuccess: (response) => {
    // Handle successful payment
    console.log('Payment successful:', response);
  },
  key: process.env.REACT_APP_SQUAD_PUBLIC_KEY,
  email: "customer@email.com",
  amount: 2000000, // ₦20,000 in kobo
  currency_code: "NGN",
  transaction_ref: "unique_reference",
  customer_name: "Customer Name",
  payment_channels: ['card', 'bank', 'ussd', 'transfer']
});

squadInstance.setup();
squadInstance.open();
```

## Features

- **Payment Gateway Selection**: Users can choose between Squad and Paystack
- **Official Squad Modal**: Uses Squad's native widget for secure payments
- **Currency Support**: Both NGN (Naira) and USD (Dollar) payments
- **Multiple Payment Methods**: Card, Bank Transfer, USSD, Direct Transfer
- **Event Callbacks**: Proper success, close, and load handling
- **Modern UI**: Clean, responsive payment selection interface

## Payment Flow

1. **Form Completion**: Users fill out the application form
2. **Gateway Selection**: Choose between Squad or Paystack
3. **Payment Initialization**: Click "Proceed to Payment with Squad"
4. **Squad Modal**: Official Squad payment modal opens with payment options
5. **Payment Methods**: Choose from Card, Bank Transfer, USSD, or Direct Transfer
6. **Completion**: Automatic verification and redirect to success page

## Payment Amounts

- **Nigerian Applicants**: ₦20,000 (converted to 2,000,000 kobo)
- **International Applicants**: $50.00 (converted to 5,000 cents)

## Payment Channels Available

As per Squad's documentation, the following payment channels are supported:

### Nigerian Payments (NGN)
- **Card Payments**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank account transfer
- **USSD**: Mobile banking via USSD codes
- **Direct Transfer**: Account-to-account transfer

### International Payments (USD)
- **Card Payments**: International Visa, Mastercard
- **Bank Transfer**: International wire transfers

## Testing

### Sandbox Environment
- Use Squad's sandbox for testing: https://sandbox.squadco.com
- Test key format: `test_pk_xxxxxxxxxx`
- Test cards and payment methods available in Squad documentation

### Test Cards
Refer to Squad's official documentation for test card numbers and payment scenarios.

## Production Deployment

### Going Live
1. Get your live Squad public key from the production dashboard
2. Update environment variable with live key: `pk_live_xxxxxxxxxx`
3. Ensure webhook endpoints are configured for production
4. Test thoroughly in production environment

### Security Notes
- Public keys are safe to use in frontend code
- Never expose private/secret keys in frontend applications
- Squad handles all PCI DSS compliance requirements
- All payment data is processed securely by Squad

## Error Handling

The integration includes comprehensive error handling:
- **Widget Loading**: Checks if Squad widget is properly loaded
- **Payment Failures**: Displays user-friendly error messages
- **Network Issues**: Handles connectivity problems gracefully
- **Callback Errors**: Proper error logging and user notification

## Support

### Squad-Specific Issues
- Squad Documentation: https://squadinc.gitbook.io/squad-api-documentation
- Squad Support: Contact through their dashboard
- Squad Status: Check service status on their platform

### Application Issues
- Check browser console for detailed error messages
- Verify Squad public key is correctly set in `.env` file
- Ensure internet connectivity for widget loading
- Confirm environment variables are properly configured

## Code References

The main implementation files:
- `public/index.html` - Squad widget script inclusion
- `src/components/SquadPaymentModal.tsx` - Squad modal implementation
- `src/components/forms/FoundationForm.tsx` - Form integration
- `.env` - Environment configuration (created automatically)
- `env.example` - Environment variables template 