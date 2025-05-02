import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addressEventService = {
  /**
   * Get all address events
   * @returns {Promise<Array>} List of all address events
   */
  async getAllAddressEvents() {
    return prisma.addressEvent.findMany();
  },

  /**
   * Get a specific address event by ID
   * @param {string} addressEventId - The ID of the address event to fetch
   * @returns {Promise<Object|null>} The address event object or null if not found
   */
  async getAddressEventById(addressEventId) {
    return prisma.addressEvent.findUnique({
      where: { addressEstablishmentID: addressEventId },
    });
  },

  /**
 * Get a specific address event by eventID
 * @param {string} eventId - The ID of the address event to fetch
 * @returns {Promise<Object|null>} The address event object or null if not found
 */
  async getAddressEventByEventId(eventId) {
    return prisma.addressEvent.findUnique({
      where: { event_id: eventId },
    });
  },

  /**
   * Create a new address event
   * @param {Object} addressEventData - The data for creating the address event
   * @returns {Promise<Object>} The created address event object
   */
  async createAddressEvent(addressEventData) {
    return prisma.addressEvent.create({
      data: addressEventData,
    });
  },

  /**
   * Update an address event by ID
   * @param {string} addressEventId - The ID of the address event to update
   * @param {Object} addressEventData - The updated address event data
   * @returns {Promise<Object>} The updated address event object
   */
  async updateAddressEvent(addressEventId, addressEventData) {
    return prisma.addressEvent.update({
      where: { addressEstablishmentID: addressEventId },
      data: addressEventData,
    });
  },

  /**
   * Delete an address event by ID
   * @param {string} addressEventId - The ID of the address event to delete
   * @returns {Promise<void>} Resolves when the address event is deleted
   */
  async deleteAddressEvent(addressEventId) {
    await prisma.addressEvent.delete({
      where: { addressEstablishmentID: addressEventId },
    });
  },
};

export default addressEventService;
