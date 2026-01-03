# EmailJS Setup Guide for Solid Weddings Contact Form

## Overview
The contact form now automatically sends emails to your business email address when customers submit inquiries.

## Setup Instructions

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Set up Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended) or your preferred email provider
4. Connect your business email: `solidwedding@gmail.com`
5. Copy the **Service ID** (e.g., `service_xyz123`)

### 3. Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use this template structure:

```html
Subject: New Wedding Inquiry from {{from_name}}

Hello Solid Weddings Team,

You have received a new wedding inquiry through your website.

Client Details:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}
- Wedding Date: {{wedding_date}}
- Venue: {{venue}}
- Package Interest: {{package}}

Message:
{{message}}

---
Please respond to this inquiry within 24 hours.
Reply directly to: {{reply_to}}
```

4. Save the template and copy the **Template ID** (e.g., `template_xyz123`)

### 4. Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `user_xyz123`)

### 5. Update Environment Variables
1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

### 6. Test the Form
1. Run your website: `npm run dev`
2. Go to the Contact page
3. Fill out and submit the form
4. Check your business email for the inquiry

## Features Included

✅ **Automatic Email Sending** - Forms are sent to your business email
✅ **Loading States** - Users see "Sending..." feedback
✅ **Success/Error Messages** - Clear feedback for users
✅ **Form Validation** - Required fields must be filled
✅ **Form Reset** - Form clears after successful submission
✅ **Professional Styling** - Matches your website design

## Email Delivery
- **Free Plan**: 200 emails/month
- **Paid Plans**: Higher limits available
- **Delivery Time**: Usually instant (within 30 seconds)
- **Reliability**: 99%+ delivery rate

## Troubleshooting

### Form not sending emails?
1. Check browser console for errors
2. Verify your EmailJS credentials in `.env`
3. Ensure your email service is active in EmailJS dashboard
4. Check spam folder for test emails

### Getting "Failed to send" errors?
1. Verify your EmailJS public key is correct
2. Check if you've exceeded your monthly email limit
3. Ensure your email service is properly connected

## Security Notes
- Public key is safe to expose in frontend code
- Private keys should never be used in frontend
- EmailJS handles all email authentication securely
- No sensitive data is stored in the frontend code

## Support
For technical issues:
- EmailJS Documentation: https://www.emailjs.com/docs/
- Contact your developer for website-specific issues