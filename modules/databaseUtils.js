const mysql = require("mysql");

// Create a database connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "admin_1",
  password: "=Ru=%c12ftkB=",
  database: "space_rental",
});


/**
  * Executes an SQL query using parameterization.
  * @param {string} query - SQL query with placeholders for parameters.
  * @param {Array} params - An array of parameters to be substituted into the request.
  * @returns {Promise} - A promise that is resolved with the results of the request.
  */
const makeAnyQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};


/**
 * Returns all data from specified table
 * WHERE whereField = whereValue; 
 */
const selectData = (tableName, whereField, whereValue) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM ?? WHERE ?? = ?",
      [tableName, whereField, whereValue],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    );
  });
};

/**
 * Updates a specified field in the table
 * WHERE whereField = whereValue; 
 */
const updateField = (tableName, setField, setValue, whereField, whereValue) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE ?? SET ?? = ? WHERE ?? = ?",
      [tableName, setField, setValue, whereField, whereValue],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    );
  });
};

/**
 * Updates a specified row table
 * WHERE whereField = whereValue; 
 */
const deleteRow = (tableName, whereField, whereValue) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM ?? WHERE ?? = ?",
      [tableName, whereField, whereValue],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      }
    );
  });
};

/**
 * Insert into specified table
 */
const insertRow = (tableName, fields, values) => {
  return new Promise((resolve, reject) => {
    const fieldString = fields.map(field => `\`${field}\``).join(', ');
    const valuePlaceholders = values.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${tableName}\` (${fieldString}) VALUES (${valuePlaceholders});`;
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

/** Query data  using a parameterized query. 
 *  @param {string} tableName - The name of the table from which the selection is made. 
 *  @param {string|number} whereField - Field on which the filtering is performed (by default 1, which means no filter).
 *  @param {string|number} whereValue - The value to filter on the whereField (default is 1). 
 *  @param {string} selectFields - String listing the fields to select (default is '*', all fields are selected). 
 *  @param {string|null} orderByField - A field to sort the results (default is null, no sorting is applied).
 *  @param {string|null} sortOrder - Sort order ('ASC' or 'DESC'). If not specified, sorting is not applied.
 *  @param {number|null} limit - Limit on the number of records returned (default is null, no limit applies).
 * 
 *  @returns {Promise<Object[]>} Promise, which is resolved by an array of objects representing rows from the table. 
 */
const selectDataByCriteria = (
  tableName,
  whereField = 1,
  whereValue = 1,
  selectFields = '*',
  orderByField = null,
  sortOrder = null,
  limit = null
) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT ${selectFields} FROM ?? WHERE ?? = ?`;
    const queryParams = [tableName, whereField, whereValue];

    if (orderByField) {
      query += ` ORDER BY ?? ${sortOrder ? sortOrder : ''}`;
      queryParams.push(orderByField);
    }

    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(limit);
    }

    pool.query(query, queryParams, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};



module.exports = { pool, makeAnyQuery, selectData, updateField, deleteRow, selectDataByCriteria, insertRow };
