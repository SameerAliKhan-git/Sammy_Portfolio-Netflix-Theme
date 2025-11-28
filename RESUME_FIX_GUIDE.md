# 📄 RESUME DOWNLOAD FIX GUIDE

## 🔍 Current Resume Path Configuration

**File:** `server.js`
**Line:** 197

```javascript
const resumePath = path.resolve(__dirname, "Sameer_Ali_Khan_Resume.pdf");
```

---

## ✅ YOUR RESUME LOCATION

Your resume should be at:

```
D:\Portfolio\Sameer_Ali_Khan_Resume.pdf
```

**This means:** The PDF file should be in the SAME folder as `server.js`, NOT in a subfolder.

---

## 🛠️ HOW TO FIX

### Option 1: Move Your Resume (Recommended)

1. Find your `Sameer_Ali_Khan_Resume.pdf` file
2. Move it to: `D:\Portfolio\` (the root of your project)
3. Make sure it's in the same folder as `server.js`

### Option 2: Change the Path in server.js

**If your resume is in a different location**, edit `server.js` at **line 197**:

#### Current Code:

```javascript
const resumePath = path.resolve(__dirname, "Sameer_Ali_Khan_Resume.pdf");
```

#### Change to YOUR path:

```javascript
// Example 1: If in a 'docs' subfolder
const resumePath = path.resolve(
  __dirname,
  "docs",
  "Sameer_Ali_Khan_Resume.pdf"
);

// Example 2: If using absolute path
const resumePath = "D:\\Portfolio\\Sameer_Ali_Khan_Resume.pdf";

// Example 3: If in 'public' folder
const resumePath = path.resolve(
  __dirname,
  "public",
  "Sameer_Ali_Khan_Resume.pdf"
);
```

---

## 🧪 TEST THE DOWNLOAD

After moving/updating:

1. **Restart the server:**

   ```bash
   Ctrl+C (stop current server)
   npm run dev
   ```

2. **Check the console for:**

   ```
   Resume file not found: [path shown here]
   ```

   If you see this error, the path is wrong.

3. **Test in browser:**
   - Visit: http://localhost:3000
   - Click the "Resume" button in navbar
   - PDF should download

---

## 📁 CURRENT PROJECT STRUCTURE

Your project should look like this:

```
D:\Portfolio\
├── server.js
├── database.js
├── package.json
├── Sameer_Ali_Khan_Resume.pdf  ← PUT IT HERE!
├── portfolio.db
├── .env
├── public\
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── analytics.js
└── logs\
    ├── activity.json
    └── access.log
```

---

## 🚨 TROUBLESHOOTING

### Error: "Resume file not found"

**Solution:** Check the console output - it will show the EXACT path it's looking for. Then either:

- Move your PDF to that location, OR
- Update line 197 in `server.js` to point to the correct location

### Error: "Failed to download resume"

**Solution:**

1. Make sure the file is named EXACTLY: `Sameer_Ali_Khan_Resume.pdf` (case-sensitive)
2. Check file permissions (should be readable)
3. Restart the server

### Download works but file is corrupted

**Solution:** Make sure it's a valid PDF file. Try opening it directly on your computer first.

---

## ✅ QUICK FIX COMMAND

**To check if your resume exists in the correct location:**

```powershell
Test-Path "D:\Portfolio\Sameer_Ali_Khan_Resume.pdf"
```

If it returns `False`, the file is NOT there. Find it and move it!

---

## 🎯 EXACT LINE TO EDIT

**File:** `D:\Portfolio\server.js`
**Line Number:** 197
**Current Code:**

```javascript
const resumePath = path.resolve(__dirname, "Sameer_Ali_Khan_Resume.pdf");
```

**Change the second parameter `'Sameer_Ali_Khan_Resume.pdf'` to match your file's location.**

---

**After fixing, restart the server and test the download button!**
