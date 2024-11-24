import eventService from '../services/eventService.js';
import eventStatusService from '../services/eventStatusService.js';
import axios from 'axios';

const eventController = {

  /**
   * Get all events
   * @route {GET} /events
   * @returns {Array} List of events
   */
  async getAllEvents(req, res) {
    try {
      const events = await eventService.getAllEvents();

      if (events == null || events.length === 0) {
        return res.status(404).json({ message: 'No events found' });
      }

      res.status(200).json(events);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  },

  /**
   * Get user events
   * @route {GET} /events/my
   * @param {string} id - The ID of the event
   * @returns {Array} List of events
   */
  async getUserEvents(req, res) {
    try {
      const userId = req.user.userID;

      const events = await eventService.getUserEvents(userId);

      if (events == null || events.length === 0) {
        return res.status(404).json({ message: 'No events found' });
      }

      res.status(200).json(events);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  },

  /**
   * Get a specific event by ID
   * @route {GET} /events/:id
   * @param {string} id - The ID of the event
   * @returns {Object} The event object
   */
  async getEventById(req, res) {
    try {
      const eventId = req.params.id;
      const event = await eventService.getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(event);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching event' });
    }
  },

  /**
   * Create a new event
   * @route {POST} /events
   * @bodyparam {Object} eventData - The data for creating an event
   * @returns {Object} The newly created event
   */
  async createEvent(req, res) {
    try {
      const { userId, name, description, startAt, endAt, price, eventstatus_id } = req.body;
      if (!userId || !name || !description || !startAt || !endAt || !price || !eventstatus_id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const userExists = await axios.get(`http://userservice:5001/api/users/${userId}`);

      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json(newEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating event' });
    }
  },

  /**
   * Update an existing event
   * @route {PUT} /events/:id
   * @param {string} id - The ID of the event to update
   * @bodyparam {Object} eventData - The new data for the event
   * @returns {Object} The updated event
   */
  async updateEvent(req, res) {
    try {
      const eventId = req.params.id;
      const eventData = req.body;

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      res.status(200).json(updatedEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event' });
    }
  },

  /**
   * Update an event status
   * @route {PUT} /events/:id/status
   * @param {string} id - The ID of the event to update
   * @returns {Object} The updated event
   */
  async updateEventStatus(req, res) {
    try {
      const eventId = req.params.id;

      const eventStatusPending = await eventStatusService.getEventStatusByStatus('Pendente');
      const eventStatusApproved = await eventStatusService.getEventStatusByStatus('Aprovado');

      if (!eventStatusPending || !eventStatusApproved) {
        return res.status(404).json({ message: 'Event status not found' });
      }

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.eventstatus_id === eventStatusPending.eventStatusID) {
        const updatedEvent = await eventService.updateEventStatus(eventId, eventStatusApproved.eventStatusID);
        return res.status(200).json(updatedEvent);
      }

      return res.status(400).json({ message: 'Event status is not pending' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event status' });
    }
  },

  /**
   * Delete an event
   * @route {DELETE} /events/:id
   * @param {string} id - The ID of the event to delete
   * @returns {Object} Success message or error
   */
  async deleteEvent(req, res) {
    try {
      const eventId = req.params.id;

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      await eventService.deleteEvent(eventId);
      res.status(204).send();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  }
};

export default eventController;
