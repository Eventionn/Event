import eventService from '../services/eventService.js';
import eventStatusService from '../services/eventStatusService.js';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
   * Get suspended events
   * @route {GET} /events/suspended
   * @returns {Array} List of events
   */
  async getSuspendedEvents(req, res) {
    try {
      const suspendedEvents = await eventService.getSuspendedEvents();

      if (suspendedEvents == null || suspendedEvents.length === 0) {
        return res.status(404).json({ message: 'No suspended events found' });
      }

      res.status(200).json(suspendedEvents);

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
      const authToken = req.headers['authorization']
      const { name, description, startAt, endAt, price } = req.body;
      const userId = req.user.userID;

      const numericPrice = parseFloat(price);

      if (!name || !description || !startAt || !endAt || !numericPrice) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Configuração para ignorar certificados autoassinados (apenas para desenvolvimento)
      const agent = new https.Agent({ rejectUnauthorized: false });    

      //const userExists = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`);
      // const userExists = await axios.get(`http://localhost:5001/api/users/${userId}`);
      // const userExists = await axios.get(`http://userservice:5001/api/users/${userId}`);
      const userExists = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`, { httpsAgent: agent });  //https api gateway
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      let eventPicturePath = userExists.eventPicturePath;

      if (req.files && req.files.eventPicture) {
        const eventPicture = req.files.eventPicture;

        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(eventPicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: "Invalid file type. Only PNG, JPEG, and JPG are allowed." });
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

      const token = 'dF2k8hQLb9T:APA91bH7-5RryA3w-XgHrC8_yLqVjvYZ76k7B9oQqEXAMPLE';
      const notificationData = {
        title: 'Evento Criado!',
        body: `O evento "${name}" foi criado com sucesso. Aguarde pela aprovação.`,
      };

      //await eventService.sendNotification(notificationData, token);
      
      //const user = await axios.get(`http://localhost:5001/api/users/${userId}`);
      // const user = await axios.get(`http://userservice:5001/api/users/${userId}`);
      //const user = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`);
      const user = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${userId}`, { httpsAgent: agent });  //https api gateway

      const updatedUser = {
        ...user.data,
        usertype_id: '123e4567-e89b-12d3-a456-426614174001'
      };

      if (user && user.data.usertype_id === '2c6aab42-7274-424e-8c10-e95441cb95c3') {
        /*await axios.put(`http://localhost:5001/api/users/${userId}`, updatedUser,
          {
            headers: {
              Authorization: authToken
            }
          }
        );*/
        await axios.put(`http://nginx-api-gateway:5010/user/api/users/${userId}`, updatedUser, { httpsAgent: agent }, //https api gateway
          {
            headers: {
              Authorization: authToken
            }
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
      const { name, description, startAt, endAt, price } = req.body;
  
      const numericPrice = price ? parseFloat(price) : undefined;
  
      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      let eventPicturePath = event.eventPicturePath;
  
      if (req.files && req.files.eventPicture) {
        const eventPicture = req.files.eventPicture;
  
        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(eventPicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: "Invalid file type. Only PNG, JPEG, and JPG are allowed." });
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
      res.status(500).json({ message: 'Error updating event' });
    }
  },

  /**
   * Approve an event
   * @route {PUT} /events/:id/status
   * @param {string} id - The ID of the event to approve
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
   * Cancel an event
   * @route {PUT} /events/:id/status
   * @param {string} id - The ID of the event to update
   * @returns {Object} The updated event
   */
  async cancelEvent(req, res) {
    try {
      const eventId = req.params.id;

      const eventStatusCancelled = await eventStatusService.getEventStatusByStatus('Cancelado');

      const event = await eventService.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Configuração para ignorar certificados autoassinados (apenas para desenvolvimento)
      const agent = new https.Agent({ rejectUnauthorized: false });

      //const eventTickets = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/event/${eventId}`);
      // const eventTickets = await axios.get(`http://userineventservice:5009/api/tickets/event/${eventId}`);
      const eventTickets = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/event/${eventId}`, { httpsAgent: agent });

      const payments = (
        await Promise.all(
          eventTickets.data.map(async (ticket) => {
            //const response = await axios.get(`http://nginx-api-gateway:5010/payment/api/payments/ticket/${ticket.ticketID}`);
            // const response = await axios.get(`http://paymentservice:5004/api/payments/ticket/${ticket.ticketID}`);
            const response = await axios.get(`http://nginx-api-gateway:5010/payment/api/payments/ticket/${ticket.ticketID}`, { httpsAgent: agent });
            return response.data;
          })
        )
      ).flat();

      const updatedEvent = await eventService.updateEventStatus(eventId, eventStatusCancelled.eventStatusID);
      await Promise.all(
        payments.map(async (payment) => {
          //await axios.put(`http://nginx-api-gateway:5010/payment/api/payments/${payment.paymentID}/cancel`);
          //await axios.put(`http://nginx-api-gateway:5004/api/payments/${payment.paymentID}/cancel`);
          await axios.put(`http://nginx-api-gateway:5010/payment/api/payments/${payment.paymentID}/cancel`, { httpsAgent: agent });
        })
      );

      return res.status(200).json(updatedEvent);

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
