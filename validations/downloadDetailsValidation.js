const { body, param } = require('express-validator');

const validateDownloadDetails = [
  body('download_category').notEmpty().withMessage('download category is required'),
];

const validateDownloadDetailsId = [
  param('id').isInt().withMessage('ID must be an integer')
];

module.exports = { validateDownloadDetails, validateDownloadDetailsId };
