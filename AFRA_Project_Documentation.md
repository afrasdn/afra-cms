# AFRA Project Documentation

## 1. Project Overview

AFRA is a company landing page with a CMS that allows authorized staff to manage website content and product information without modifying source code or manually redeploying the website.

### Public Pages

- Home
- About Us
- Catalog
- Certificates
- Contact Us
- Staff Email

### CMS Features

- Admin/staff login
- Product management
- Product image upload/change
- Category management
- Home page content management
- Certificate management
- Contact information management
- User/role management if required
- Audit log if required

---

## 2. Target Architecture

```text
                         www.afra.com
                              |
                              v
                       Cloudflare DNS
                              |
                              v
                           Vercel
                    +---------+---------+
                    |                   |
               Public Site          Admin CMS
                    |                   |
                    +---------+---------+
                              |
                              v
                          Supabase
                    +---------+---------+
                    |         |         |
                   Auth      DB       API
                              |
                              v
                         Cloudinary
                              |
                              v
                        Product Images
```

### Services

| Component | Service | Purpose |
|---|---|---|
| Domain | Client-owned registrar | `www.afra.com` |
| DNS | Cloudflare | DNS management |
| Frontend | Vercel | Public website + CMS frontend |
| Authentication | Supabase Auth | Admin/staff login |
| Database | Supabase PostgreSQL | Products, content, users |
| API | Supabase API / Edge Functions | Backend functionality |
| Image Storage/CDN | Cloudinary | Product and website images |
| Source Code | GitHub | Version control |

### Why Render Is Not Used

The public landing page should not depend on a sleeping Render Free Web Service.

Target:

```text
Visitor
   ↓
www.afra.com
   ↓
Vercel
   ↓
Website loads
```

Avoid:

```text
Visitor
   ↓
Vercel
   ↓
Render Free
   ↓
Cold Start
   ↓
Wait
   ↓
Website
```

This keeps the public website independent from a sleeping backend server.

---

## 3. Client Requirements — Confirm Before Coding

Before development begins, confirm:

- [ Only Amin ] Who can access the CMS?
- [ 1-3 ] Number of admin accounts
- [ No, Only Admin ] Admin and Editor roles required?
- [ Only admin ] Can staff add products?
- [ Only admin ] Can staff edit products?
- [ Only admin ] Can staff archive/delete products?
- [ Only admin ] Can staff change product images?
- [ Only admin ] Can staff edit Home?
- [ Only admin ] Can staff edit About Us?
- [ Only admin ] Can staff manage Certificates?
- [ Only admin ] Can staff edit Contact information?
- [ Yes ] Is publish/unpublish required?
- [ Yes ] Is audit history required?
- [ Yes ] Is password reset required?
- [ Yes ] Are products divided into categories?
- [ No, for now but didn't know for upcoming update from client ] Are product prices displayed?
- [ No ] Are product documents/PDFs required?
- [ Yes ] Is a contact form required?
- [ Company, but im the onw who setup for the company ] Who owns the domain?
- [ Company, but im the onw who setup for the company ] Who owns the hosting/service accounts?

Do not implement unnecessary features before the client confirms them.

---

## 4. Database Draft

This is an initial schema and should be finalized after requirements are confirmed.

### users

```text
id
email
role
created_at
updated_at
```

### products

```text
id
name
description
category_id
image_url
is_active
created_at
updated_at
```

### categories

```text
id
name
is_active
created_at
updated_at
```

### site_content

```text
id
section
title
description
image_url
updated_at
updated_by
```

### certificates

```text
id
title
description
image_url
document_url
created_at
updated_at
```

### contact_messages

```text
id
name
email
message
created_at
```

### audit_logs

```text
id
user_id
action
table_name
record_id
created_at
```

---

## 5. Authentication & Security

### Supabase Auth

Use Supabase Auth for:

- Login
- Logout
- Session management
- Password reset if required

### Row Level Security

Enable RLS for database tables.

Public users should only be able to access information intended for public viewing.

Authorized administrators can perform CRUD operations according to their assigned role.

### Critical Security Rule

Never expose the Supabase `service_role` key in frontend code.

The frontend should use the public/publishable key while RLS controls access.

### Security Testing

- [ ] Open `/admin` without login
- [ ] Test incorrect login
- [ ] Test unauthorized database update
- [ ] Test normal user vs admin permissions
- [ ] Test session expiry
- [ ] Test direct API access
- [ ] Test invalid image upload
- [ ] Test oversized image upload

---

## 6. Public Website Development

Build the public website before the CMS.

### Home

- Hero section
- Company introduction
- Main products/services
- Company highlights
- CTA
- Relevant images

### About Us

- Company description
- Company history if provided
- Vision/mission if provided
- Company information

### Catalog

- Product categories
- Product cards
- Product images
- Product details
- Search/filter if required

### Certificates

- Certificate listing
- Certificate images
- PDF/document links if required

### Contact

- Address
- Phone
- Email
- Google Maps
- Contact form if required

### Staff Email

- Staff/contact listing
- `mailto:` links where appropriate

---

## 7. CMS Structure

Recommended structure:

```text
/admin
   |
   +-- Login
   |
   +-- Dashboard
   |
   +-- Products
   |
   +-- Categories
   |
   +-- Home Content
   |
   +-- Certificates
   |
   +-- Contact
   |
   +-- Users
```

### Product Management

Staff can:

- Add product
- Edit product
- Change product image
- Change category
- Activate/deactivate product
- Archive/delete product if approved

### Home Content Management

Possible editable fields:

- Hero title
- Hero description
- Hero image
- CTA
- Highlight sections

### Certificate Management

- Add
- Edit
- Archive/delete
- Upload image/PDF where required

---

## 8. Image Architecture

Do not store 200–300 production images inside GitHub.

Recommended flow:

```text
Staff
  ↓
CMS
  ↓
Upload Image
  ↓
Cloudinary
  ↓
Image URL
  ↓
Supabase Database
```

Example:

```text
products.image_url
        ↓
Cloudinary URL
        ↓
Website
```

### Image Optimization

Do not serve large original images directly to visitors.

Example:

```text
Original
4000 × 3000
4 MB

      ↓

Cloudinary Optimization

      ↓

Website
~1200px wide
WebP/AVIF where appropriate
Optimized file size
```

For the catalog, do not load all 200–300 images at once.

Use:

- Lazy loading
- Pagination or progressive loading
- CDN delivery
- Responsive image sizes

---

## 9. Free-Tier Strategy

Initial architecture:

```text
Vercel Free
+
Supabase Free
+
Cloudinary Free
+
GitHub
+
Client-paid Domain
```

### Supabase

Supabase Free can be used initially for a small company website, subject to current plan limits.

Monitor:

- Database usage
- Bandwidth/egress
- Auth usage
- Edge Function usage
- Project activity

Do not promise unlimited usage or guaranteed 24/7 uptime using free-tier services.

### Cloudinary

Cloudinary Free can be suitable initially for approximately 200–300 images if traffic and image sizes are controlled.

Monitor:

- Storage
- Image bandwidth
- Transformations/credits

Use optimized images and CDN delivery.

---

## 10. Domain

Target:

```text
www.afra.com
```

Before purchasing:

- [ ] Confirm domain availability
- [ ] Confirm exact spelling
- [ ] Confirm client approval
- [ ] Confirm ownership
- [ ] Use a company/client-controlled account
- [ ] Avoid permanently placing ownership under a personal account

Recommended DNS architecture:

```text
www.afra.com
      ↓
Cloudflare DNS
      ↓
Vercel
```

Configure:

- Root domain
- `www`
- HTTPS
- Preferred canonical domain
- Redirect between root and `www`

---

## 11. SEO Strategy

### Main SEO Objective

The target is to establish a strong association:

```text
AFRA
   ↓
Client's official business
   ↓
www.afra.com
```

A unique brand name can make brand-related searches easier to establish, but it does not guarantee an immediate #1 Google position.

Google still needs to:

1. Discover the website
2. Crawl the website
3. Understand the business
4. Index the pages
5. Associate the brand with the domain
6. Determine rankings through its search systems

The goal is to make the relationship between AFRA and `www.afra.com` clear and consistent.

---

## 12. On-Page SEO

### Page Titles

Avoid:

```text
Home
About
Catalog
```

Use descriptive titles.

Examples:

```text
AFRA | Official Website
About AFRA | Company Information
AFRA Products | Product Catalog
AFRA Certificates | Certifications
Contact AFRA | Contact Information
```

Use the actual business description/industry when appropriate.

### Meta Descriptions

Each important page should have a unique description.

Example:

```text
Learn more about AFRA, its products, services,
certifications and contact information.
```

Replace generic wording with accurate client information.

### H1

Each important page should have a clear primary heading.

Example:

```html
<h1>AFRA</h1>
```

or:

```html
<h1>AFRA — [Actual Company Description]</h1>
```

Do not stuff keywords into headings.

---

## 13. Business Information Consistency

Use the same official information across:

- Website
- Google Business Profile
- Facebook
- Instagram
- Other official social accounts
- Business directories where appropriate
- Email signatures

Keep these consistent:

```text
Business Name
Address
Phone
Email
Website
Business Category
Opening Hours
```

This helps search engines connect different references to the same business.

---

## 14. Structured Data

Add appropriate Schema.org structured data.

For a local/physical business, use the most specific applicable `LocalBusiness` subtype.

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AFRA",
  "url": "https://www.afra.com",
  "logo": "https://www.afra.com/logo.png",
  "telephone": "+60XXXXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "...",
    "addressRegion": "...",
    "postalCode": "...",
    "addressCountry": "MY"
  }
}
```

Only include accurate information supplied by the client.

---

## 15. Google Search Console

After deployment:

- [ ] Add `www.afra.com`
- [ ] Verify ownership
- [ ] Submit sitemap
- [ ] Inspect homepage
- [ ] Request indexing
- [ ] Inspect important pages
- [ ] Monitor indexing status
- [ ] Monitor search queries

Expected flow:

```text
Deploy
  ↓
Verify Search Console
  ↓
Submit Sitemap
  ↓
Request/allow crawling
  ↓
Google indexes website
  ↓
Monitor search performance
  ↓
Improve content
```

Indexing and ranking are separate processes.

---

## 16. Google Business Profile

If AFRA is an eligible local/physical business:

- [ ] Ensure Google Business Profile exists
- [ ] Client owns/controls the profile
- [ ] Correct business name
- [ ] Correct address
- [ ] Correct phone number
- [ ] Correct website
- [ ] Correct category
- [ ] Correct opening hours
- [ ] Upload real company photos

Do not create duplicate or fake listings.

---

## 17. Sitemap

Create:

```text
https://www.afra.com/sitemap.xml
```

Include public pages:

```text
/
 /about
 /catalog
 /certificates
 /contact
```

Do not include:

```text
/admin
/login
/private CMS pages
```

Submit the sitemap through Google Search Console.

---

## 18. Robots.txt

Create:

```text
https://www.afra.com/robots.txt
```

Example:

```text
User-agent: *
Allow: /

Sitemap: https://www.afra.com/sitemap.xml
```

Do not accidentally block the entire website.

Private/admin areas should primarily be protected through authentication and proper access control.

---

## 19. Canonical URLs

Choose one preferred public domain.

For example:

```text
https://www.afra.com
```

Then redirect:

```text
https://afra.com
```

to:

```text
https://www.afra.com
```

Use canonical tags:

```html
<link
  rel="canonical"
  href="https://www.afra.com/"
/>
```

This avoids unnecessary duplicate URL versions.

---

## 20. Social Sharing

Add Open Graph metadata.

Example:

```html
<meta property="og:title" content="AFRA | Official Website" />

<meta
  property="og:description"
  content="Official website of AFRA."
/>

<meta
  property="og:image"
  content="https://www.afra.com/og-image.jpg"
/>

<meta
  property="og:url"
  content="https://www.afra.com"
/>
```

Prepare a proper `og-image.jpg` using the client's branding.

---

## 21. Brand SEO

Do not rely only on the word `AFRA`.

Build a consistent brand identity:

```text
AFRA
Official Website
www.afra.com
Company Address
Company Phone
Company Email
Facebook
Google Business Profile
```

Use the exact official company name consistently.

If the client has an existing Facebook page, make sure its website field points to:

```text
https://www.afra.com
```

Likewise, link the website to the official social accounts.

The objective is to create consistent signals that these properties represent the same business.

---

## 22. Performance SEO

Important because this is a landing page.

Checklist:

- [ ] Optimize images
- [ ] Use responsive images
- [ ] Use WebP/AVIF where appropriate
- [ ] Lazy-load below-the-fold images
- [ ] Set image dimensions
- [ ] Avoid huge JavaScript bundles
- [ ] Avoid unnecessary animations
- [ ] Avoid loading 300 product images immediately
- [ ] Use CDN delivery
- [ ] Test mobile performance
- [ ] Test Core Web Vitals

Catalog strategy:

```text
BAD

Load 300 full-resolution images
        ↓
Slow page


GOOD

Load visible/required images
        ↓
Optimized CDN versions
        ↓
Fast page
```

---

## 23. Favicon & Brand Assets

Prepare:

```text
favicon.ico
favicon.svg
apple-touch-icon.png
logo.svg
logo.png
og-image.jpg
```

Use official client branding.

---

## 24. Testing

### Public Website

- [ ] Desktop Chrome
- [ ] Mobile Chrome
- [ ] Different screen sizes
- [ ] Navigation
- [ ] Images
- [ ] Links
- [ ] Catalog
- [ ] Certificates
- [ ] Contact information
- [ ] Social links

### CMS

- [ ] Login
- [ ] Logout
- [ ] Wrong password
- [ ] Add product
- [ ] Edit product
- [ ] Archive/delete product
- [ ] Upload image
- [ ] Replace image
- [ ] Edit Home
- [ ] Edit About
- [ ] Manage certificates

### Security

- [ ] Unauthenticated `/admin`
- [ ] RLS testing
- [ ] Unauthorized update
- [ ] Session expiry
- [ ] Invalid upload
- [ ] Oversized upload
- [ ] Direct API/database access

### SEO

- [ ] Page titles
- [ ] Meta descriptions
- [ ] H1
- [ ] Canonical URLs
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Structured data
- [ ] Open Graph
- [ ] Favicon
- [ ] Search Console
- [ ] Google indexing

### Performance

- [ ] Lighthouse
- [ ] Mobile performance
- [ ] Image optimization
- [ ] Catalog loading
- [ ] Core Web Vitals

---

## 25. Client Documentation

### User Manual

Document:

- Login
- Logout
- Add product
- Edit product
- Change product image
- Manage Home
- Manage Certificates
- Manage Contact
- Manage users if applicable

### Technical Documentation

Document:

- Architecture
- Database schema
- Environment variables
- Vercel configuration
- Supabase configuration
- Cloudinary configuration
- Domain/DNS
- Deployment procedure
- Backup/recovery
- Admin management

---

## 26. Account Ownership

Client should ultimately control:

- Domain
- Vercel
- Supabase
- Cloudinary
- GitHub repository
- Admin accounts

Developer access should be granted separately.

Do not make the client permanently dependent on a personal developer account.

---

## 27. First Week Back in Office

### Day 1 — Requirement + Foundation

- [ ] Confirm CMS requirements
- [ ] Confirm pages
- [ ] Confirm domain name
- [ ] Collect company content
- [ ] Collect logo
- [ ] Collect product images
- [ ] Collect certificates
- [ ] Create GitHub repository
- [ ] Create Vercel project
- [ ] Create Supabase project
- [ ] Create Cloudinary project
- [ ] Setup environment variables
- [ ] Draft database schema

### Day 2 — Public Website

- [ ] Navbar
- [ ] Home
- [ ] About
- [ ] Catalog
- [ ] Certificates
- [ ] Contact
- [ ] Responsive design

### Day 3 — CMS

- [ ] Authentication
- [ ] Dashboard
- [ ] Product CRUD
- [ ] Image upload
- [ ] Home content management
- [ ] Certificate management

### Day 4 — Security + Polish

- [ ] RLS
- [ ] Roles/permissions
- [ ] Error handling
- [ ] Loading states
- [ ] Image optimization
- [ ] Mobile responsive
- [ ] UI polish

### Day 5 — Production

- [ ] Full testing
- [ ] Bug fixes
- [ ] Performance testing
- [ ] Domain configuration
- [ ] Production deployment
- [ ] Search Console
- [ ] Sitemap
- [ ] Structured data
- [ ] Client user testing

---

## 28. Development Priority

If time is limited:

```text
1. Client Requirements
        ↓
2. Database + Authentication
        ↓
3. Public Website
        ↓
4. CMS
        ↓
5. Image System
        ↓
6. Security / RLS
        ↓
7. Testing
        ↓
8. Domain
        ↓
9. SEO
        ↓
10. UI Polish
```

Do not spend the first development day polishing animations while the database and CMS requirements are still uncertain.

---

## 29. Final Architecture

```text
                         ┌───────────────────┐
                         │    www.afra.com   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Cloudflare DNS  │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Vercel Hosting  │
                         │                   │
                         │  Public Website   │
                         │       +           │
                         │     Admin CMS     │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     Supabase      │
                         │                   │
                         │ Auth              │
                         │ PostgreSQL        │
                         │ RLS               │
                         │ API               │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    Cloudinary     │
                         │                   │
                         │ Product Images    │
                         │ CDN / Transform   │
                         └───────────────────┘
```

### Target Result

```text
Visitor opens:

https://www.afra.com

        ↓

Vercel serves frontend

        ↓

No Render cold start

        ↓

Website loads immediately
```

Admin:

```text
/admin
   ↓
Supabase Auth
   ↓
CMS
   ↓
Supabase Database
   ↓
Cloudinary
```

This architecture keeps the public landing page independent from a sleeping backend server while still providing authentication, database functionality, CMS management and image management.
