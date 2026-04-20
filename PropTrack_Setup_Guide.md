# PropTrack — Setup Guide
## Connect Your Google Sheet in 2 Minutes

---

### What You Need
- A Google Account (free)
- The PropTrack HTML file (already have it)
- The Apps Script code (included in your purchase)

---

## STEP 1 — Create Your Google Sheet

1. Go to **sheets.google.com**
2. Click **"+ Blank"** to create a new sheet
3. Name it anything — e.g. *"PropTrack Leads"*

---

## STEP 2 — Add the Apps Script

1. In your Google Sheet, click **Extensions** (top menu)
2. Click **Apps Script**
3. A new tab will open — **delete all existing code**
4. Open the file **PropTrack_AppsScript.js** (included)
5. **Select All** → **Copy** → **Paste** into Apps Script editor
6. Click the **Save** button (💾 icon or Ctrl+S)

---

## STEP 3 — Deploy as Web App

1. Click **"Deploy"** button (top right)
2. Click **"New Deployment"**
3. Click the ⚙ gear icon next to "Select type" → Choose **"Web App"**
4. Fill in:
   - **Description:** PropTrack API
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **"Deploy"**
6. Google will ask you to **Authorize** — click Allow
7. You will see a **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
8. **Copy this URL** — you'll need it in the next step

> ⚠️ Important: Copy the full URL including `/exec` at the end

---

## STEP 4 — Connect to PropTrack

1. Open **RE_Lead_Pipeline_Tracker.html** in your browser
2. You'll see the **First Time Setup** screen
3. Paste your Web App URL in the input box
4. Click **"Connect Google Sheet"**
5. Wait 3-5 seconds — it will test the connection
6. ✅ Done! You're connected.

---

## DAILY USE

- All leads you add/edit/delete **automatically save** to your Google Sheet
- Use the **⟳ Refresh** button to reload data (if you open on a new device)
- Use **⚙ Sheet** button to update your URL if needed
- You can also view/edit data directly in Google Sheets anytime

---

## TROUBLESHOOTING

**"Connection failed" error?**
- Make sure you set **Who has access: Anyone** (not "Anyone with Google account")
- Re-deploy: Deploy → Manage Deployments → Edit → Deploy again

**Data not saving?**
- Check your internet connection
- Click ⟳ Refresh to reload

**Lost your Web App URL?**
- Go to Apps Script → Deploy → Manage Deployments → Copy URL

---

## SUPPORT

For any issues, contact the seller through your purchase platform.

---

*PropTrack — Built for Indian Real Estate Professionals*
