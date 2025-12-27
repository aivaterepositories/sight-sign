# Testing Guide - Worker Registration

**Created:** 2025-12-28
**Week 1 - Priority 1:** Worker Registration + QR Code Generation

---

## ✅ What Was Built

### Features Implemented
- ✅ Worker registration form with validation
- ✅ Supabase Auth integration
- ✅ Automatic QR code generation on signup
- ✅ Worker dashboard with QR code display
- ✅ QR code download functionality
- ✅ Login page for returning users
- ✅ Responsive design (mobile + desktop)

### Pages Created
- **/** - Home page with feature overview
- **/register** - Worker registration form
- **/login** - Authentication page
- **/worker/dashboard** - QR code display and worker info

---

## 🧪 Testing Checklist

### Test 1: Worker Registration (Happy Path)

**Steps:**
1. Make sure `npm run dev` is running
2. Open browser: http://localhost:3000
3. Click **"Register as Worker"** button
4. Fill in the form:
   - **Full Name:** John Doe
   - **Email:** john.doe@example.com
   - **Password:** password123
   - **Phone:** (555) 123-4567 (optional)
   - **Company:** ABC Construction Co.
5. Click **"Create Account"**
6. Wait for redirect to worker dashboard

**Expected Results:**
- ✅ Form submits successfully
- ✅ Redirects to `/worker/dashboard`
- ✅ Dashboard displays worker name: "Welcome back, John Doe"
- ✅ QR code image is displayed (300x300px black/white QR)
- ✅ Worker info shows: name, company, phone, member since date
- ✅ "Download QR Code" button is clickable

---

### Test 2: QR Code Download

**Steps:**
1. On the worker dashboard, click **"Download QR Code"** button
2. Check your Downloads folder

**Expected Results:**
- ✅ PNG file downloads: `John-Doe-QR-Code.png`
- ✅ File contains valid QR code image
- ✅ QR code can be scanned (use your phone's camera app)

---

### Test 3: Login Flow

**Steps:**
1. On worker dashboard, click **"Sign Out"**
2. Should redirect to home page
3. Click **"Admin Login"** (goes to /login)
4. Enter your credentials:
   - **Email:** john.doe@example.com
   - **Password:** password123
5. Click **"Sign In"**

**Expected Results:**
- ✅ Sign out successful
- ✅ Login form accepts credentials
- ✅ Redirects back to `/worker/dashboard`
- ✅ Same QR code is displayed (persistent)

---

### Test 4: Validation & Error Handling

**Test 4a: Required Fields**
1. Go to /register
2. Try submitting empty form

**Expected Results:**
- ✅ Browser shows "Please fill out this field" for required fields
- ✅ Form does not submit

**Test 4b: Password Minimum Length**
1. Go to /register
2. Enter password: "abc" (less than 6 characters)
3. Try to submit

**Expected Results:**
- ✅ Browser shows "Please lengthen this text to 6 characters or more"

**Test 4c: Duplicate Email**
1. Try registering with same email again
2. Use: john.doe@example.com

**Expected Results:**
- ✅ Shows error: "User already registered"
- ✅ Error message displayed in red box

**Test 4d: Invalid Email**
1. Go to /register
2. Enter email: "notanemail"
3. Try to submit

**Expected Results:**
- ✅ Browser shows "Please include an '@' in the email address"

---

### Test 5: Database Verification

**Check Supabase Dashboard:**

1. Go to: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/editor
2. Click **"workers"** table
3. You should see your registered worker

**Expected Data:**
- ✅ `id` matches auth user ID
- ✅ `name`: John Doe
- ✅ `company`: ABC Construction Co.
- ✅ `phone`: (555) 123-4567
- ✅ `qr_code_hash`: starts with "worker-" (e.g., worker-uuid-random)
- ✅ `created_at`: current timestamp
- ✅ `updated_at`: current timestamp

**Check auth.users table:**
1. Go to: Authentication → Users
2. You should see your user

**Expected Data:**
- ✅ Email: john.doe@example.com
- ✅ Email confirmed: ✅ (auto-confirmed for local dev)

---

### Test 6: Mobile Responsiveness

**Steps:**
1. Open Chrome DevTools (F12)
2. Click device toolbar (Cmd+Shift+M on Mac)
3. Select iPhone 12 Pro
4. Navigate through: Home → Register → Login → Dashboard

**Expected Results:**
- ✅ All pages are mobile-responsive
- ✅ Forms are easy to fill on mobile
- ✅ QR code fits on screen
- ✅ Buttons are touch-friendly (min 44x44px)
- ✅ Text is readable without zooming

---

## 🐛 Known Issues / Limitations

### Current MVP Limitations:
- ⚠️ Email confirmation disabled (auto-confirm for development)
- ⚠️ Password reset not implemented (Phase 2)
- ⚠️ No email verification required
- ⚠️ "Recent Sign-Ins" section shows placeholder (Week 2 feature)
- ⚠️ Admin dashboard redirect shows 404 (Week 2 feature)

### Expected Behaviors (Not Bugs):
- Auto sign-out at 6 PM: Not implemented yet (Week 2)
- QR scanning: Not implemented yet (Week 2)
- Safety quiz: Not implemented yet (Week 3)

---

## 🔍 Debugging Common Issues

### Issue: "Missing Supabase environment variables"

**Fix:**
- Check `.env.local` exists in project root
- Verify it contains all 3 required variables
- Restart `npm run dev`

### Issue: "Failed to generate QR code"

**Fix:**
- Check browser console for errors
- Verify `qrcode` library is installed: `npm list qrcode`
- Try clearing browser cache

### Issue: Page shows TypeScript errors

**Fix:**
- Stop and restart `npm run dev`
- Check terminal for compilation errors
- Verify all imports use `@/` path aliases

### Issue: Registration succeeds but dashboard shows error

**Fix:**
- Check Supabase dashboard → Table Editor → workers
- Verify RLS policies allow workers to read their own data
- Check browser console for API errors

---

## 📊 Success Criteria

**Week 1, Priority 1 is complete when:**

- ✅ Worker can register with email + password
- ✅ Worker profile is created in database
- ✅ Unique QR code is generated automatically
- ✅ Worker can view their QR code on dashboard
- ✅ Worker can download QR code as PNG
- ✅ Worker can sign out and sign back in
- ✅ Same QR code persists across sessions
- ✅ Mobile responsive on all pages

---

## 🚀 Next Steps (Week 1, Priority 2)

After testing is complete, next features to build:

**Week 1, Priority 2: Admin Dashboard Shell**
- [ ] Create admin dashboard page
- [ ] Set up admin role in Supabase
- [ ] Create sites table UI
- [ ] Test: Admin can access empty dashboard

**Week 2, Priority 1: QR Scanning**
- [ ] Install html5-qrcode library
- [ ] Create QR scanner component
- [ ] Implement QR code validation
- [ ] Test: Admin can scan worker QR

---

## 📝 Test Results Template

Copy this template to report test results:

```
Test Date: ___________
Tester: ___________

Test 1: Worker Registration
- Status: [ ] Pass [ ] Fail
- Notes:

Test 2: QR Code Download
- Status: [ ] Pass [ ] Fail
- Notes:

Test 3: Login Flow
- Status: [ ] Pass [ ] Fail
- Notes:

Test 4: Validation & Error Handling
- Status: [ ] Pass [ ] Fail
- Notes:

Test 5: Database Verification
- Status: [ ] Pass [ ] Fail
- Notes:

Test 6: Mobile Responsiveness
- Status: [ ] Pass [ ] Fail
- Notes:

Overall Status: [ ] All Pass [ ] Has Failures
```

---

**Ready to test?** Open http://localhost:3000/register and follow Test 1 above!
