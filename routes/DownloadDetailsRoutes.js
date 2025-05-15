const express = require('express');
const { upload } = require('../middleware/multer');
const { validatedDownloadDetails, validateDownloadDetailsId } = require('../validations/downloadDetailsValidation');
const {
  addDownloadDetails,
  updateDownloadDetails,
  getDownloadDetails,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/downloadDetailsController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/create-downloadDetails', upload.single('img'), authenticateToken,  addDownloadDetails);
router.put('/update-downloadDetails/:id', upload.single('img'), authenticateToken, validateDownloadDetailsId, updateDownloadDetails);
router.get('/get-downloadDetails', getDownloadDetails);
router.get('/find-downloadDetails', authenticateToken, getDownloadDetails);
router.put('/isactive-downloadDetails/:id', authenticateToken, validateDownloadDetailsId, isActiveStatus);
router.delete('/isdelete-downloadDetails/:id', authenticateToken, validateDownloadDetailsId, isDeleteStatus);

module.exports = router;
