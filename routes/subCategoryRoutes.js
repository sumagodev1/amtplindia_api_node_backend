const express = require('express');
const { upload } = require('../middleware/multer');
const { validateCategory, validateCategoryId } = require('../validations/categoryValidation');
const {
  addSubCategory,
  updateSubCategory,
  getSubCategory,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/subCategoryController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-subcategory', upload.single('img'), authenticateToken,  addSubCategory);
router.put('/update-subcategory/:id', upload.single('img'), authenticateToken, validateCategory, validateCategoryId, updateSubCategory);
router.get('/get-subcategory', getSubCategory);
router.get('/find-subcategory', authenticateToken, getSubCategory);
router.put('/isactive-subcategory/:id', authenticateToken, validateCategoryId, isActiveStatus);
router.delete('/isdelete-subcategory/:id', authenticateToken, validateCategoryId, isDeleteStatus);

module.exports = router;
