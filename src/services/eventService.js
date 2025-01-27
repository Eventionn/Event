import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import admin from 'firebase-admin';
import fs from 'fs';

const prisma = new PrismaClient();

const serviceAccount = JSON.parse(fs.readFileSync('./src/evention-7c28e-firebase-adminsdk-z84tf-31e1581df0.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


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
   * Get suspended events
   * @returns {Promise<Array>} List of all events
   */
  async getSuspendedEvents() {
    return prisma.event.findMany({
      include: {
        eventStatus: true,
        addressEvents: {
          include: {
            routes: true,
          },
        },
      },
      where: {
        eventStatus: {
          eventStatusID: '11111111-1111-1111-1111-111111111111'
        }
      }
    });
  },

  /**
   * Get approved events
   * @returns {Promise<Array>} List of all events
   */
  async getApprovedEvents() {
    return prisma.event.findMany({
      include: {
        eventStatus: true,
        addressEvents: {
          include: {
            routes: true,
          },
        },
      },
      where: {
        eventStatus: {
          eventStatusID: '22222222-2222-2222-2222-222222222222'
        }
      }
    });
  },

  /**
     * Send a notification to a specific device using Firebase Cloud Messaging
     * @param {Object} notificationData - The notification data containing title and body
     * @param {string} registrationToken - The FCM registration token of the target device
     * @returns {Promise<Object>} The response from Firebase Cloud Messaging
     */
  async sendNotification(notificationData, registrationToken) {
    try {
      const message = {
        data: {
          title: notificationData.title,
          body: notificationData.body,
        },
        token: registrationToken,
      };

      const response = await admin.messaging().send(message);
      console.log('Notification sent:', response);

      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Error sending notification.');
    }
  },

  /**
 * Get all events
 * @returns {Promise<Array>} List of user events
 */
  async getUserEvents(userId) {
    return prisma.event.findMany({
      where: { userId },
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
