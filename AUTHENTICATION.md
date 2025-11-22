# MoChat Authentication & Session Management

## Overview
Complete authentication and session management system for MoChat - a real-time chat application built with Expo React Native and Node.js backend.

## Features Implemented

### ✅ User Authentication
- **Email & Password Login** - Secure login with validation
- **User Registration** - Create new accounts with validation
- **Password Security** - Bcrypt hashing on backend (10 salt rounds)
- **JWT Tokens** - Secure token-based authentication (7-day expiry)

### ✅ Session Management
- **Persistent Sessions** - User stays logged in across app restarts
- **Auto Session Validation** - Validates token on app start
- **Token Refresh** - Endpoint to refresh expired tokens
- **Secure Logout** - Clears all session data and updates online status

### ✅ Online Status Tracking
- **Real-time Status** - Online/offline status updated via WebSocket
- **Last Seen** - Timestamp of last activity
- **Auto Status Update** - Updates on login, logout, WebSocket connect/disconnect

### ✅ Form Validation
- **Email Validation** - Regex pattern validation
- **Password Requirements** - Minimum 6 characters
- **Name Validation** - Minimum 2 characters
- **Real-time Error Display** - Inline error messages
- **Match Validation** - Password confirmation matching

## API Endpoints

### Authentication Routes
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, token, user }

POST /api/auth/login
Body: { email, password }
Response: { success, token, user }

POST /api/auth/logout (Protected)
Headers: { Authorization: Bearer <token> }
Response: { success, message }

GET /api/auth/profile (Protected)
Headers: { Authorization: Bearer <token> }
Response: { success, user }

POST /api/auth/refresh (Protected)
Headers: { Authorization: Bearer <token> }
Response: { success, token, user }
```

## Frontend Implementation

### AuthContext
Location: `src/contexts/AuthContext.js`

**State Management:**
- `user` - Current user object
- `loading` - Loading state during auth check
- `isAuthenticated` - Boolean authentication status

**Methods:**
- `login(email, password)` - Login user
- `register(name, email, password)` - Register new user
- `logout()` - Logout and clear session
- `refreshToken()` - Refresh JWT token
- `checkAuthStatus()` - Validate session on app start
- `updateUser(userData)` - Update user data

**Auto Session Validation:**
```javascript
useEffect(() => {
  checkAuthStatus(); // Runs on app start
}, []);
```

### WebSocketContext
Location: `src/contexts/WebSocketContext.js`

**Features:**
- Auto-connects when user is authenticated
- Disconnects on logout
- Tracks online users
- Manages connection state

**Integration:**
```javascript
useEffect(() => {
  if (isAuthenticated) {
    initializeWebSocket();
  } else {
    WebSocketService.disconnect();
  }
}, [isAuthenticated]);
```

## Backend Implementation

### User Model
Location: `src/models/User.js`

**Schema:**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String (optional),
  online: Boolean (default: false),
  lastSeen: Date (default: now)
}
```

**Methods:**
- `comparePassword(password)` - Compare hashed passwords
- Pre-save hook - Auto-hash password before saving

### Auth Controller
Location: `src/controllers/authController.js`

**Functions:**
- `register` - Create new user account
- `login` - Authenticate user and update online status
- `logout` - Set user offline and update lastSeen
- `getProfile` - Get current user profile
- `refreshToken` - Generate new JWT token

### JWT Token Generation
Location: `src/utils/generateToken.js`

```javascript
jwt.sign({ id: userId }, JWT_SECRET, {
  expiresIn: JWT_EXPIRE // Default: 7 days
})
```

### Auth Middleware
Location: `src/middleware/auth.js`

**Protection:**
- Verifies JWT token from Authorization header
- Attaches user to request object
- Returns 401 if invalid/missing token

## Security Features

### Frontend Security
1. **Token Storage** - Secure AsyncStorage for tokens
2. **Auto-clear on Expire** - Removes invalid tokens
3. **Input Sanitization** - Trim and lowercase emails
4. **Password Confirmation** - Prevent typos
5. **Disable on Loading** - Prevent multiple submissions

### Backend Security
1. **Bcrypt Hashing** - Password encryption (10 rounds)
2. **JWT Tokens** - Stateless authentication
3. **Token Expiry** - 7-day automatic expiration
4. **Protected Routes** - Middleware authentication
5. **CORS Enabled** - Cross-origin security

## Usage Examples

### Login Flow
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  
  if (result.success) {
    // User automatically redirected to main app
    console.log('Logged in:', result.data);
  } else {
    // Show error
    Alert.alert('Login Failed', result.error);
  }
};
```

### Registration Flow
```javascript
const { register } = useAuth();

const handleRegister = async () => {
  const result = await register(name, email, password);
  
  if (result.success) {
    // User automatically logged in and redirected
    console.log('Registered:', result.data);
  } else {
    // Show error
    Alert.alert('Registration Failed', result.error);
  }
};
```

### Logout Flow
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User automatically redirected to login screen
  // WebSocket disconnected
  // All session data cleared
};
```

### Protected API Calls
```javascript
import { authAPI } from '../services/apiService';

// Token automatically added via interceptor
const profile = await authAPI.getProfile();
```

## Session Lifecycle

### App Start
1. Check AsyncStorage for token and user data
2. If found, validate token via `/api/auth/profile`
3. If valid, set authenticated state
4. If invalid, clear storage and show login screen

### Login
1. User enters credentials
2. Frontend validates input
3. POST to `/api/auth/login`
4. Backend validates, sets online status
5. Returns token and user data
6. Frontend stores in AsyncStorage
7. WebSocket auto-connects
8. Redirect to main app

### Session Active
1. Token included in all API requests
2. WebSocket maintains connection
3. Online status tracked
4. Auto-refresh available if needed

### Logout
1. POST to `/api/auth/logout`
2. Backend sets user offline
3. Frontend clears AsyncStorage
4. WebSocket disconnects
5. Redirect to login screen

## Error Handling

### Frontend Error Messages
- "Email is required"
- "Please enter a valid email"
- "Password is required"
- "Password must be at least 6 characters"
- "Passwords do not match"
- "Name must be at least 2 characters"

### Backend Error Messages
- "User already exists" (409)
- "Invalid credentials" (401)
- "Server error" (500)
- "Invalid token" (401)
- "Token expired" (401)

## Testing

### Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mochat
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

### Frontend (constants.js)
```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
export const WS_BASE_URL = 'ws://localhost:3000';
```

## Troubleshooting

### "Invalid credentials" error
- Check email and password are correct
- Ensure email is lowercase
- Verify user exists in database

### Token expired
- Use refresh token endpoint
- Login again to get new token

### WebSocket not connecting
- Verify backend is running
- Check token is valid
- Ensure correct WebSocket URL

### Session not persisting
- Check AsyncStorage permissions
- Verify token validation logic
- Check network connectivity

## Next Steps

### Recommended Enhancements
- [ ] Social authentication (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Password reset via email
- [ ] Remember me functionality
- [ ] Session timeout warnings
- [ ] Multiple device management
- [ ] Biometric authentication

## Security Best Practices

1. **Never log tokens** in production
2. **Use HTTPS** in production
3. **Rotate JWT secrets** regularly
4. **Implement rate limiting** on auth endpoints
5. **Add CAPTCHA** for bot protection
6. **Monitor failed login attempts**
7. **Use environment variables** for secrets

---

**Status:** ✅ Fully Implemented and Tested
**Last Updated:** November 22, 2025
