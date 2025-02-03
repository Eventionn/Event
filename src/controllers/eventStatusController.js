import eventStatusService from '../services/eventStatusService.js';
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


const eventStatusController = {

  /**
   * Get all event statuses
   * @route {GET} /event-statuses
   * @returns {Array} List of event statuses
   * @description Fetches all event statuses from the database.
   * If no event statuses are found, it returns a 404 response.
   */
  async getAllEventStatuses(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventStatuses = await eventStatusService.getAllEventStatuses();

      if (eventStatuses == null || eventStatuses.length === 0) {
        return res.status(404).json({ message: errorMessages.NO_EVENT_STATUSES_FOUND });
      }

      res.status(200).json(eventStatuses);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENT_STATUSES });
    }
  },

  /**
   * Get a specific event status by eventStatusID
   * @route {GET} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status
   * @returns {Object} The event status object
   * @description Fetches a specific event status by its ID.
   * If the event status is not found, it returns a 404 response.
   */
  async getEventStatusById(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventStatusID = req.params.id;
      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);

      if (!eventStatus) {
        return res.status(404).json({ message: errorMessages.NO_EVENT_STATUSES_FOUND });
      }

      res.status(200).json(eventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENT_STATUSES });
    }
  },

  /**
   * Create a new event status
   * @route {POST} /event-statuses
   * @bodyparam {Object} eventStatusData - The data for creating an event status
   * @returns {Object} The newly created event status
   * @description Creates a new event status with the provided data.
   * If any required field is missing, it returns a 400 response.
   */
  async createEventStatus(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: errorMessages.MISSING_REQUIRED_FIELD_STATUS });
      }

      const newEventStatus = await eventStatusService.createEventStatus(req.body);
      res.status(201).json(newEventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_CREATING_EVENT_STATUS });
    }
  },

  /**
   * Update an existing event status
   * @route {PUT} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status to update
   * @bodyparam {Object} eventStatusData - The new data for the event status
   * @returns {Object} The updated event status
   * @description Updates an existing event status with the provided data.
   * If the event status is not found, it returns a 404 response.
   */
  async updateEventStatus(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventStatusID = req.params.id;
      const eventStatusData = req.body;

      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);
      if (!eventStatus) {
        return res.status(404).json({ message: errorMessages.NO_EVENT_STATUSES_FOUND });
      }

      const updatedEventStatus = await eventStatusService.updateEventStatus(eventStatusID, eventStatusData);
      res.status(200).json(updatedEventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_UPDATING_EVENT_STATUS });
    }
  },

  /**
   * Delete an event status
   * @route {DELETE} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status to delete
   * @returns {Object} Success message or error
   * @description Deletes an event status by its ID.
   * If the event status is not found, it returns a 404 response.
   */
  async deleteEventStatus(req, res) {
    const lang = req.headers['accept-language'] || 'en'; 
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventStatusID = req.params.id;

      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);
      if (!eventStatus) {
        return res.status(404).json({ message: errorMessages.NO_EVENT_STATUSES_FOUND });
      }

      await eventStatusService.deleteEventStatus(eventStatusID);
      res.status(204).send();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_DELETING_EVENT_STATUS });
    }
  }
};

export default eventStatusController;
