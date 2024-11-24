import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eventService = {
  /**
   * Get all events
   * @returns {Promise<Array>} List of all events
   */
  async getAllEvents() {
    return prisma.event.findMany({
      include: {
        eventStatus: true,
        addressEvents: {
          include: {
            routes: true,
          },
        },
      },
    });
  },

    /**
   * Get all events
   * @returns {Promise<Array>} List of user events
   */
    async getUserEvents(userId) {
      return prisma.event.findMany({
        where: {userId},
        include: {
          eventStatus: true,
          addressEvents: {
            include: {
              routes: true,
            },
          },
        },
      });
    },

  /**
   * Get a specific event by ID
   * @param {string} eventId - The ID of the event to fetch
   * @returns {Promise<Object|null>} The event object or null if not found
   */
  async getEventById(eventId) {
    return prisma.event.findUnique({
      where: { eventID: eventId },
      include: {
        eventStatus: true,
        addressEvents: {
          include: {
            routes: true,
          },
        },
      },
    });
  },

  /**
   * Create a new event
   * @param {Object} eventData - The data for creating the event
   * @returns {Promise<Object>} The created event object
   */
  async createEvent(eventData) {
    return prisma.event.create({
      data: eventData,
    });
  },

  /**
   * Update an event by ID
   * @param {string} eventId - The ID of the event to update
   * @param {Object} eventData - The updated event data
   * @returns {Promise<Object>} The updated event object
   */
  async updateEvent(eventId, eventData) {
    return prisma.event.update({
      where: { eventID: eventId },
      data: eventData,
    });
  },

  /**
   * Update the status of an event by ID
   * @param {string} eventId - The ID of the event to update
   * @param {string} newEventStatusId - The new event status ID to set
   * @returns {Promise<Object>} The updated event object
   */
  async updateEventStatus(eventId, newEventStatusId) {
    return prisma.event.update({
      where: { eventID: eventId },
      data: {
        eventstatus_id: newEventStatusId, 
      },
    });
  },

  /**
   * Delete an event by ID
   * @param {string} eventId - The ID of the event to delete
   * @returns {Promise<void>} Resolves when the event is deleted
   */
  async deleteEvent(eventId) {
    await prisma.event.delete({
      where: { eventID: eventId },
    });
  },
};

export default eventService;
