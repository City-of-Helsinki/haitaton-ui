# Testing Session Termination Functionality

This document describes how to test the automatic logout functionality for session termination errors.

## Unit Tests

Run the unit tests to verify the functionality:

```bash
npm test SessionTerminationHandler.test.tsx
npm test api.test.ts
```

These tests cover:

- SessionTerminationHandler component behavior
- API interceptor error detection using MSW
- Logout handler setup and cleanup
- Notification display and timing (4-second delay)
- Error code detection (HAI0006, HAI4008) using Set-based lookup
- Proper error handling in catch blocks

## Manual Testing Approaches

### 1. Browser DevTools Method (Recommended)

1. **Open the application** and log in
2. **Open DevTools** (F12) → Go to **Network** tab
3. **Find any API request** to `/api/*` endpoint
4. **Right-click** on the request → **Copy as curl**
5. **Modify the curl command** to return a 401 with session termination error:

```bash
# For HAI0006 (Session terminated)
curl -X GET 'http://localhost:3000/api/some-endpoint' \
  -H 'Authorization: Bearer your-token' \
  --fail-with-body \
  && echo '{"errorCode":"HAI0006","errorMessage":"Session terminated"}' \
  | curl -X POST 'http://localhost:3000/api/mock-session-termination' \
       -H 'Content-Type: application/json' \
       -d @- \
       --fail-with-body

# For HAI4008 (Verified name call was unauthorized)
curl -X GET 'http://localhost:3000/api/profiili/verified-name' \
  -H 'Authorization: Bearer your-token' \
  --fail-with-body \
  && echo '{"errorCode":"HAI4008","errorMessage":"Verified name call was unauthorized"}' \
  | curl -X POST 'http://localhost:3000/api/mock-session-termination' \
       -H 'Content-Type: application/json' \
       -d @- \
       --fail-with-body
```

### 2. Mock Service Worker (MSW) Method

Add a temporary mock in your development environment:

```typescript
// In your MSW handlers or test setup
import { http, HttpResponse } from 'msw';

const handlers = [
  // Mock session termination for testing
  http.get('/api/test-session-termination', () => {
    return HttpResponse.json(
      {
        errorCode: 'HAI0006',
        errorMessage: 'Session terminated',
      },
      { status: 401 },
    );
  }),

  http.get('/api/test-verified-name-error', () => {
    return HttpResponse.json(
      {
        errorCode: 'HAI4008',
        errorMessage: 'Verified name call was unauthorized',
      },
      { status: 401 },
    );
  }),
];
```

Then make requests to these endpoints in the browser console:

```javascript
// Test HAI0006
fetch('/api/test-session-termination').catch(console.log);

// Test HAI4008
fetch('/api/test-verified-name-error').catch(console.log);
```

### 3. Backend Modification Method

**Temporarily modify the backend** to return session termination errors:

1. Find any endpoint handler in the backend
2. Add a temporary condition to return 401 with the error codes:

```java
// Java/Spring example
@GetMapping("/test-session-termination")
public ResponseEntity<?> testSessionTermination() {
    Map<String, String> error = new HashMap<>();
    error.put("errorCode", "HAI0006");
    error.put("errorMessage", "Session terminated");
    return ResponseEntity.status(401).body(error);
}
```

3. Call this endpoint from the UI
4. **Remove the test endpoint** after testing

### 4. Proxy/Network Intercept Method

Use a tool like **Fiddler**, **Charles Proxy**, or **mitmproxy**:

1. Configure your browser to use the proxy
2. Set up a rule to intercept API requests
3. Modify responses to return 401 with session termination error codes
4. Test the UI behavior

## Expected Behavior

When testing, you should observe:

1. **Notification appears** in the top-right corner with the message:
   - Finnish: "Istunto on päättynyt. Sinut kirjataan automaattisesti ulos."
   - English: "Your session has ended. You will be automatically logged out."
   - Swedish: "Din session har avslutats. Du kommer att loggas ut automatiskt."

2. **Notification characteristics**:
   - Type: Info (blue)
   - Auto-close: 5 seconds
   - Not dismissible by user
   - Appears in top-right position

3. **Automatic logout**:
   - Occurs 4 seconds after notification appears
   - User is redirected to Helsinki Profiili logout page
   - Session is properly cleared

4. **Console logging**:
   - Warning message: "Session terminated with error code: [code]. Logging out..."

## Testing Different Scenarios

1. **Test both error codes**: HAI0006 and HAI4008
2. **Test with different languages**: Switch UI language and verify notification text
3. **Test logout flow**: Verify user is properly logged out and redirected
4. **Test other 401 errors**: Verify that other 401 responses don't trigger logout
5. **Test non-401 errors**: Verify that non-401 responses with session error codes don't trigger logout

## Troubleshooting

- **Notification doesn't appear**: Check that SessionTerminationHandler is properly mounted within GlobalNotificationProvider
- **Logout doesn't occur**: Verify that the OIDC client is available and logout handler is set
- **Wrong language**: Check the i18n configuration and language setting
- **Tests fail**:
  - Ensure all mocks are properly set up and timing is handled correctly with fake timers
  - Verify MSW server uses the global test-server setup (not a separate server instance)
  - Check that error codes are being detected using the Set-based lookup
  - Ensure catch blocks properly validate expected errors with assertions
