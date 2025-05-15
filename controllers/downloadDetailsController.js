const apiResponse = require('../helper/apiResponse');
const DownloadDetails = require('../models/DownloadDetails')

// Backend: Check and create gallery category

exports.addDownloadDetails = async (req, res) => {
  try {
    const { download_category } = req.body;

    // Check if a gallery category exists with isDelete false
    const activeDownload = await DownloadDetails.findOne({
      where: { download_category, isDelete: false },
    });

    if (activeDownload) {
      return apiResponse.validationErrorWithData(
        res,
        "Download category already exists",
        {}
      );
    }

    // If a deleted category exists, do NOT restore it; create a new record instead
    const img = req.file ? req.file.path : null;

    const newDownload = await DownloadDetails.create({
      img,
      download_category,
      isActive: true,
      isDelete: false, // New record is active
    });

    return apiResponse.successResponseWithData(
      res,
      "Download category added successfully",
      newDownload
    );
  } catch (error) {
    console.error("Add download category failed", error);
    return apiResponse.ErrorResponse(res, "Add download category failed");
  }
};


const sequelize = require('../config/database'); // Import the sequelize instance
const GalleryImageDetailsWithImages = require("../models/GalleryImageDetailsWithImages");
const { Op } = require("sequelize"); // Import Sequelize operators

exports.updateDownloadDetails = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params;
    const { download_category, desc } = req.body;
    const img = req.file ? req.file.path : null;

    const DownloadDetails1 = await DownloadDetails.findByPk(id);
    if (!DownloadDetails1) {
      return apiResponse.notFoundResponse(res, 'Download category not found');
    }

    // Check if another category (excluding the current one) already has the same title, regardless of isDelete status
    const existingDownloadCategory = await DownloadDetails.findOne({
      where: {
        download_category,
        id: { [Op.ne]: id }, // Exclude the current record
        isDelete: 0 // Ensure it's not a deleted category
      }
    });

    // Additional check: Allow update if the category name remains the same but only the image is changed
    if (existingDownloadCategory && download_category !== DownloadDetails1.download_category) {
      return apiResponse.validationErrorWithData(
        res,
        "Download category already exists when updating",
        {}
      );
    }

    // Update the DownloadDetails table
    DownloadDetails1.img = img || DownloadDetails1.img;
    DownloadDetails1.download_category = download_category;
    await DownloadDetails1.save({ transaction });

    // Update the GalleryImageDetailsWithImages table where gallery_category_id matches the id
    // await GalleryImageDetailsWithImages.update(
    //   { gallery_category: gallery_category }, // Update gallery_category in the second table
    //   { where: { gallery_category_id: id }, transaction }
    // );

    await transaction.commit(); // Commit transaction if everything is successful

    return apiResponse.successResponseWithData(res, 'Download category updated successfully', DownloadDetails1);
  } catch (error) {
    await transaction.rollback(); // Rollback in case of error
    console.error('Update download category failed', error);
    return apiResponse.ErrorResponse(res, 'Update download category failed');
  }
};

exports.getDownloadDetails = async (req, res) => {
  try {
    const DownloadDetails1 = await DownloadDetails.findAll({ where: { isDelete: false } });
    
    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`; // Adjust according to your setup
    console.log("baseUrl....", baseUrl);
    const DownloadDetailsWithBaseUrl = DownloadDetails1.map(DownloadDetails1 => {
      console.log("Project Details.img", DownloadDetails1.img);
      return {
        ...DownloadDetails1.toJSON(), // Convert Sequelize instance to plain object
        img: DownloadDetails1.img ? baseUrl + DownloadDetails1.img.replace(/\\/g, '/') : null 
      };
    });

    return apiResponse.successResponseWithData(res, 'Download category retrieved successfully', DownloadDetailsWithBaseUrl);
  } catch (error) {
    console.error('Get download category failed', error);
    return apiResponse.ErrorResponse(res, 'Get download category failed');
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const DownloadDetails1 = await DownloadDetails.findByPk(id);

    if (!DownloadDetails1) {
      return apiResponse.notFoundResponse(res, 'Download category not found');
    }

    DownloadDetails1.isActive = !DownloadDetails1.isActive;
    await DownloadDetails1.save();

    return apiResponse.successResponseWithData(res, 'Download category status updated successfully', DownloadDetails1);
  } catch (error) {
    console.error('Toggle download category status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle download category status failed');
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const DownloadDetails1 = await DownloadDetails.findByPk(id);

    if (!DownloadDetails1) {
      return apiResponse.notFoundResponse(res, 'download category not found');
    }

    DownloadDetails1.isDelete = !DownloadDetails1.isDelete;
    await DownloadDetails1.save();

    return apiResponse.successResponseWithData(res, 'Download category delete status updated successfully', DownloadDetails1);
  } catch (error) {
    console.error('Toggle download category delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle download category delete status failed');
  }
};
