# Quick Edit Reference

**New to editing?** See [EDITING_GUIDE.md](./EDITING_GUIDE.md) for detailed instructions.

---

## 🚀 How to Edit Content

### 1. Navigate to the File
- **Services:** `src/content/services/` → Pick a `.json` file
- **Facilities:** `src/content/facilities/` → Pick a `.json` file

### 2. Click the Pencil Icon ✏️
In GitHub, click the pencil icon in the top-right to edit

### 3. Make Your Changes
Edit the text between the quotes `"like this"`

### 4. Save
- Scroll down
- Add a description of what you changed
- Click **"Commit changes"**

### 5. Wait 2 Minutes
Your changes will automatically appear on the live website!

---

## 📋 Common Edits

### Change a Service Description
**File:** `src/content/services/production-runs.json`
```json
{
  "description": "Edit this text to change what appears on the website"
}
```

### Add Equipment to a List
**File:** `src/content/facilities/cnc-milling.json`
```json
{
  "items": [
    "Existing equipment here",
    "Add your new equipment here"
  ]
}
```

### Change Display Order
Change the `order` number:
```json
{
  "order": 1
}
```
Lower numbers appear first (1, 2, 3...)

---

## ⚠️ Important Rules

1. **Keep the quotes** - Don't delete `"` marks
2. **Use commas between items** - Except after the last one
3. **Keep brackets** - `[ ]` and `{ }` must stay
4. **Use straight quotes** - Not curly quotes ""
5. **One change at a time** - Easier to fix if something breaks

---

## 🛠️ File Locations Quick Reference

| What to Edit | File Location |
|--------------|---------------|
| Production Runs service | `src/content/services/production-runs.json` |
| Prototyping service | `src/content/services/prototyping.json` |
| Custom Jobs service | `src/content/services/custom-jobs.json` |
| CNC Milling equipment | `src/content/facilities/cnc-milling.json` |
| CNC Turning equipment | `src/content/facilities/cnc-turning.json` |
| Surface Grinding | `src/content/facilities/surface-grinding.json` |
| Engine Lathes | `src/content/facilities/lathes-engine.json` |
| Bridgeports | `src/content/facilities/bridgeports.json` |
| Cut-Off equipment | `src/content/facilities/cut-off.json` |
| Inspection equipment | `src/content/facilities/inspection.json` |
| Design & Engineering | `src/content/facilities/design-engineering.json` |
| Value-Added services | `src/content/facilities/value-added.json` |

---

## 🆘 Something Broke?

1. **Don't panic!** GitHub saves your history
2. Check Cloudflare Pages for error details
3. Look for:
   - Missing comma `,`
   - Extra comma after last item
   - Missing quote `"`
4. Fix and commit again
5. **Still stuck?** Ask for help and include the error message

---

## 📞 Contact Info

Contact info (phone/email) is NOT in these files. It's set in **Cloudflare Pages environment variables**.

To update contact info, you need Cloudflare dashboard access.

---

**Full documentation:** [EDITING_GUIDE.md](./EDITING_GUIDE.md)
