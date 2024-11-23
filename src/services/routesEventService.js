import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const routesEventService = {
  /**
   * Get all routes events
   * @returns {Promise<Array>} List of all routes events
   */
  async getAllRoutesEvents() {
    return prisma.routesEvent.findMany();
  },

  /**
   * Get a specific routes event by routeID
   * @param {string} routeID - The ID of the routes event to fetch
   * @returns {Promise<Object|null>} The routes event object or null if not found
   */
  async getRoutesEventById(routeID) {
    return prisma.routesEvent.findUnique({
      where: { routeID },
    });
  },

  /**
   * Create a new routes event
   * @param {Object} routesEventData - The data for creating the routes event
   * @returns {Promise<Object>} The created routes event object
   */
  async createRoutesEvent(routesEventData) {
    return prisma.routesEvent.create({
      data: routesEventData,
    });
  },

  /**
   * Update an existing routes event by routeID
   * @param {string} routeID - The ID of the routes event to update
   * @param {Object} routesEventData - The updated routes event data
   * @returns {Promise<Object>} The updated routes event object
   */
  async updateRoutesEvent(routeID, routesEventData) {
    return prisma.routesEvent.update({
      where: { routeID },
      data: routesEventData,
    });
  },

  /**
   * Delete a routes event by routeID
   * @param {string} routeID - The ID of the routes event to delete
   * @returns {Promise<void>} Resolves when the routes event is deleted
   */
  async deleteRoutesEvent(routeID) {
    await prisma.routesEvent.delete({
      where: { routeID },
    });
  },
};

export default routesEventService;
