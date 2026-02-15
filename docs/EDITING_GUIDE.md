# Content Editing Guide for T.E.T. Manufacturing Website

This guide shows you how to update the website content without needing to write code. All edits are made through GitHub's web interface - no special software required.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Editing Services](#editing-services)
3. [Editing Facilities](#editing-facilities)
4. [Editing Contact Information](#editing-contact-information)
5. [What Happens After You Save](#what-happens-after-you-save)
6. [Tips and Best Practices](#tips-and-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What You'll Need
- A GitHub account with access to this repository
- A web browser (Chrome, Firefox, Edge, or Safari)

### Understanding the File Structure

Content is stored in these folders:
- **Services:** `src/content/services/` - What services we offer
- **Facilities:** `src/content/facilities/` - Our equipment and capabilities
- **Contact Info:** Set in Cloudflare Pages (see [Editing Contact Information](#editing-contact-information))

---

## Editing Services

Services appear on the homepage and `/services` page as cards describing what we offer.

### Step-by-Step Instructions

1. **Navigate to the services folder:**
   - Go to the GitHub repository
   - Click on `src` → `content` → `services`

2. **Choose which service to edit:**
   - `production-runs.json` - Production Runs service
   - `prototyping.json` - Prototyping service
   - `custom-jobs.json` - One-Off & Custom Jobs service

3. **Click on the file name** (e.g., `production-runs.json`)

4. **Click the pencil icon** (✏️) in the top-right corner that says "Edit this file"

5. **Make your changes:**

   Example file:
   ```json
   {
     "title": "Production Runs",
     "icon": "mill",
     "description": "Repeat orders and volume work with consistent quality. Our ERP tracks schedules and costs so we can give you reliable delivery dates and pricing.",
     "order": 1
   }
   ```

   **What you can change:**
   - `title`: The service name (keep it short)
   - `description`: The service description (1-2 sentences)
   - `icon`: The icon name (options: mill, wrench, clipboard, gear, caliper, facility, quality, contact)
   - `order`: The display order (1, 2, 3...)

   **Important:** Keep the quotes `"` and commas `,` exactly as shown!

6. **Preview your changes** (optional):
   - Click the "Preview" tab to check your formatting

7. **Save your changes:**
   - Scroll to the bottom of the page
   - In the "Commit changes" box, write a brief description like "Updated Production Runs description"
   - Click the green **"Commit changes"** button

### Adding a New Service

1. In the `src/content/services/` folder, click **"Add file"** → **"Create new file"**
2. Name your file with lowercase and hyphens (e.g., `specialty-machining.json`)
3. Copy the structure from an existing service file
4. Update all the values
5. Commit the new file

---

## Editing Facilities

Facilities are listed on the `/facilities` page, showing our equipment by category.

### Step-by-Step Instructions

1. **Navigate to the facilities folder:**
   - Go to the GitHub repository
   - Click on `src` → `content` → `facilities`

2. **Choose which category to edit:**
   - `cnc-milling.json` - CNC Milling equipment
   - `cnc-turning.json` - CNC Turning equipment
   - `surface-grinding.json` - Surface Grinding equipment
   - `lathes-engine.json` - Engine Lathes
   - `bridgeports.json` - Bridgeport mills
   - `cut-off.json` - Cut-off equipment
   - `inspection.json` - Inspection equipment
   - `design-engineering.json` - Design capabilities
   - `value-added.json` - Subcontracting services

3. **Click on the file name** (e.g., `cnc-milling.json`)

4. **Click the pencil icon** (✏️) to edit

5. **Make your changes:**

   Example file:
   ```json
   {
     "category": "CNC Milling",
     "icon": "mill",
     "order": 1,
     "description": "Optional description text here",
     "items": [
       "2010 MORI SEIKI NMV 5000 5-Axis, 5 Pallet Vertical",
       "2009 OKUMA HOWA 761V 30″ × 60″ table",
       "2008 MORI SEIKI DV5100 20″ × 40″ table"
     ]
   }
   ```

   **What you can change:**
   - `category`: The category name
   - `icon`: Icon name (mill, gear, wrench, caliper, clipboard, facility)
   - `order`: Display order on the page (1-9)
   - `description`: Optional description paragraph (can be left out or set to empty "")
   - `items`: List of equipment (each item in quotes, separated by commas)

   **To add equipment:** Add a new line inside `items` following the pattern:
   ```json
   "items": [
     "Existing equipment",
     "Another existing one",
     "Your new equipment here"
   ]
   ```

   **To remove equipment:** Delete the entire line including the comma

   **Important:**
   - Each item needs quotes `"` around it
   - Separate items with commas `,`
   - The last item should NOT have a comma after it
   - Keep the square brackets `[ ]` around the items list

6. **Save your changes:**
   - Scroll down and add a description like "Added new CNC mill to equipment list"
   - Click **"Commit changes"**

### Adding a New Facility Category

1. In the `src/content/facilities/` folder, click **"Add file"** → **"Create new file"**
2. Name it with lowercase and hyphens (e.g., `laser-cutting.json`)
3. Copy the structure from an existing file
4. Set the `order` number to where you want it to appear (higher numbers appear later)
5. Commit the file

---

## Editing Contact Information

Contact information (phone number, email) is stored in **Cloudflare Pages environment variables**, not in the repository. This keeps sensitive information out of the public code.

### How to Update

**You'll need access to the Cloudflare Pages dashboard:**

1. Log in to Cloudflare
2. Go to **Pages** → Select your site
3. Click **Settings** → **Environment variables**
4. Update these variables:
   - `TET_PHONE` - Phone number (e.g., `860-349-1004`)
   - `TET_EMAIL_USER` - Email username (e.g., `info`)
   - `TET_EMAIL_DOMAIN` - Email domain (e.g., `tetmfg.com`)
5. Click **Save**
6. Go to **Deployments** and click **"Create deployment"** to rebuild the site

---

## What Happens After You Save

1. **GitHub saves your changes** - Your edits are now in the repository with a history log
2. **Cloudflare Pages detects the change** - Automatic rebuild is triggered
3. **Site rebuilds** - Takes 1-2 minutes
4. **New content goes live** - Your changes appear on the website

### How to Check Progress

1. Go to your Cloudflare Pages dashboard
2. Click on **Deployments**
3. You'll see the latest deployment with a status:
   - 🟡 **Building** - Site is rebuilding
   - 🟢 **Success** - Changes are live
   - 🔴 **Failed** - Something went wrong (see [Troubleshooting](#troubleshooting))

---

## Tips and Best Practices

### ✅ DO:
- Write clear commit messages describing what you changed
- Preview your changes before committing (use the Preview tab)
- Keep descriptions concise and professional
- Use straight quotes `"` not curly quotes `""`
- Test the website after changes go live

### ❌ DON'T:
- Remove or change quotes `"`, brackets `[ ]`, or braces `{ }`
- Forget commas between items
- Add a comma after the last item in a list
- Use special characters that might break JSON (stick to letters, numbers, spaces, and basic punctuation)
- Make changes directly on the main branch without reviewing

### Common Patterns

**Adding an item to a list:**
```json
"items": [
  "Existing item",
  "New item here"
]
```

**Multiple lines of text in description:**
Keep it on one line - the website will handle line breaks automatically:
```json
"description": "This is a longer description. It can have multiple sentences. Just keep it on one line in the JSON file."
```

---

## Troubleshooting

### "I saved my changes but the website didn't update"

1. Check the Cloudflare Pages deployment status
2. Wait 2-3 minutes - builds take time
3. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
4. Clear your browser cache

### "The build failed in Cloudflare"

Common causes:
- **Missing comma** - Make sure items in lists are separated by commas
- **Extra comma** - The last item should NOT have a comma
- **Missing quote** - All text values need quotes around them
- **Bracket mismatch** - Make sure `[ ]` and `{ }` are properly closed

**How to fix:**
1. Look at the error message in Cloudflare (it usually tells you the line number)
2. Go back to GitHub and edit the file again
3. Compare your file to a working example
4. Fix the issue and commit again

### "I can't find the pencil icon to edit"

- Make sure you're logged into GitHub
- Make sure you have write access to the repository
- Try refreshing the page

### "I made a mistake and want to undo my changes"

GitHub keeps a history of all changes:
1. Navigate to the file you changed
2. Click **"History"** (clock icon)
3. Click on the previous version
4. Click the three dots `...` → **"View file"**
5. Copy the old content
6. Edit the current file and paste the old content back
7. Commit with a message like "Reverted to previous version"

### "I need help!"

Contact the web developer or someone with technical knowledge. Provide:
- What you were trying to do
- Which file you were editing
- A screenshot of any error messages
- The link to the GitHub commit or Cloudflare deployment

---

## Quick Reference Card

### Service File Format
```json
{
  "title": "Service Name",
  "icon": "mill",
  "description": "Service description here.",
  "order": 1
}
```

### Facility File Format
```json
{
  "category": "Category Name",
  "icon": "gear",
  "order": 1,
  "description": "Optional description",
  "items": [
    "Equipment item 1",
    "Equipment item 2"
  ]
}
```

### Available Icons
- `mill` - Milling machine
- `gear` - General machinery
- `wrench` - Tools/maintenance
- `caliper` - Precision/measurement
- `clipboard` - Documentation/planning
- `facility` - Building/facility
- `quality` - Quality control
- `contact` - Contact/communication

---

## Need More Help?

- **GitHub Help:** https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files
- **JSON Format Guide:** https://www.json.org/json-en.html
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/

---

*Last updated: February 2026*
