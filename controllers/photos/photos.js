const path = require("path");

const getPhoto = async (req, res) => {
    try {
        const { photoId } = await req.params
        const filePath = path.join(__dirname, '../../uploads', photoId);
        res.status(200).sendFile(filePath,
            // (err) => {
            //     if (err) {
            //         res.status(404).json({ error: err.message })
            //     }
            // }
        )
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getPhoto }