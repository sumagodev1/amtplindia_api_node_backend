const apiResponse = require("../helper/apiResponse");
const SubCategory = require("../models/SubCategory");
const { Op } = require('sequelize');


exports.addSubCategory = async (req, res) => {
  try {
    const { project_category, subproject_category, project_category_id } = req.body;
    const img = req.file ? req.file.path : null;

    // Check if the title is already taken by an active category
    const existingActiveCategory = await SubCategory.findOne({ where: { project_category, subproject_category, project_category_id, isDelete: false } });

    if (existingActiveCategory) {
      return apiResponse.ErrorResponse(res, "Sub Project with this Project already exists.");
    }

    // Check if the title was deleted earlier, if yes, reactivate it by adding a new record
    const existingDeletedCategory = await SubCategory.findOne({ where: { project_category, subproject_category, project_category_id, isDelete: true } });

    if (existingDeletedCategory) {
      // If the title is marked as deleted, create a new category with the same title but isDelete: false
      const newCategory = await SubCategory.create({
        project_category, 
        subproject_category,
        project_category_id,
        img,
        isActive: true,
        isDelete: false, // Mark as active
      });

      return apiResponse.successResponseWithData(
        res,
        "Category re-added successfully",
        newCategory
      );
    }

    // If no deleted category, create a new active category
    const newCategory = await SubCategory.create({
      img,
      project_category, 
      subproject_category,
      project_category_id,
      isActive: true,
      isDelete: false,
    });

    return apiResponse.successResponseWithData(
      res,
      "Category added successfully",
      newCategory
    );
  } catch (error) {
    console.error("Add Category failed", error);
    return apiResponse.ErrorResponse(res, "Add Category failed");
  }
};

const sequelize = require('../config/database'); // Import the sequelize instance
const ProjectDetails = require('../models/ProjectDetails');
const ProjectDetailsWithImages = require("../models/ProjectDetailsWithImages");
const ProjectDetailsWithAllInfo = require("../models/ProjectDetailsWithAllInfo");

exports.updateSubCategory = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params;
    const { project_category, subproject_category, project_category_id, desc } = req.body; // `desc` refers to sorting order
    const img = req.file ? req.file.path : null;

    // Find category in the Category table
    const category = await SubCategory.findByPk(id, { transaction });
    if (!category) {
      await transaction.rollback();
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    // Check if another category already has the same title in the Category table
    const existingCategories = await SubCategory.findAll({ where: { project_category_id, subproject_category }, transaction });
    
    // Implementing new logic: Allow update if the same category is being updated, 
    // but prevent if another category has the same title and is not deleted
    // if (existingCategories.length > 0) {
    //   const hasActiveCategory = existingCategories.some(cat => cat.isDelete === false && cat.id !== parseInt(id));
    //   if (hasActiveCategory) {
    //     await transaction.rollback();
    //     return apiResponse.validationErrorWithData(
    //       res,
    //       "Sub Project with this Project already exists",
    //       {}
    //     );
    //   }
    // }
    if (existingCategories.length > 0) {
      const isDuplicate = existingCategories.some(
        cat => cat.isDelete === false && cat.id !== parseInt(id)
      );
      if (isDuplicate) {
        await transaction.rollback();
        return apiResponse.validationErrorWithData(
          res,
          "This Sub Project already exists under the selected Project Category",
          {}
        );
      }
    }

    // Update the Category table
    category.img = img || category.img;
    category.project_category = project_category; // Allow title update only if isDelete was true before
    category.subproject_category = subproject_category;
    category.project_category_id = project_category_id;
    category.desc = desc; // Update description (sorting order or other field)
    await category.save({ transaction });

    // Update ProjectDetails table where project_category_id matches the Category ID
    await ProjectDetails.update(
      { project_category_id: id, project_category: project_category, subproject_category: subproject_category }, // Update the related fields
      { where: { project_category_id: id }, transaction }
    );

    // Update ProjectDetailsWithAllInfo table where project_category_id matches the Category ID
    await ProjectDetailsWithAllInfo.update(
      {
        project_category: project_category,
        subproject_category: subproject_category,
        project_category_id: project_category_id
      },
      {
        where: { subproject_category_id: id },
        transaction
      }
    );


    await transaction.commit(); // Commit transaction if everything is successful

    return apiResponse.successResponseWithData(
      res,
      "Category updated successfully",
      category
    );
  } catch (error) {
    await transaction.rollback(); // Rollback in case of error
    console.error("Update Category failed", error);
    return apiResponse.ErrorResponse(res, "Update Category failed");
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    
    const categories = await SubCategory.findAll({
      where: { isDelete: false }, // Exclude deleted categories
    });

    // Fetch all active projects
    const activeProjects = await ProjectDetails.findAll({
      where: { isActive: true },
      attributes: ['project_category_id'],
    });

    // Get category IDs that have active projects
    const activeCategoryIds = new Set(activeProjects.map(project => project.project_category_id));

    // Sort categories based on whether they have active projects
    const sortedCategories = categories.sort((a, b) => {
      const aHasProject = activeCategoryIds.has(a.id);
      const bHasProject = activeCategoryIds.has(b.id);

      if (aHasProject && !bHasProject) return -1;
      if (!aHasProject && bHasProject) return 1;
      return 0;
    });
  

    return apiResponse.successResponseWithData( 
      res,
      "Category retrieved successfully",
      sortedCategories
    );
  } catch (error) {
    console.error("Get Category failed", error);
    return apiResponse.ErrorResponse(res, "Get Category failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const Category1 = await SubCategory.findByPk(id);

    if (!Category1) {
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    Category1.isActive = !Category1.isActive;
    await Category1.save();

    return apiResponse.successResponseWithData(
      res,
      "Category status updated successfully",
      Category1
    );
  } catch (error) {
    console.error("Toggle Category status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle Category status failed"
    );
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const Category1 = await SubCategory.findByPk(id);

    if (!Category1) {
      return apiResponse.notFoundResponse(res, "Category not found");
    }

    Category1.isDelete = !Category1.isDelete;
    await Category1.save();

    return apiResponse.successResponseWithData(
      res,
      "Category delete status updated successfully",
      Category1
    );
  } catch (error) {
    console.error("Toggle Category delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle Category delete status failed"
    );
  }
};
