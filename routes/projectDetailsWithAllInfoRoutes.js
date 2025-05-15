const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerformultiimages");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateIsActive,
  updateProjectImages,deleteProjectImage,deleteOverviewImage,deleteFeatureImage,deleteConventionalImage,deleteAccessoriesImage,
  updateIsDelete,
} = require("../controllers/projectDetailsWithAllInfoController");
const authenticateToken = require('../middleware/auth');

// Create a project with multiple images
// router.post(
//   "/create-projectDetailsWithImages",
//   upload.array("project_images"), authenticateToken,
//   createProject
// );

router.post(
  "/create-projectDetailsWithImages",
  upload.fields([
    { name: "project_images", maxCount: 1 },
    { name: "technical_images", maxCount: 10 },
    { name: "overview_images", maxCount: 10 },
    { name: "feature_images", maxCount: 10 },
    { name: "conventional_images", maxCount: 10 },
    { name: "accessories_images", maxCount: 10 },
  ]), authenticateToken,
  createProject
);

router.put(
  "/projects/:id/images",
  upload.fields([
    { name: "project_images", maxCount: 1 },
    { name: "technical_images", maxCount: 10 },
    { name: "overview_images", maxCount: 10 },
    { name: "feature_images", maxCount: 10 },
    { name: "conventional_images", maxCount: 10 },
    { name: "accessories_images", maxCount: 10 },
  ]), authenticateToken,
  updateProjectImages
);

// Get all projects
router.get("/projects", getAllProjects);

// Get a single project by ID
router.get("/projects/:project_name_id", getProjectById);

router.put("/projects/:id/is-active", authenticateToken, updateIsActive);

// Update isDelete status
router.delete("/projects/:id/is-delete", authenticateToken, updateIsDelete);

// router.put(
//   "/projects/:id/images",
//   upload.array("project_images", 5), authenticateToken,
//   updateProjectImages
// );

// Delete a specific image
router.delete("/projects/:id/delete-image", authenticateToken, deleteProjectImage);
router.delete("/projects/:id/delete-overview-image", authenticateToken, deleteOverviewImage);
router.delete("/projects/:id/delete-feature-image", authenticateToken, deleteFeatureImage);
router.delete("/projects/:id/delete-conventional-image", authenticateToken, deleteConventionalImage);
router.delete("/projects/:id/delete-accessories-image", authenticateToken, deleteAccessoriesImage);
module.exports = router;