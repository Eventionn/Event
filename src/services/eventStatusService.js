import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventStatusService = {
  /**
   * Get all event statuses
   * @returns {Promise<Array>} List of all event statuses
   */
  async getAllEventStatuses() {
    return prisma.eventStatus.findMany();
  },

  /**
   * Get a specific event status by eventStatusID
   * @param {string} eventStatusID - The ID of the event status to fetch
   * @returns {Promise<Object|null>} The event status object or null if not found
   */
  async getEventStatusById(eventStatusID) {
    return prisma.eventStatus.findUnique({
      where: { eventStatusID },
    });
  },

  /**
   * Create a new event status
   * @param {Object} eventStatusData - The data for creating the event status
   * @returns {Promise<Object>} The created event status object
   */
  async createEventStatus(eventStatusData) {
    return prisma.eventStatus.create({
      data: eventStatusData,
    });
  },

  /**
   * Update an existing event status by eventStatusID
   * @param {string} eventStatusID - The ID of the event status to update
   * @param {Object} eventStatusData - The updated event status data
   * @returns {Promise<Object>} The updated event status object
   */
  async updateEventStatus(eventStatusID, eventStatusData) {
    return prisma.eventStatus.update({
      where: { eventStatusID },
      data: eventStatusData,
    });
  },

  /**
   * Delete an event status by eventStatusID
   * @param {string} eventStatusID - The ID of the event status to delete
   * @returns {Promise<void>} Resolves when the event status is deleted
   */
  async deleteEventStatus(eventStatusID) {
    await prisma.eventStatus.delete({
      where: { eventStatusID },
    });
  },
};

export default eventStatusService;
