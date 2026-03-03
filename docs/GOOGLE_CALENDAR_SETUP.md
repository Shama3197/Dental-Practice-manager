# Google Calendar Integration Setup Guide

This guide explains how to set up Google Calendar integration for the Oryx Dental Practice Manager.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A Google Cloud project with the Calendar API enabled

## Step 1: Create Google Cloud Project and Enable Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, etc.)
   - Add scopes: `https://www.googleapis.com/auth/calendar`
   - Add test users (your email) if in testing mode
4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Oryx Calendar Integration"
   - Authorized redirect URIs:
     - `http://localhost:5000/api/calendar/oauth2callback` (for local development)
     - `https://your-domain.com/api/calendar/oauth2callback` (for production)
5. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

Add the following to your `tracker-backend/.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/oauth2callback
```

For production, update `GOOGLE_REDIRECT_URI` to your production URL.

## Step 4: Install Dependencies

The `googleapis` package should already be installed. If not, run:

```bash
cd tracker-backend
npm install googleapis
```

## Step 5: Connect Google Calendar

1. Start your backend server:
   ```bash
   cd tracker-backend
   npm run dev
   ```

2. In the frontend application:
   - Navigate to Dashboard or Calendar page
   - Click "Connect Google Calendar" button
   - You'll be redirected to Google's OAuth consent screen
   - Sign in with your Google account
   - Grant permissions to access your calendar
   - You'll be redirected back to the application

## Step 6: Verify Integration

After connecting:
- The "Connect Google Calendar" button should change to "✓ Connected"
- Calendar events should appear in the calendar view
- Events from your Google Calendar will sync automatically

## Features

- **View Events**: See all events from your Google Calendar for any selected date
- **Create Events**: Create new events that sync to Google Calendar
- **Update Events**: Modify existing events
- **Delete Events**: Remove events from Google Calendar
- **Date Range**: Fetch events for a specific date range

## API Endpoints

- `GET /api/calendar/auth` - Initiate OAuth flow
- `GET /api/calendar/oauth2callback` - OAuth callback handler
- `GET /api/calendar/status` - Check connection status
- `GET /api/calendar?date=YYYY-MM-DD` - Get events for a specific date
- `GET /api/calendar/range?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get events for a date range
- `POST /api/calendar` - Create a new event
- `PUT /api/calendar/:eventId` - Update an event
- `DELETE /api/calendar/:eventId` - Delete an event

## Troubleshooting

### "Authentication expired" error
- Reconnect your Google Calendar by clicking "Connect Google Calendar" again

### Events not showing
- Check that the Calendar API is enabled in Google Cloud Console
- Verify your OAuth credentials are correct in `.env`
- Check browser console for any errors

### Redirect URI mismatch
- Ensure the redirect URI in Google Cloud Console matches exactly with `GOOGLE_REDIRECT_URI` in your `.env` file
- Include the full path: `/api/calendar/oauth2callback`

## Security Notes

⚠️ **Important**: The current implementation stores tokens in memory. For production:
- Store tokens in a secure database associated with user sessions
- Implement proper session management
- Use HTTPS for all OAuth redirects
- Consider implementing token refresh logic

## Production Considerations

1. **Token Storage**: Implement database-backed token storage per user
2. **Token Refresh**: Add automatic token refresh before expiration
3. **Error Handling**: Implement comprehensive error handling and user feedback
4. **Rate Limiting**: Google Calendar API has rate limits - implement proper handling
5. **Security**: Use environment-specific redirect URIs and secure token storage
