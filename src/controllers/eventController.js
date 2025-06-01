import eventService from '../services/eventService.js';
import eventStatusService from '../services/eventStatusService.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import addressEventService from '../services/addressEventService.js';
import routesEventService from '../services/routesEventService.js';

const loadErrorMessages = (lang) => {
  const errorMessagesPath = path.join(__dirname, '../config', 'errorMessages.json');
  const errorMessages = JSON.parse(fs.readFileSync(errorMessagesPath, 'utf-8'));
  const languageCode = lang.split(',')[0].split('-')[0];

  return errorMessages[languageCode] || errorMessages.en;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventController = {

  /**
   * Get all events
   * @route {GET} /events
   * @returns {Array} List of events
   * @description Fetches all events from the database.
   * If no events are found, it returns a 404 response.
   */
  async getAllEvents(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const events = await eventService.getAllEvents();

      res.status(200).json(events);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },

  /**
   * Get suspended events
   * @route {GET} /events/suspended
   * @returns {Array} List of suspended events
   * @description Fetches all suspended events.
   * If no suspended events are found, it returns a 404 response.
   */
  async getSuspendedEvents(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const suspendedEvents = await eventService.getSuspendedEvents();

      res.status(200).json(suspendedEvents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },

  /**
  * Get approved events
  * @route {GET} /events/approved
  * @returns {Array} List of approved events
  * @description Fetches all approved events.
  * If no approved events are found, it returns a 404 response.
  */
  async getApprovedEvents(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const approvedEvents = await eventService.getApprovedEvents();

      res.status(200).json(approvedEvents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },

  /**
   * Get user events
   * @route {GET} /events/my
   * @param {string} id - The ID of the user
   * @returns {Array} List of events associated with the user
   * @description Fetches all events associated with the current user based on their ID.
   * If no events are found, it returns a 404 response.
   */
  async getUserEvents(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const userId = req.user.userID;

      const events = await eventService.getUserEvents(userId);

      res.status(200).json(events);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },

  /**
   * Get user events
   * @route {GET} /events/reputation/:id
   * @param {string} id - The ID of the user
   * @returns {Array} List of events associated with the user
   * @description Fetches user reputarion associated with the current user based on their ID.
   * If no events are found, it returns a 404 response.
   */
  async getUserReputation(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);

    try {
      const userId = req.params.id;

      const events = await eventService.getUserEvents(userId);
      const eventCount = events.length;
      const agent = new https.Agent({ rejectUnauthorized: false });

      let tickets = [];

      if (eventCount > 0) {
        const ticketArrays = await Promise.all(
          events.map(event =>
            axios
              .get(`https://nginx-api-gateway:5010/userinevent/api/tickets/event/${event.eventID}`, { httpsAgent: agent })
              .then(res => res.data)
          )
        );
        tickets = ticketArrays.flat();
      }

      const feedbackTickets = tickets.filter(t => t.feedback && t.feedback.rating != null);
      const feedbackCount = feedbackTickets.length;

      const totalRating = feedbackTickets.reduce((sum, t) => sum + t.feedback.rating, 0);

      const reputation = feedbackCount > 0 ? totalRating / feedbackCount : 0;

      res.status(200).json({
        eventCount,
        reputation: parseFloat(reputation.toFixed(2)),
        tickets
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },

  /**
   * Get a specific event by ID
   * @route {GET} /events/:id
   * @param {string} id - The ID of the event to fetch
   * @returns {Object} The event object
   * @description Fetches a specific event based on its ID.
   * If no event is found, it returns a 404 response.
   */
  async getEventById(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventId = req.params.id;
      const event = await eventService.getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: errorMessages.NO_EVENTS_FOUND });
      }

      res.status(200).json(event);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_FETCHING_EVENTS });
    }
  },


  /**
   * Create a new event
   * @route {POST} /events
   * @bodyparam {Object} eventData - The data for creating an event (name, description, startAt, endAt, price, eventPicture)
   * @returns {Object} The newly created event
   * @description Creates a new event using the provided data.
   * If any required data is missing, it returns a 400 response.
   * If the event is successfully created, it returns a 201 response.
   */
  async createEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const authToken = req.headers['authorization']
      const { name, description, startAt, endAt, price } = req.body;
      const userId = req.user.userID;

      const numericPrice = parseFloat(price);

      if (!name || !description || !startAt || !endAt || !numericPrice) {
        return res.status(400).json({ message: errorMessages.MISSING_REQUIRED_FIELDS });
      }

      // Configuração para ignorar certificados autoassinados (apenas para desenvolvimento)
      const agent = new https.Agent({ rejectUnauthorized: false });

      //const userExists = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`);
      //const userExists = await axios.get(`http://localhost:5001/api/users/${userId}`);
      // const userExists = await axios.get(`http://userservice:5001/api/users/${userId}`);
      const userExists = await axios.get(`https://nginx-api-gateway:5010/user/api/users/${userId}`, { httpsAgent: agent });  //https api gateway

      if (!userExists) {
        return res.status(404).json({ message: errorMessages.USER_NOT_FOUND });
      }

      let eventPicturePath = userExists.eventPicturePath;

      if (req.files && req.files.eventPicture) {
        const eventPicture = req.files.eventPicture;

        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(eventPicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: errorMessages.INVALID_FILE_TYPE });
        }

        if (eventPicturePath && fs.existsSync(path.join(__dirname, '../public', eventPicturePath))) {
          fs.unlinkSync(path.join(__dirname, '../public', eventPicturePath));
        }

        const uniqueName = `${uuidv4()}${fileExtension}`;
        const uploadPath = path.join(__dirname, '../public/uploads/event_pictures', uniqueName);
        await eventPicture.mv(uploadPath);

        eventPicturePath = `/uploads/event_pictures/${path.basename(uploadPath)}`;
      }

      const eventStatusPending = await eventStatusService.getEventStatusByStatus('Pendente');

      const newEvent = await eventService.createEvent({
        name,
        description,
        startAt,
        endAt,
        price: numericPrice,
        userId,
        eventstatus_id: eventStatusPending.eventStatusID,
        eventPicture: eventPicturePath
      });

      //const user = await axios.get(`http://localhost:5001/api/users/${userId}`);
      // const user = await axios.get(`http://userservice:5001/api/users/${userId}`);
      //const user = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`);
      const user = await axios.get(`https://nginx-api-gateway:5010/user/api/users/${userId}`, { httpsAgent: agent });  //https api gateway

      const updatedUser = {
        ...user.data,
        usertype_id: '123e4567-e89b-12d3-a456-426614174001'
      };

      if (user && user.data.usertype_id === '2c6aab42-7274-424e-8c10-e95441cb95c3') {
        //   await axios.put(`http://localhost:5001/api/users/${userId}`, updatedUser, { httpsAgent: agent },
        //     {
        //       headers: {
        //         Authorization: authToken
        //       }
        //     }
        //   );
        await axios.put(
          `https://nginx-api-gateway:5010/user/api/users/${userId}`,
          updatedUser,
          {
            httpsAgent: agent,
            headers: {
              Authorization: authToken,
            },
          }
        );

        // await axios.put(`http://userservice:5001/api/users/${userId}`, updatedUser,
        //   {
        //     headers: {
        //       Authorization: authToken
        //     }
        //   }
        // );
      }

      res.status(201).json(newEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_CREATING_EVENT });
    }
  },

  /**
   * Update an existing event
   * @route {PUT} /events/:id
   * @param {string} id - The ID of the event to update
   * @bodyparam {Object} eventData - The updated data for the event
   * @returns {Object} The updated event
   * @description Updates an existing event with the provided data.
   * Returns a 404 if the event is not found, or a 200 with the updated event data if successful.
   */
  async updateEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventId = req.params.id;
      const { name, description, startAt, endAt, price } = req.body;

      const numericPrice = price ? parseFloat(price) : undefined;

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: errorMessages.NO_EVENTS_FOUND });
      }

      let eventPicturePath = event.eventPicturePath;

      if (req.files && req.files.eventPicture) {
        const eventPicture = req.files.eventPicture;

        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(eventPicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: errorMessages.INVALID_FILE_TYPE });
        }

        if (eventPicturePath && fs.existsSync(path.join(__dirname, '../public', eventPicturePath))) {
          fs.unlinkSync(path.join(__dirname, '../public', eventPicturePath));
        }

        const uniqueName = `${uuidv4()}${fileExtension}`;
        const uploadPath = path.join(__dirname, '../public/uploads/event_pictures', uniqueName);
        await eventPicture.mv(uploadPath);

        eventPicturePath = `/uploads/event_pictures/${path.basename(uploadPath)}`;
      }

      const updatedEventData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(startAt && { startAt }),
        ...(endAt && { endAt }),
        ...(numericPrice !== undefined && { price: numericPrice }),
        ...(eventPicturePath && { eventPicture: eventPicturePath }),
      };

      const updatedEvent = await eventService.updateEvent(eventId, updatedEventData);
      res.status(200).json(updatedEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_UPDATING_EVENT });
    }
  },

  /**
   * Approve an event
   * @route {PUT} /events/:id/status
   * @param {string} id - The ID of the event to approve
   * @returns {Object} The updated event
   * @description This route allows updating the status of an event to "approved". The event status is initially "pending", and only events with the "pending" status can be approved.
   */
  async updateEventStatus(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventId = req.params.id;

      const eventStatusPending = await eventStatusService.getEventStatusByStatus('Pendente');
      const eventStatusApproved = await eventStatusService.getEventStatusByStatus('Aprovado');

      if (!eventStatusPending || !eventStatusApproved) {
        return res.status(404).json({ message: errorMessages.EVENT_STATUS_NOT_FOUND });
      }

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: errorMessages.NO_EVENTS_FOUND });
      }

      if (event.eventstatus_id === eventStatusPending.eventStatusID) {
        const updatedEvent = await eventService.updateEventStatus(eventId, eventStatusApproved.eventStatusID);
        return res.status(200).json(updatedEvent);
      }

      return res.status(400).json({ message: errorMessages.EVENT_STATUS_NOT_PENDING });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_UPDATING_EVENT_STATUS });
    }
  },

  /**
   * Cancel an event
   * @route {PUT} /events/:id/status
   * @param {string} id - The ID of the event to cancel
   * @returns {Object} The updated event
   * @description This route allows updating the status of an event to "Cancelado". When an event is cancelled, any associated payments for tickets will also be updated to "Cancelado".
   */
  async cancelEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventId = req.params.id;

      const eventStatusCancelled = await eventStatusService.getEventStatusByStatus('Cancelado');

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: errorMessages.NO_EVENTS_FOUND });
      }

      // Configuração para ignorar certificados autoassinados (apenas para desenvolvimento)
      const agent = new https.Agent({ rejectUnauthorized: false });

      //const eventTickets = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/event/${eventId}`);
      // const eventTickets = await axios.get(`http://userineventservice:5009/api/tickets/event/${eventId}`);
      const eventTickets = await axios.get(`https://nginx-api-gateway:5010/userinevent/api/tickets/event/${eventId}`, { httpsAgent: agent });

      const payments = (
        await Promise.all(
          eventTickets.data.map(async (ticket) => {
            //const response = await axios.get(`http://nginx-api-gateway:5010/payment/api/payments/ticket/${ticket.ticketID}`);
            // const response = await axios.get(`http://paymentservice:5004/api/payments/ticket/${ticket.ticketID}`);
            const response = await axios.get(`https://nginx-api-gateway:5010/payment/api/payments/ticket/${ticket.ticketID}`, { httpsAgent: agent });
            return response.data;
          })
        )
      ).flat();

      const updatedEvent = await eventService.updateEventStatus(eventId, eventStatusCancelled.eventStatusID);
      await Promise.all(
        payments.map(async (payment) => {
          //await axios.put(`http://nginx-api-gateway:5010/payment/api/payments/${payment.paymentID}/cancel`);
          //await axios.put(`http://nginx-api-gateway:5004/api/payments/${payment.paymentID}/cancel`);
          await axios.put(`https://nginx-api-gateway:5010/payment/api/payments/${payment.paymentID}/cancel`, { httpsAgent: agent });
        })
      );

      return res.status(200).json(updatedEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_UPDATING_EVENT_STATUS });
    }
  },

  /**
   * Delete an event
   * @route {DELETE} /events/:id
   * @param {string} id - The ID of the event to delete
   * @returns {Object} Success message or error
   * @description Deletes a specific event by ID.
   * If the event is not found, it returns a 404 response.
   */
  async deleteEvent(req, res) {
    const lang = req.headers['accept-language'] || 'en';
    const errorMessages = loadErrorMessages(lang);
    try {
      const eventId = req.params.id;

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: errorMessages.NO_EVENTS_FOUND });
      }

      const addressEvent = await addressEventService.getAddressEventByEventId(eventId);
      let addresRoutes = null;

      if (addressEvent) {
        addresRoutes = await routesEventService.getRoutesEventByAddressId(addressEvent.addressEstablishmentID);
      }

      if (addresRoutes != null) {
        for (const route of addresRoutes) {
          await routesEventService.deleteRoutesEvent(route.routeID);
        }
      }

      if (addressEvent) {
        await addressEventService.deleteAddressEvent(addressEvent.addressEstablishmentID);
      }

      await eventService.deleteEvent(eventId);
      res.status(204).send();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.ERROR_DELETING_EVENT });
    }
  }
};

export default eventController;
