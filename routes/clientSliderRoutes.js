const express = require('express');
const { upload } = require('../middleware/multer');
const { validateHomeSliderId } = require('../validations/homeSliderValidation');
const {
  addClientSlider,
  updateClientSlider,
  getClientSlider,
  isActiveStatus,
  isDeleteStatus
} = require('../controllers/clientSlider');
const authenticateToken = require('../middleware/auth');
const imageRequired = require('../validations/imageValidation');

const router = express.Router();

router.post('/create-clientslider', upload.single('img'), imageRequired, authenticateToken, addClientSlider);
router.put('/update-clientslider/:id', upload.single('img'), authenticateToken, validateHomeSliderId, updateClientSlider);
router.get('/get-clientslider', getClientSlider);
router.get('/find-clientslider', authenticateToken, getClientSlider);
router.put('/isactive-clientslider/:id', authenticateToken, validateHomeSliderId, isActiveStatus);
router.delete('/isdelete-clientslider/:id', authenticateToken, validateHomeSliderId, isDeleteStatus);

module.exports = router;