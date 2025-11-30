# EmailJS Template Variables Guide

## Required Template Variables

Your EmailJS template (`template_tqwwea3`) should include these variables to receive all form data:

### Standard Variables (use these in your template):

```
{{from_name}} - Full Name
{{from_email}} - Email Address
{{company}} - Company Name
{{phone}} - Phone Number
{{package}} - Package Value (e.g., "golden-package")
{{package_name}} - Package Display Name (e.g., "Golden Package - $2,500/month")
{{message}} - Message Content
{{to_email}} - Receiver Email (gravitric@gmail.com)
{{to_name}} - Receiver Name (Gravitric Team)
{{reply_to}} - Reply-to Email (same as from_email)
```

## Recommended Email Template

### Subject Line:
```
New Contact Form Submission from {{from_name}}
```

### Email Body:
```
Hello Gravitric Team,

You have received a new contact form submission:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Phone: {{phone}}
Selected Package: {{package_name}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply to: {{reply_to}}

This email was sent via the Gravitric contact form.
```

## Alternative Variable Names (also supported)

The code also sends these alternative variable names for compatibility:

- `user_name` (same as `from_name`)
- `user_email` (same as `from_email`)
- `user_phone` (same as `phone`)
- `user_message` (same as `message`)
- `from_company` (same as `company`)
- `from_phone` (same as `phone`)
- `selected_package` (same as `package_name`)

## How to Update Your EmailJS Template

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Click on your template (`template_tqwwea3`)
4. Update the template with the variables above
5. Save the template

## Testing

After updating your template:
1. Fill out the contact form on your website
2. Submit the form
3. Check your email inbox
4. Verify all fields are populated correctly

## Troubleshooting

If fields are still empty:
1. Check browser console (F12) for the logged form data
2. Verify template variable names match exactly (case-sensitive)
3. Ensure all variables are included in your EmailJS template
4. Check EmailJS dashboard for any error logs

