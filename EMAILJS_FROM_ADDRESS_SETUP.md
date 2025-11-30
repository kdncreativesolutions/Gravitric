# How to Show Customer Email in "From" Field

## Current Issue
EmailJS sends emails from your service email (`gravitric@gmail.com`) by default. The customer's email appears in the "reply-to" field, but not in the "from" field.

## Solution Options

### Option 1: Use Customer Name in "From" Field (Recommended - Already Implemented)
The code now sends the customer's name in the `from_name` field. This will display as:
- **From:** "Customer Name" <gravitric@gmail.com>

This is the standard and most secure approach. The customer's email is in the reply-to field, so replies will go directly to them.

### Option 2: Configure EmailJS Service for Custom From Address

To show the customer's email in the "from" field, you need to configure your EmailJS service:

1. **Go to EmailJS Dashboard**
   - Visit [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
   - Navigate to **Email Services**
   - Click on your service (`service_h590qlb`)

2. **Enable Custom From Address**
   - Look for "Advanced Settings" or "Service Settings"
   - Enable "Allow custom from address" or similar option
   - Save the settings

3. **Update Your Email Template**
   - Go to **Email Templates**
   - Open your template (`template_tqwwea3`)
   - In the template settings, look for "From Name" and "From Email" fields
   - Set:
     - **From Name:** `{{from_name}}`
     - **From Email:** `{{from_email}}`
   - Save the template

### Option 3: Use EmailJS Dynamic Email Service

If your email provider supports it, you can use EmailJS's dynamic email feature:

1. In your EmailJS service settings, enable "Dynamic Email"
2. This allows you to set custom from addresses per email
3. The code already sends `from_email` which will be used automatically

## Current Configuration

The code is already configured to send:
- `from_name`: Customer's full name
- `from_email`: Customer's email address
- `reply_to`: Customer's email address

## Email Display

With the current setup, emails will show:
- **From:** "Customer Name" <gravitric@gmail.com>
- **Reply-To:** customer@example.com

When you click "Reply", it will reply to the customer's email address.

## Testing

1. Submit a test form with a customer email
2. Check the received email
3. Verify:
   - The "from" field shows the customer's name
   - The "reply-to" field shows the customer's email
   - Clicking "Reply" goes to the customer's email

## Important Notes

- **Security**: Most email providers (Gmail, Outlook) don't allow sending from arbitrary email addresses to prevent spam
- **Best Practice**: Using your service email as "from" with customer email as "reply-to" is the standard and most reliable approach
- **Deliverability**: Emails sent from your authenticated service email have better deliverability rates

## If You Still Want Customer Email in "From" Field

If your email provider supports it and you've enabled custom from addresses in EmailJS:

1. The code already sends `from_email` in the form data
2. Update your EmailJS template to use `{{from_email}}` in the "From Email" field
3. Test to ensure emails are delivered (some providers may reject or mark as spam)

## Recommended Approach

**Keep the current setup** where:
- From: "Customer Name" <gravitric@gmail.com>
- Reply-To: customer@example.com

This ensures:
- ✅ High deliverability
- ✅ Emails don't go to spam
- ✅ Replies go directly to customers
- ✅ Professional appearance
- ✅ Works with all email providers

