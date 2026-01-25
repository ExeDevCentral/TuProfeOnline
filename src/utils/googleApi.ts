import axios from 'axios';
import { gapi } from 'gapi-script';

const API_KEY = 'YOUR_GOOGLE_API_KEY';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly';

export const initClient = () => {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        });
    });
};

export const getCalendarEvents = async () => {
    try {
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        });
        return response.result.items;
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
};

export const getGmailMessages = async () => {
    try {
        // This is a simplified example. Gmail API requires more setup for list/get details.
        const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
            headers: {
                Authorization: `Bearer ${gapi.auth.getToken().access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Gmail messages:', error);
        return null;
    }
};
