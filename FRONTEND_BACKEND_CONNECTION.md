# Frontend-Backend Connection Verification

## ✅ FIXES APPLIED

### 1. Fixed Authentication Endpoints
**File**: `src/api/authApi.js`

Changed from (WRONG):
- `/api/auth/login/` ❌
- `/api/auth/logout/` ❌
- `/api/auth/profile/` ❌

To (CORRECT):
- `/api/teacher/login/` ✅ (works for both teachers and admins)
- `/api/teacher/logout/` ✅
- `/api/teacher/profile/` ✅

### 2. API Base URL Configuration
**File**: `.env`
```
VITE_API_BASE_URL=https://lbca-monitoring-system-backend.onrender.com
VITE_USE_MOCK_FALLBACK=false
```

### 3. Student API Endpoints
**File**: `src/api/studentsApi.js`
- ✅ `/api/students/` - List students
- ✅ `/api/students/{id}/` - Get student
- ✅ `/api/students/` - Create student
- ✅ `/api/students/{id}/` - Update student
- ✅ `/api/students/{id}/ai-analysis/` - Get AI analysis

---

## 📋 TESTING CHECKLIST

### Local Development (http://127.0.0.1:8000)
1. Update `.env` to use local backend:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

2. Ensure both are running:
   - Backend: `python manage.py runserver` (port 8000)
   - Frontend: `npm run dev` (port 5173)

3. Test login with credentials:
   - Username: Admin username (e.g., ADMIN001)
   - Password: Corresponding password

### Production (Render)
1. `.env` should point to:
   ```
   VITE_API_BASE_URL=https://lbca-monitoring-system-backend.onrender.com
   ```

2. Backend Render service must have:
   - `DATABASE_URL` set (PostgreSQL)
   - `SECRET_KEY` set
   - `DEBUG=False`
   - `ALLOWED_HOSTS` set to your Render domain
   - `CORS_ALLOWED_ORIGINS` includes frontend domain

3. Frontend Render service must:
   - Build: `npm ci && npm run build`
   - Publish: `dist`

---

## 🔍 VERIFICATION STEPS

### 1. Test Login Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/teacher/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"ADMIN001","password":"ADMIN001"}'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "abc123...",
  "role": "Admin",
  "username": "ADMIN001"
}
```

### 2. Test Students Endpoint (with token)
```bash
curl -X GET http://127.0.0.1:8000/api/students/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 3. Browser Console Check
Open DevTools (F12) → Network tab → Check:
- Login request goes to `/api/teacher/login/` ✅
- Student requests go to `/api/students/` ✅
- All requests include `Authorization: Token ...` ✅

---

## ⚠️ COMMON ISSUES

| Issue | Solution |
|-------|----------|
| 404 on login | Wrong endpoint path - now fixed |
| CORS error | Ensure `CORS_ALLOWED_ORIGINS` in backend includes frontend domain |
| 401 Unauthorized | Token not sent or expired - check localStorage |
| Student creation fails | Ensure user is Admin role |

---

## 📁 API Configuration Files

**Client Configuration**: `src/api/client.js`
- Reads `VITE_API_BASE_URL` from `.env`
- Falls back to `http://127.0.0.1:8000`
- Handles token management

**Authentication**: `src/api/authApi.js` ✅ FIXED
- Teacher login: `/api/teacher/login/`
- Admin register: `/api/admin/register/`
- Logout: `/api/teacher/logout/`

**Students**: `src/api/studentsApi.js` ✅ CORRECT
- All endpoints match backend structure
