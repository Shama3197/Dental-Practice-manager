const express = require("express");
const router = express.Router();
const { google } = require('googleapis');

// Google Calendar API configuration
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/calendar/oauth2callback';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Store tokens (in production, use database)
const tokenStore = {};

/**
 * [GET] Initiate Google Calendar OAuth flow
 */
router.get("/auth", async (req, res) => {
  try {
    // Validate that credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google Calendar credentials not configured');
      return res.status(500).json({ 
        error: 'Google Calendar credentials not configured. Please check backend .env file.' 
      });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
    
    console.log('Generated auth URL:', authUrl);
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to initiate Google Calendar authentication',
      details: error.message 
    });
  }
});

/**
 * [GET] OAuth2 callback handler
 */
router.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Authorization code not provided');
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens (in production, associate with user session/ID)
    tokenStore.default = tokens;
    
    res.send(`
      <html>
        <body>
          <h2>Google Calendar Connected Successfully!</h2>
          <p>You can close this window and return to the application.</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Error during authentication. Please try again.');
  }
});

/**
 * [GET] Check if Google Calendar is connected
 */
router.get("/status", async (req, res) => {
  try {
    const hasTokens = !!tokenStore.default;
    const hasCredentials = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    res.json({ 
      connected: hasTokens,
      credentialsConfigured: hasCredentials
    });
  } catch (error) {
    console.error('Error checking connection status:', error);
    res.json({ connected: false, credentialsConfigured: false });
  }
});

/**
 * [GET] Fetch Google Calendar Events for a given day
 */
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    
    // Check if user is authenticated
    if (!tokenStore.default) {
      return res.json([]); // Return empty array if not connected
    }

    oauth2Client.setCredentials(tokenStore.default);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Parse date and set time range for the day
    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (response.data.items || []).map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
      htmlLink: event.htmlLink
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    
    // If token expired, clear it
    if (error.code === 401) {
      delete tokenStore.default;
      return res.status(401).json({ error: 'Authentication expired. Please reconnect.' });
    }
    
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

/**
 * [GET] Fetch calendar events for a date range
 */
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!tokenStore.default) {
      return res.json([]);
    }

    oauth2Client.setCredentials(tokenStore.default);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const startDate = start ? new Date(start) : new Date();
    const endDate = end ? new Date(end) : new Date();
    endDate.setDate(endDate.getDate() + 7); // Default to 7 days ahead

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (response.data.items || []).map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
      htmlLink: event.htmlLink
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events range:', error);
    if (error.code === 401) {
      delete tokenStore.default;
      return res.status(401).json({ error: 'Authentication expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

/**
 * [POST] Create new Google Calendar event
 */
router.post("/", async (req, res) => {
  try {
    const { summary, description, start, end, location } = req.body;
    
    if (!tokenStore.default) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    oauth2Client.setCredentials(tokenStore.default);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: summary || 'New Event',
      description: description || '',
      start: {
        dateTime: start || new Date().toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: end || new Date(Date.now() + 3600000).toISOString(), // Default 1 hour
        timeZone: 'UTC',
      },
      location: location || '',
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(201).json({
      id: response.data.id,
      summary: response.data.summary,
      start: response.data.start,
      end: response.data.end,
      htmlLink: response.data.htmlLink
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    if (error.code === 401) {
      delete tokenStore.default;
      return res.status(401).json({ error: 'Authentication expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

/**
 * [PUT] Update an existing calendar event
 */
router.put("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { summary, description, start, end, location } = req.body;
    
    if (!tokenStore.default) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    oauth2Client.setCredentials(tokenStore.default);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // First, get the existing event
    const existingEvent = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const updatedEvent = {
      ...existingEvent.data,
      summary: summary || existingEvent.data.summary,
      description: description !== undefined ? description : existingEvent.data.description,
      start: start ? { dateTime: start, timeZone: 'UTC' } : existingEvent.data.start,
      end: end ? { dateTime: end, timeZone: 'UTC' } : existingEvent.data.end,
      location: location !== undefined ? location : existingEvent.data.location,
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: updatedEvent,
    });

    res.json({
      id: response.data.id,
      summary: response.data.summary,
      start: response.data.start,
      end: response.data.end,
      htmlLink: response.data.htmlLink
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    if (error.code === 401) {
      delete tokenStore.default;
      return res.status(401).json({ error: 'Authentication expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
});

/**
 * [DELETE] Delete a calendar event
 */
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    if (!tokenStore.default) {
      return res.status(401).json({ error: 'Google Calendar not connected' });
    }

    oauth2Client.setCredentials(tokenStore.default);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    if (error.code === 401) {
      delete tokenStore.default;
      return res.status(401).json({ error: 'Authentication expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

module.exports = router;
