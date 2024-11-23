import addressEventService from '../services/addressEventService.js';
import axios from 'axios';

const addressEventController = {

  /**
   * Get all address events
   * @route {GET} /address-events
   * @returns {Array} List of address events
   */
  async getAllAddressEvents(req, res) {
    try {
      const addressEvents = await addressEventService.getAllAddressEvents();

      if (addressEvents == null || addressEvents.length === 0) {
        return res.status(404).json({ message: 'No address events found' });
      }

      res.status(200).json(addressEvents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching address events' });
    }
  },

  /**
   * Get a specific address event by ID
   * @route {GET} /address-events/:id
   * @param {string} id - The ID of the address event
   * @returns {Object} The address event object
   */
  async getAddressEventById(req, res) {
    try {
      const addressEventId = req.params.id;
      const addressEvent = await addressEventService.getAddressEventById(addressEventId);

      if (!addressEvent) {
        return res.status(404).json({ message: 'Address event not found' });
      }

      res.status(200).json(addressEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching address event' });
    }
  },

  /**
   * Create a new address event
   * @route {POST} /address-events
   * @bodyparam {Object} addressData - The data for creating an address event
   * @returns {Object} The newly created address event
   */
  async createAddressEvent(req, res) {
    try {
      const { road, roadNumber, postCode, localtown, event_id } = req.body;
      
      // Verificar campos obrigatórios
      if (!road || !roadNumber || !postCode || !localtown || !event_id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const localtownExists = await axios.get(`http://locationservice:5005/api/location/${localtown}`);

      if (!localtownExists) {
        return res.status(404).json({ message: 'Location not found' });
      }

      const newAddressEvent = await addressEventService.createAddressEvent(req.body);
      res.status(201).json(newAddressEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating address event' });
    }
  },

  /**
   * Update an existing address event
   * @route {PUT} /address-events/:id
   * @param {string} id - The ID of the address event to update
   * @bodyparam {Object} addressData - The new data for the address event
   * @returns {Object} The updated address event
   */
  async updateAddressEvent(req, res) {
    try {
      const addressEventId = req.params.id;
      const addressData = req.body;

      const addressEvent = await addressEventService.getAddressEventById(addressEventId);
      if (!addressEvent) {
        return res.status(404).json({ message: 'Address event not found' });
      }

      const updatedAddressEvent = await addressEventService.updateAddressEvent(addressEventId, addressData);
      res.status(200).json(updatedAddressEvent);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating address event' });
    }
  },

  /**
   * Delete an address event
   * @route {DELETE} /address-events/:id
   * @param {string} id - The ID of the address event to delete
   * @returns {Object} Success message or error
   */
  async deleteAddressEvent(req, res) {
    try {
      const addressEventId = req.params.id;
  
      const addressEvent = await addressEventService.getAddressEventById(addressEventId);
      if (!addressEvent) {
        return res.status(404).json({ message: 'Address event not found' });
      }
  
      await addressEventService.deleteAddressEvent(addressEventId);
      res.status(204).send(); 
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting address event' });
    }
  }
};

export default addressEventController;
