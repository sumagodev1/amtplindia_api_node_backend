const ClientSlider = require("../models/ClientSlider");
const apiResponse = require("../helper/apiResponse");

exports.addClientSlider = async (req, res) => {
  try {
    if (!req.file) {
      return apiResponse.ErrorResponse(res, "Image is required");
    }

    const img = req.file.path;

    const clientSlider = await ClientSlider.create({
      img,
      isActive: true,
      isDelete: false,
    });
    return apiResponse.successResponseWithData(
      res,
      "Client Slider added successfully",
      clientSlider
    );
  } catch (error) {
    console.error("Add Client Slider failed", error);
    return apiResponse.ErrorResponse(res, "Add Client Slider failed");
  }
};

exports.updateClientSlider = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing ClientSlider entry
    const clientSlider = await ClientSlider.findByPk(id);
    if (!clientSlider) {
      return apiResponse.notFoundResponse(res, "Client Slider not found");
    }

    // Check if a new file is uploaded
    if (req.file) {
      clientSlider.img = req.file.path;
    }

    await clientSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "Client Slider updated successfully",
      clientSlider
    );
  } catch (error) {
    console.error("Update Client Slider failed", error);
    return apiResponse.ErrorResponse(res, "Update Client Slider failed");
  }
};

exports.getClientSlider = async (req, res) => {
  try {
    const clientSliders = await ClientSlider.findAll({ where: { isDelete: false } });

    // Base URL for images
    const baseUrl = `${process.env.SERVER_PATH}`;
    console.log("baseUrl", baseUrl);
    
    const clientSlidersWithBaseUrl = clientSliders.map((clientSlider) => ({
      ...clientSlider.toJSON(),
      img: clientSlider.img ? baseUrl + clientSlider.img.replace(/\\/g, "/") : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      "Client Slider retrieved successfully",
      clientSlidersWithBaseUrl
    );
  } catch (error) {
    console.error("Get Client Slider failed", error);
    return apiResponse.ErrorResponse(res, "Get Client Slider failed");
  }
};

exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const clientSlider = await ClientSlider.findByPk(id);

    if (!clientSlider) {
      return apiResponse.notFoundResponse(res, "Client Slider not found");
    }

    clientSlider.isActive = !clientSlider.isActive;
    await clientSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "Client Slider status updated successfully",
      clientSlider
    );
  } catch (error) {
    console.error("Toggle clientSlider status failed", error);
    return apiResponse.ErrorResponse(res, "Toggle Client Slider status failed");
  }
};

exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const clientSlider = await ClientSlider.findByPk(id);

    if (!clientSlider) {
      return apiResponse.notFoundResponse(res, "Client Slider not found");
    }

    clientSlider.isDelete = !clientSlider.isDelete;
    await clientSlider.save();

    return apiResponse.successResponseWithData(
      res,
      "Client Slider delete status updated successfully",
      clientSlider
    );
  } catch (error) {
    console.error("Toggle clientSlider delete status failed", error);
    return apiResponse.ErrorResponse(
      res,
      "Toggle Client Slider delete status failed"
    );
  }
};
