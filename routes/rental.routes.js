const express = require('express');
const router = express.Router();

// Custom controllers
const rentalController = require('../controllers/rental.controller.js');

router.post('/production-facilities', rentalController.createProductionFacility);
router.post('/equipment-types', rentalController.createEquipmentType);
router.post('/rental-contract', rentalController.createPlacementContract);
router.get('/rental-contracts-list', rentalController.getCurrentPlacementContracts);

module.exports = router;