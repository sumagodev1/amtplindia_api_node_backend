// const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");
const ProjectDetailsWithAllInfo = require("../models/ProjectDetailsWithAllInfo");
const fs = require("fs");
const path = require("path");
// Upload multiple images

const createProject = async (req, res) => {
  try {
    const {
      project_category_id,
      project_category,
      subproject_category_id,
      subproject_category,
      project_type,
      projectDesc,
      projecttechnicalDesc,
      projectOverviewDesc,
      projectfeatureDesc,
      projectConventionalDesc,
      projectAccessoriesDesc,
    } = req.body;

    let imagePaths = null;
    if (req.files["project_images"] && req.files["project_images"].length > 0) {
    imagePaths = `uploads/projectDetailsWithImages/${req.files["project_images"][0].filename}`;
    }

    // Get multiple `project_images` file paths
    const technical_imagesPaths = req.files["technical_images"]
    ? req.files["technical_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
    : [];

    const overview_imagesPaths = req.files["overview_images"]
    ? req.files["overview_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
    : [];

    const feature_imagesPaths = req.files["feature_images"]
    ? req.files["feature_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
    : [];

    const conventional_imagesPaths = req.files["conventional_images"]
    ? req.files["conventional_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
    : [];

    const accessories_imagesPaths = req.files["accessories_images"]
    ? req.files["accessories_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
    : [];


    // Check if the project name already exists in the same category and is not deleted
    const existingProject = await ProjectDetailsWithAllInfo.findOne({
      where: {
        project_category,
        subproject_category,
        project_type,
        isDelete: false, // Ensure that it is not a deleted project
      },
    });

    if (existingProject) {
      return res.status(400).json({
        message: `Project Type with the name "${project_type}" already exists for this Project.`,
      });
    }

    // Create a new project entry in the database
    const project = await ProjectDetailsWithAllInfo.create({
      project_category_id,
      project_category,
      subproject_category_id,
      subproject_category,
      project_type,
      projectDesc,
      projecttechnicalDesc,
      projectOverviewDesc,
      projectfeatureDesc,
      projectConventionalDesc,
      projectAccessoriesDesc,
      
      project_images: imagePaths, // Store multiple images
      technical_images: technical_imagesPaths,
      overview_images: overview_imagesPaths,
      feature_images: feature_imagesPaths,
      conventional_images: conventional_imagesPaths,
      accessories_images: accessories_imagesPaths,
    });

    res.status(201).json({ message: "Project created successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProjectImages = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectDetailsWithAllInfo.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Extract fields from request body
    const {
        project_category_id,
        project_category,
        subproject_category_id,
        subproject_category,
        project_type,
        projectDesc,
        projecttechnicalDesc,
        projectOverviewDesc,
        projectfeatureDesc,
        projectConventionalDesc,
        projectAccessoriesDesc,
    } = req.body;

    // Check if another project in the same category has the same name and is not deleted
    if (subproject_category) {
      const existingProject = await ProjectDetailsWithAllInfo.findOne({
        where: {
          project_category,
          subproject_category,
          isDelete: false, // Ensure the project is not deleted
        },
      });

      if (existingProject && existingProject.id !== parseInt(id)) {
        return res.status(400).json({
          message: `Project with the name '${subproject_category}' already exists for this category.`,
        });
      }
    }

        let projectImgPath = project.project_images; // Keep existing hero image by default
        if (req.files["project_images"] && req.files["project_images"].length > 0) {
            projectImgPath = `uploads/projectDetailsWithImages/${req.files["project_images"][0].filename}`;
        }

    // Parse existing images properly (ensure it's always an array)
    let existingImages = project.technical_images;
    if (typeof existingImages === "string") {
      existingImages = JSON.parse(existingImages); // Fix for string issue
    }
    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }

    // Get new image paths from uploaded files
    const newImages = req.files["technical_images"]
      ? req.files["technical_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const technicalUpdatedImages = [...existingImages, ...newImages];

    let existingoverviewImages = project.overview_images;
    if (typeof existingoverviewImages === "string") {
      existingoverviewImages = JSON.parse(existingoverviewImages); // Fix for string issue
    }
    if (!Array.isArray(existingoverviewImages)) {
      existingoverviewImages = [];
    }

    // Get new image paths from uploaded files
    const newoverviewImages = req.files["overview_images"]
      ? req.files["overview_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const overviewUpdatedImages = [...existingoverviewImages, ...newoverviewImages];

    let existingfeatureImages = project.feature_images;
    if (typeof existingfeatureImages === "string") {
      existingfeatureImages = JSON.parse(existingfeatureImages); // Fix for string issue
    }
    if (!Array.isArray(existingfeatureImages)) {
      existingfeatureImages = [];
    }

    // Get new image paths from uploaded files
    const newfeatureImages = req.files["feature_images"]
      ? req.files["feature_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const featureUpdatedImages = [...existingfeatureImages, ...newfeatureImages];

    let existingconventionalImages = project.conventional_images;
    if (typeof existingconventionalImages === "string") {
      existingconventionalImages = JSON.parse(existingconventionalImages); // Fix for string issue
    }
    if (!Array.isArray(existingconventionalImages)) {
      existingconventionalImages = [];
    }

    // Get new image paths from uploaded files
    const newconventionalImages = req.files["conventional_images"]
      ? req.files["conventional_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const conventionalUpdatedImages = [...existingconventionalImages, ...newconventionalImages];

    let existingaccessoriesImages = project.accessories_images;
    if (typeof existingaccessoriesImages === "string") {
      existingaccessoriesImages = JSON.parse(existingaccessoriesImages); // Fix for string issue
    }
    if (!Array.isArray(existingaccessoriesImages)) {
      existingaccessoriesImages = [];
    }

    // Get new image paths from uploaded files
    const newaccessoriesImages = req.files["accessories_images"]
      ? req.files["accessories_images"].map((file) => `uploads/projectDetailsWithImages/${file.filename}`)
      : [];

    // Merge old and new images
    const accessoriesUpdatedImages = [...existingaccessoriesImages, ...newaccessoriesImages];

    // Update project fields
    project.project_category_id = project_category_id || project.project_category_id;
    project.project_category = project_category || project.project_category;

    project.subproject_category_id = subproject_category_id || project.subproject_category_id
    project.subproject_category = subproject_category || project.subproject_category
    project.project_type = project_type || project.project_type
    project.projectDesc = projectDesc || project.projectDesc
    project.projecttechnicalDesc = projecttechnicalDesc || project.projecttechnicalDesc
    project.projectOverviewDesc = projectOverviewDesc || project.projectOverviewDesc
    project.projectfeatureDesc = projectfeatureDesc || project.projectfeatureDesc
    project.projectConventionalDesc = projectConventionalDesc || project.projectConventionalDesc
    project.projectAccessoriesDesc = projectAccessoriesDesc || project.projectAccessoriesDesc

    project.technical_images = technicalUpdatedImages;
    project.overview_images = overviewUpdatedImages;
    project.feature_images = featureUpdatedImages;
    project.conventional_images = conventionalUpdatedImages;
    project.accessories_images = accessoriesUpdatedImages;
    project.project_images = projectImgPath;

    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectDetailsWithAllInfo.findAll({ where: { isDelete: false } });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    // const { id } = req.params;
    // const project = await ProjectDetailsWithAllInfo.findByPk(id);

    const { project_name_id  } = req.params; // Get project_name_id  from request parameters
    // const project = await ProjectDetailsWithAllInfo.findOne({
      const projects = await ProjectDetailsWithAllInfo.findAll({
      where: { project_name_id, isDelete: false, isActive: false  },  // Query by project_name_id 
    });


    // if (!projects) {
    //   return res.status(404).json({ message: "Project not found" });
    // }
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No active project found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateIsActive = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isActive } = req.body;

    const project = await ProjectDetailsWithAllInfo.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isActive = !project.isActive; // Update isActive status
    await project.save();

    res
      .status(200)
      .json({ message: "isActive status updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
  const deleteProjectImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithAllInfo.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.technical_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.technical_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteOverviewImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithAllInfo.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.overview_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.overview_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteFeatureImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithAllInfo.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.feature_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.feature_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteConventionalImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithAllInfo.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.conventional_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.conventional_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteAccessoriesImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imagePath } = req.body; // The image URL to delete
  
      const project = await ProjectDetailsWithAllInfo.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Parse the stringified JSON array into an actual array
      let images = [];
      try {
        images = JSON.parse(project.accessories_images);
      } catch (error) {
        return res.status(500).json({ message: "Error parsing images" });
      }
  
      // Normalize the imagePath format to match the stored paths
      const normalizedImagePath = imagePath.startsWith('/') ? imagePath : `${imagePath}`;
  
      // Check if the image exists in the project
      console.log(normalizedImagePath)
      if (!images.includes(normalizedImagePath)) {
        return res.status(400).json({ message: "Image not found in project" });
      }
  
      // Remove the image from the array
      project.accessories_images = images.filter((img) => img !== normalizedImagePath);
  
      // Delete the image from the server
    //   const fullPath = path.join(__dirname, "..", normalizedImagePath);
    const fullPath = path.join(__dirname, "..", "uploads/projectDetailsWithImages", path.basename(normalizedImagePath));


      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
  
      await project.save();
      res.status(200).json({ message: "Image deleted successfully", project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update isDelete status
const updateIsDelete = async (req, res) => {
  try {
    const { id } = req.params;
    // const { isDelete } = req.body;

    const project = await ProjectDetailsWithAllInfo.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.isDelete = !project.isDelete;  // Update isDelete status
    await project.save();

    res
      .status(200)
      .json({ message: "isDelete status updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateIsActive,
  updateIsDelete,deleteProjectImage,updateProjectImages,
  deleteOverviewImage,
  deleteFeatureImage,
  deleteConventionalImage,
  deleteAccessoriesImage
};
