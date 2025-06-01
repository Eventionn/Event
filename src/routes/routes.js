import { Router } from "express";
import eventController from "../controllers/eventController.js";
import addressEventController from "../controllers/addressEventController.js";
import routesEventController from "../controllers/routesEventController.js";
import eventStatusController from '../controllers/eventStatusController.js';
import {verifyToken }from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";
import { verifyAdvertiser } from "../middlewares/advertiserMiddleware.js";
import fileUpload from "express-fileupload";

const router = Router();
router.use(fileUpload());

router.get('/events', eventController.getAllEvents);
router.post('/events', verifyToken, eventController.createEvent);
router.get('/events/reputation/:id', verifyToken, eventController.getUserReputation);
router.get('/events/approved', eventController.getApprovedEvents);
router.get('/events/suspended', verifyToken, verifyAdmin, eventController.getSuspendedEvents);
router.get('/events/my', verifyToken, verifyAdvertiser, eventController.getUserEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.put('/events/:id/status', verifyToken, verifyAdmin, eventController.updateEventStatus);
router.put('/events/:id/cancel', verifyToken, verifyAdvertiser, eventController.cancelEvent);

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