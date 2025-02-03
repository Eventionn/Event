import routesEventService from '../services/routesEventService.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const loadErrorMessages = (lang) => {
  const errorMessagesPath = path.join(__dirname, '../config', 'errorMessages.json');
  const errorMessages = JSON.parse(fs.readFileSync(errorMessagesPath, 'utf-8'));
  const languageCode = lang.split(',')[0].split('-')[0];

  return errorMessages[languageCode] || errorMessages.en;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesEventController = {

  /**
   * Get all routes events
   * @route {GET} /routes-events
   * @returns {Array} List of routes events
   * @description Fetches all route events from the database.
   * If no route events are found, it returns a 404 response.
   */
  async getAllRoutesEvents(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const routesEvents = await routesEventService.getAllRoutesEvents();

      if (routesEvents == null || routesEvents.length === 0) {
        return res.status(404).json({ message: errorMessages.NO_ROUTES_EVENTS_FOUND });
      }

      res.status(200).json(routesEvents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_ROUTES_EVENTS });
    }
  },

  /**
   * Get a specific route event by routeID
   * @route {GET} /routes-events/:routeID
   * @param {string} routeID - The ID of the route event
   * @returns {Object} The route event object
   * @description Fetches a specific route event by its ID.
   * If the route event is not found, it returns a 404 response.
   */
  async getRoutesEventById(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const routeID = req.params.id;
      const routesEvent = await routesEventService.getRoutesEventById(routeID);

      if (!routesEvent) {
        return res.status(404).json({ message: errorMessages.ROUTES_EVENT_NOT_FOUND });
      }

      res.status(200).json(routesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_ROUTES_EVENT });
    }
  },

  /**
   * Create a new route event
   * @route {POST} /routes-events
   * @bodyparam {Object} routesEventData - The data for creating a route event
   * @param {number} routesEventData.latitude - The latitude of the route event
   * @param {number} routesEventData.longitude - The longitude of the route event
   * @param {number} routesEventData.order - The order of the route event
   * @param {string} routesEventData.addressEvent_id - The ID of the address event
   * @returns {Object} The newly created route event
   * @description Creates a new route event with the provided data.
   * If any required field is missing, it returns a 400 response.
   */
  async createRoutesEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const { latitude, longitude, order, addressEvent_id } = req.body;
      
      if (latitude === undefined || longitude === undefined || order === undefined || !addressEvent_id) {
        return res.status(400).json({ message: errorMessages.MISSING_REQUIRED_FIELDS });
      }

      const newRoutesEvent = await routesEventService.createRoutesEvent(req.body);
      res.status(201).json(newRoutesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_CREATING_ROUTES_EVENT });
    }
  },

  /**
   * Update an existing route event
   * @route {PUT} /routes-events/:routeID
   * @param {string} routeID - The ID of the route event to update
   * @bodyparam {Object} routesEventData - The new data for the route event
   * @returns {Object} The updated route event
   * @description Updates an existing route event with the provided data.
   * If the route event is not found, it returns a 404 response.
   */
  async updateRoutesEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const routeID = req.params.id;
      const routesEventData = req.body;

      const routesEvent = await routesEventService.getRoutesEventById(routeID);
      if (!routesEvent) {
        return res.status(404).json({ message: errorMessages.ROUTES_EVENT_NOT_FOUND });
      }

      const updatedRoutesEvent = await routesEventService.updateRoutesEvent(routeID, routesEventData);
      res.status(200).json(updatedRoutesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_UPDATING_ROUTES_EVENT });
    }
  },

  /**
   * Delete a route event
   * @route {DELETE} /routes-events/:routeID
   * @param {string} routeID - The ID of the route event to delete
   * @returns {Object} Success message or error
   * @description Deletes a route event by its ID.
   * If the route event is not found, it returns a 404 response.
   */
  async deleteRoutesEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const routeID = req.params.id;
  
      const routesEvent = await routesEventService.getRoutesEventById(routeID);
      if (!routesEvent) {
        return res.status(404).json({ message: errorMessages.ROUTES_EVENT_NOT_FOUND });
      }
  
      await routesEventService.deleteRoutesEvent(routeID);
      res.status(204).send();
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_DELETING_ROUTES_EVENT });
    }
  }
};

export default routesEventController;
