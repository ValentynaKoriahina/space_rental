const ApiError = require('../exceptions/api-error');

// Custom services
const databaseQueries = require('../service/database.queries');

// Method to create a production facility
async function createProductionFacility(req, res, next) {

  try {
    await databaseQueries.createProductionFacility(req.body.facilityDescription, req.body.facilityEquipmentArea);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Method to create an equipment type
async function createEquipmentType(req, res, next) {

  try {
    await databaseQueries.createEquipmentType(req.body.equipmentDescription, req.body.equipmentArea);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Method to create a placement (rental) contract
async function createPlacementContract(req, res, next) {
  // Check for all required parameters
  try {
    if (!('facilityCode' in req.body && 'equipmentCode' in req.body && 'quantity' in req.body)) {
      throw (ApiError.IncompleteData(req));
    }

    const availableArea = await databaseQueries.selectAvailableArea(req.body.facilityCode);
    const equipmentArea = await databaseQueries.selectEquipmentArea(req.body.equipmentCode);

    // Check if there is enough space
    if (availableArea[0].equipment_area < (equipmentArea[0].area * req.body.quantity)) {
      throw (ApiError.BusinessLogicError('Insufficient space for equipment'));
    }

    await databaseQueries.createPlacementContract(
      req.body.facilityCode,
      req.body.equipmentCode,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Method to get current placement contracts list
async function getCurrentPlacementContracts(req, res, next) {

  try {
    let result = await databaseQueries.getCurrentPlacementContracts();

    if (result.length === 0) {
      console.log()
      result = 'No contracts in force'
    }

    res.status(200).json({
      success: true,
      contractList: result
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { createProductionFacility, createEquipmentType, createPlacementContract, getCurrentPlacementContracts };