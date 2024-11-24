import { Router } from "express";
import eventController from "../controllers/eventController.js";
import addressEventController from "../controllers/addressEventController.js";
import routesEventController from "../controllers/routesEventController.js";
import eventStatusController from '../controllers/eventStatusController.js';
import {verifyToken }from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/events', eventController.getAllEvents);
router.post('/events', eventController.createEvent);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.put('/events/:id/status', eventController.updateEventStatus);
router.get('/events/my', verifyToken, eventController.getUserEvents);

router.get('/addressEvents', addressEventController.getAllAddressEvents)
router.post('/addressEvents', addressEventController.createAddressEvent);
router.get('/addressEvents/:id', addressEventController.getAddressEventById);
router.put('/addressEvents/:id', addressEventController.updateAddressEvent);
router.delete('/addressEvents/:id', addressEventController.deleteAddressEvent);

router.get('/routesEvents', routesEventController.getAllRoutesEvents)
router.post('/routesEvents', routesEventController.createRoutesEvent);
router.get('/routesEvents/:id', routesEventController.getRoutesEventById);
router.put('/routesEvents/:id', routesEventController.updateRoutesEvent);
router.delete('/routesEvents/:id', routesEventController.deleteRoutesEvent);

router.get('/eventStatus', eventStatusController.getAllEventStatuses);
router.post('/eventStatus', eventStatusController.createEventStatus);
router.get('/eventStatus/:id', eventStatusController.getEventStatusById);
router.put('/eventStatus/:id', eventStatusController.updateEventStatus);
router.delete('/eventStatus/:id', eventStatusController.deleteEventStatus);


export default router;