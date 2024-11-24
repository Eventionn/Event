import routesEventService from '../services/routesEventService.js';

const routesEventController = {

  /**
   * Get all routes events
   * @route {GET} /routes-events
   * @returns {Array} List of routes events
   */
  async getAllRoutesEvents(req, res) {
    try {
      const routesEvents = await routesEventService.getAllRoutesEvents();

      if (routesEvents == null || routesEvents.length === 0) {
        return res.status(404).json({ message: 'No routes events found' });
      }

      res.status(200).json(routesEvents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching routes events' });
    }
  },

  /**
   * Get a specific routes event by routeID
   * @route {GET} /routes-events/:routeID
   * @param {string} routeID - The ID of the routes event
   * @returns {Object} The routes event object
   */
  async getRoutesEventById(req, res) {
    try {
      const routeID = req.params.id;
      const routesEvent = await routesEventService.getRoutesEventById(routeID);

      if (!routesEvent) {
        return res.status(404).json({ message: 'Routes event not found' });
      }

      res.status(200).json(routesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching routes event' });
    }
  },

  /**
   * Create a new routes event
   * @route {POST} /routes-events
   * @bodyparam {Object} routesEventData - The data for creating a routes event
   * @returns {Object} The newly created routes event
   */
  async createRoutesEvent(req, res) {
    try {
      const { latitude, longitude, order, addressEvent_id } = req.body;
      
      if (latitude === undefined || longitude === undefined || order === undefined || !addressEvent_id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newRoutesEvent = await routesEventService.createRoutesEvent(req.body);
      res.status(201).json(newRoutesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating routes event' });
    }
  },

  /**
   * Update an existing routes event
   * @route {PUT} /routes-events/:routeID
   * @param {string} routeID - The ID of the routes event to update
   * @bodyparam {Object} routesEventData - The new data for the routes event
   * @returns {Object} The updated routes event
   */
  async updateRoutesEvent(req, res) {
    try {
      const routeID = req.params.id;
      const routesEventData = req.body;

      const routesEvent = await routesEventService.getRoutesEventById(routeID);
      if (!routesEvent) {
        return res.status(404).json({ message: 'Routes event not found' });
      }

      const updatedRoutesEvent = await routesEventService.updateRoutesEvent(routeID, routesEventData);
      res.status(200).json(updatedRoutesEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating routes event' });
    }
  },

  /**
   * Delete a routes event
   * @route {DELETE} /routes-events/:routeID
   * @param {string} routeID - The ID of the routes event to delete
   * @returns {Object} Success message or error
   */
  async deleteRoutesEvent(req, res) {
    try {
      const routeID = req.params.id;
  
      const routesEvent = await routesEventService.getRoutesEventById(routeID);
      if (!routesEvent) {
        return res.status(404).json({ message: 'Routes event not found' });
      }
  
      await routesEventService.deleteRoutesEvent(routeID);
      res.status(204).send();
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting routes event' });
    }
  }
};

export default routesEventController;
