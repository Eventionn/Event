import eventStatusService from '../services/eventStatusService.js';

const eventStatusController = {

  /**
   * Get all event statuses
   * @route {GET} /event-statuses
   * @returns {Array} List of event statuses
   */
  async getAllEventStatuses(req, res) {
    try {
      const eventStatuses = await eventStatusService.getAllEventStatuses();

      if (eventStatuses == null || eventStatuses.length === 0) {
        return res.status(404).json({ message: 'No event statuses found' });
      }

      res.status(200).json(eventStatuses);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching event statuses' });
    }
  },

  /**
   * Get a specific event status by eventStatusID
   * @route {GET} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status
   * @returns {Object} The event status object
   */
  async getEventStatusById(req, res) {
    try {
      const eventStatusID = req.params.id;
      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);

      if (!eventStatus) {
        return res.status(404).json({ message: 'Event status not found' });
      }

      res.status(200).json(eventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching event status' });
    }
  },

  /**
   * Create a new event status
   * @route {POST} /event-statuses
   * @bodyparam {Object} eventStatusData - The data for creating an event status
   * @returns {Object} The newly created event status
   */
  async createEventStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Missing required field: status' });
      }

      const newEventStatus = await eventStatusService.createEventStatus(req.body);
      res.status(201).json(newEventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating event status' });
    }
  },

  /**
   * Update an existing event status
   * @route {PUT} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status to update
   * @bodyparam {Object} eventStatusData - The new data for the event status
   * @returns {Object} The updated event status
   */
  async updateEventStatus(req, res) {
    try {
      const eventStatusID = req.params.id;
      const eventStatusData = req.body;

      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);
      if (!eventStatus) {
        return res.status(404).json({ message: 'Event status not found' });
      }

      const updatedEventStatus = await eventStatusService.updateEventStatus(eventStatusID, eventStatusData);
      res.status(200).json(updatedEventStatus);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event status' });
    }
  },

  /**
   * Delete an event status
   * @route {DELETE} /event-statuses/:eventStatusID
   * @param {string} eventStatusID - The ID of the event status to delete
   * @returns {Object} Success message or error
   */
  async deleteEventStatus(req, res) {
    try {
      const eventStatusID = req.params.id;

      const eventStatus = await eventStatusService.getEventStatusById(eventStatusID);
      if (!eventStatus) {
        return res.status(404).json({ message: 'Event status not found' });
      }

      await eventStatusService.deleteEventStatus(eventStatusID);
      res.status(204).send();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event status' });
    }
  }
};

export default eventStatusController;
