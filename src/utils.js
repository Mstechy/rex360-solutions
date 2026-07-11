/**
 * Shared utility functions for the application
 */

/**
 * Get the value of an HTML element by its ID
 * @param {string} id - The ID of the element
 * @returns {string} The value of the element or empty string if not found
 */
export const getValue = (id) => {
  const element = document.getElementById(id);
  return element ? element.value : '';
};

/**
 * Get the current service price based on service type
 * @param {string} serviceType - The type of service
 * @param {object} prices - The prices object
 * @returns {number} The price or 0 if not found
 */
export const getServicePrice = (serviceType, prices) => {
  return prices[serviceType] || 0;
};

/**
 * Validate required form fields
 * @param {string[]} fields - Array of field IDs to validate
 * @returns {boolean} True if all fields are filled
 */
export const validateFields = (fields) => {
  return fields.every(id => getValue(id).trim() !== '');
};
