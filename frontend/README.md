# User Management System with Image Capturing

## Tech Stack
- Frontend: Angular 21 + Angular Material
- Backend: Node.js + Express
- Database: MongoDB

## Prerequisites
- Node.js v18+
- MongoDB installed and running
- Angular CLI: `npm install -g @angular/cli`

## How to Run Locally

### Step 1 - Start MongoDB
```bash
net start MongoDB   # Windows (run as Administrator)
```

### Step 2 - Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Step 3 - Start Frontend
```bash
cd frontend
npm install
ng serve
# Runs on http://localhost:4200
```

## Default Admin Login
- Username: admin
- Password: Admin@123

## Role Permissions
| Feature | Admin | Supervisor | Worker |
|---|---|---|---|
| Create/Delete users | ✅ | ❌ | ❌ |
| Assign roles | ✅ | ❌ | ❌ |
| View all images | ✅ | ✅ | ❌ |
| Capture images | ✅ | ✅ | ✅ |
| View own images | ✅ | ✅ | ✅ |

## How to Test

### Test Admin
1. Open http://localhost:4200
2. Login with admin / Admin@123
3. Go to Admin Panel — create a Supervisor and Worker user
4. Go to All Images — see all captured images
5. Go to Camera — capture and save images

### Test Supervisor
1. Logout and login as Supervisor
2. Can access Camera and All Images
3. Cannot access Admin Panel (shows Forbidden page)

### Test Worker
1. Logout and login as Worker
2. Can only access Camera
3. Cannot access Admin Panel or All Images

## Security Features
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 8 hours
- Role-based middleware on all backend routes
- Images protected — only authenticated users can view
- Rate limiting: 100 requests/15min general, 10 login attempts/15min
- Helmet.js for HTTP security headers
- File type validation (JPEG/PNG/WEBP only, max 5MB)

## Challenges & Decisions

### 1. Angular 21 SSR (Server Side Rendering)
Angular 21 enables SSR by default. This caused issues where
localStorage was unavailable on server side, making auth
guards redirect users incorrectly. Fixed using isPlatformBrowser()
checks throughout all components and guards.

### 2. JWT Authentication
JWT tokens are stored in localStorage and automatically
attached to every HTTP request via an Angular HTTP interceptor.
This keeps all API calls authenticated without manual token passing.

### 3. Camera Implementation
Used browser's getUserMedia API to access the device camera.
Added 100ms delay before attaching the media stream to the
video element to ensure the DOM was ready after Angular
rendered the component.

### 4. Secure Image Storage
Images are stored on the server with unique filenames
(userId + timestamp) to prevent conflicts. The /uploads
folder is protected by JWT verification middleware —
unauthenticated users cannot access image URLs directly.

### 5. Role-Based Access Control
Three roles implemented with different permission levels.
Angular route guards prevent unauthorized navigation on
frontend. Backend middleware independently verifies roles
on every API call for double security.

### 6. Helmet CSP Configuration
Default Helmet Content Security Policy blocked cross-origin
images from the backend. Disabled CSP and set
crossOriginResourcePolicy to cross-origin to allow
secure image loading between frontend and backend ports.