const cloudinary = require("../../config/cloudinary")

async function storeMediaController(req, res){
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto" // handles images, pdf, videos, etc
        });

        res.status(200).json({
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Media not send",
            error: true,
            success: false
        })
    }
}

module.exports = storeMediaController