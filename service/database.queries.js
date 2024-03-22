const ApiError = require('../exceptions/api-error');

// Custom modules
const databaseUtils = require('../modules/databaseUtils');


async function createProductionFacility(description, equipment_area) {

  try {
    fields = ['description', 'equipment_area'];
    values = [description, equipment_area];
    const result = await databaseUtils.insertRow('production_facility', fields, values);
    return true;
  } catch (error) {
    throw error;
  }
}

async function createEquipmentType(description, area) {

  try {
    fields = ['description', 'area'];
    values = [description, area];
    const result = await databaseUtils.insertRow('equipment_type', fields, values);
    return true;
  } catch (error) {
    throw error;
  }
}

async function createPlacementContract(contractNumber, facilityCode, equipmentCode, quantity) {

  try {
    fields = ['contract_number', 'facility_code', 'equipment_code', 'quantity'];
    values = [contractNumber, facilityCode, equipmentCode, quantity];
    const result = await databaseUtils.insertRow('equipment_contract', fields, values);
    return true;
  } catch (error) {
    throw error;
  }
}

async function selectAvailableArea(facilityCode) {

  try {

    const query = `
      SELECT * 
      FROM production_facility 
      WHERE facility_code = ?
    `
    const result = await databaseUtils.makeAnyQuery(query, facilityCode);

    if (result.length === 0) {
      throw (ApiError.BusinessLogicError('Nonexistent facilityCode'));
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function selectEquipmentArea(equipmentCode) {

  try {

    const query = `
      SELECT * 
      FROM equipment_type
      WHERE equipment_code  = ?
    `
    const result = await databaseUtils.makeAnyQuery(query, equipmentCode);

    if (result.length === 0) {
      throw (ApiError.BusinessLogicError('Nonexistent equipmentCode'));
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function getCurrentPlacementContracts() {

  try {
    const result = await databaseUtils.makeAnyQuery(
      `SELECT production_facility.description AS facility_name
          , equipment_type.description AS equipment_name
          , equipment_contract.quantity AS equipment_quantity
      FROM equipment_contract
      JOIN equipment_type ON equipment_contract.equipment_code = equipment_type.equipment_code
      JOIN production_facility ON equipment_contract.facility_code = production_facility.facility_code
      `
    );
    return result;
  } catch (error) {
    throw error;
  }
}

if (require.main === module) {
}

module.exports = {
  createProductionFacility,
  createEquipmentType,
  createPlacementContract,
  getCurrentPlacementContracts,
  selectAvailableArea,
  selectEquipmentArea
};
