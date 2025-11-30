# EmailJS Setup Guide for Gravitric Contact Form

This guide will help you configure EmailJS to send and receive emails from your contact form.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

## Step 2: Add an Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** - you'll need this later

## Step 3: Create an Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use the following template structure:

### Template Subject:
```
New Contact Form Submission from {{from_name}}
```

### Template Content:
```
Hello,

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Company: {{from_company}}
Phone: {{from_phone}}
Selected Package: {{package_name}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. **Copy the Template ID** - you'll need this later

## Step 4: Get Your Public Key

1. Go to **Account** > **General** in your EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy the Public Key** - you'll need this later

## Step 5: Configure the Website

1. Open `assets/js/main.js`
2. Find the `EMAILJS_CONFIG` object at the top of the file
3. Replace the placeholder values with your actual credentials:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_public_key_here',
  SERVICE_ID: 'your_service_id_here',
  TEMPLATE_ID: 'your_template_id_here',
  RECEIVER_EMAIL: 'sales@gravitric.com' // Your email address
};
```

### Example:
```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'abc123xyz789',
  SERVICE_ID: 'service_gmail123',
  TEMPLATE_ID: 'template_contact456',
  RECEIVER_EMAIL: 'sales@gravitric.com'
};
```

## Step 6: Test the Form

1. Open your contact form page
2. Fill out and submit the form
3. Check your email inbox for the form submission
4. Check the browser console for any errors

## Troubleshooting

### Form not sending emails:
- Verify all credentials are correct in `main.js`
- Check browser console for error messages
- Ensure EmailJS script is loaded (check Network tab)
- Verify your email service is active in EmailJS dashboard

### Emails going to spam:
- Add EmailJS to your email provider's whitelist
- Check spam/junk folder
- Verify your email service settings in EmailJS

### Template variables not working:
- Ensure template variable names match exactly (case-sensitive)
- Check that all variables are included in your EmailJS template
- Verify form field names match the template variables

## Form Field Mapping

The contact form sends the following data:
- `from_name` - Full Name
- `from_email` - Email Address
- `from_company` - Company Name
- `from_phone` - Phone Number
- `package` - Package Value
- `package_name` - Package Display Name
- `message` - Message Content
- `reply_to` - Reply-to Email (same as from_email)

## Security Notes

- The Public Key is safe to expose in client-side code
- Never share your Private Key
- EmailJS free plan includes 100 emails/month
- Consider upgrading for higher volume

## Support

For EmailJS support, visit: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

