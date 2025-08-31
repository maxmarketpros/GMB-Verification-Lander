# Google Business Profile Verification Form - Netlify Deployment

## Overview

This implementation includes a comprehensive two-phase multistep verification intake form that's fully compatible with Netlify Forms.

## Features Implemented

✅ **Two-Phase Form System**
- Phase 1: Lead Capture (immediate submission)
- Phase 2: Detailed Intake & File Uploads (second submission)

✅ **Progressive Enhancement**
- Step 1: Lead capture with phone, email, business name
- Step 2: Business location and verification history  
- Step 3: Document uploads and compliance confirmations

✅ **Netlify Integration**
- Two separate form submissions for optimal lead tracking
- File upload support for business documents and photos
- Anti-spam honeypot protection
- Form detection via public/forms.html

✅ **Google-Style Design**
- Clean, modern UI with mobile-first approach
- Clear progress indicators ("Step 1 of 3")
- Help banner with phone number on each step
- Smooth transitions and loading states

✅ **Accessibility & UX**
- Keyboard navigation support
- Screen reader friendly labels
- Inline validation with helpful error messages
- Conditional field logic based on business type

## Netlify Deployment Instructions

### 1. Enable Forms in Netlify

In your Netlify dashboard:
1. Go to Site settings → Forms
2. Enable form detection
3. Enable file uploads (important for document submission)

### 2. Form Configuration

The forms are automatically detected via `public/forms.html` which includes:

**Lead Capture Form** (`verification-lead-capture`)
- Captures initial contact information
- Immediate submission for quick lead generation

**Detailed Form** (`verification-details`) 
- Comprehensive business information
- File uploads for verification documents
- Honeypot spam protection

### 3. Form Submissions

Forms submit to:
- Phase 1: `verification-lead-capture` 
- Phase 2: `verification-details`

Both forms include a unique `lead-id` field to match submissions later.

### 4. File Upload Limits

Default Netlify limits:
- 10MB per file upload
- Supports PDF, JPG, PNG, WEBP formats

### 5. Deployment Commands

```bash
npm run build
npm run start
```

### 6. Environment Setup

No additional environment variables required - forms work out of the box with Netlify.

## Form Data Structure

### Phase 1 (Lead Capture)
- `lead-id`: Unique identifier
- `business-name`: Business name
- `phone-number`: Contact phone
- `email`: Contact email  
- `consent`: Agreement checkbox

### Phase 2 (Detailed Information)
- All Phase 1 data via `lead-id` reference
- Business location details
- Verification attempt history
- Document uploads (business docs, signage photos)
- Compliance confirmations

## Anti-Spam Features

- Honeypot field in Phase 2 form
- Client-side validation
- Required consent checkbox
- File type restrictions

## Accessing Form Submissions

1. Netlify Dashboard → Forms
2. Select the form name to view submissions
3. Download CSV exports for lead processing
4. File attachments available in submission details

## Integration Notes

- Forms are fully functional without JavaScript (progressive enhancement)
- Unique lead ID allows matching Phase 1 and Phase 2 submissions
- Mobile-optimized with touch-friendly controls
- Help phone number prominently displayed throughout flow

## Support

Questions about verification can be directed to the provided phone number: (888) 401-4221
