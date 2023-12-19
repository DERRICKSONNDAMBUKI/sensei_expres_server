const path = require("path");
const User = require("../../models/user.model");
const { photoUpload } = require("../../services/photoUpload");
const CryptoJS = require('crypto-js');
const { cryptojsSecret } = require("../../common/config/config");
const { constants } = require("../../common/utils/constants/constants");


// list users
const users = async (req, res) => {
    try {
        const users = await User.find({}, {
            firstName: 1, lastName: 1,
            email: 1, DoB: 1,
            photoUrl: 1, tel:1,
            residence:1, role:1,
            department:1,cedGroup:1,
            createdAt: 1, updatedAt: 1
        })
        res.status(200).json(users)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const userById = async (req, res, next) => {
    try {
        console.log(req.user);
        const { userId } = await req.params
        let user = await User.findById(userId, { password: 0 })


        // req.user = user
        res.status(200).json(user)
        // next()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = await req.params
        let user = await req.body
        // console.log('req - ', user);

        if (await req.file) {
            const profilePhotoName = await req.file.filename
            user.profilePhoto = `${constants.photoUrl}/${profilePhotoName}`
        }

        if (user) {
            const encrypted_password = CryptoJS.AES.encrypt(
                user.password, cryptojsSecret
            ).toString()
            user = {
                ...user,
                password: encrypted_password
            }

            let updatedUser = await User.findByIdAndUpdate(userId, user, { new: true })
            // console.log(updatedUser);
            const decrypted_password = CryptoJS.AES.decrypt(updatedUser.password, cryptojsSecret)
                .toString(CryptoJS.enc.Utf8)
            updatedUser = {
                ...updatedUser._doc,
                password: decrypted_password
            }

            res.status(200).json(updatedUser)
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = await req.params
        const deletedUser = await User.findByIdAndDelete(userId)
        if (deletedUser == null) return res.status(500).json({ error: 'user not found' })
        res.status(200).json(deletedUser)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const deleteUsers = async(req,res)=>{
    try {
        const deleteAllUsers = await User.deleteMany({})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const isNotUser = async (req, res, next) => {
    try {
        const { userId } = await req.params
        const user = await User.findById(userId)
        if (user.role == 'user') return res.status(403).json({ error: 'role for creating group is required' })
        next()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

const profilePhoto = async (req, res) => {
    try {
        const { userId } = await req.params
        const user = await User.findById(userId)
        const profilePhotoName = user.profilePhoto

        const filePath = path.join(__dirname, '../../uploads', profilePhotoName); // ricky has easy bugs -> photo should be replaced
        res.status(200).sendFile(filePath, (err) => {
            if (err) {
                res.status(404).json({ error: err.message })
            }
        })
        // res.status(200).json({ message: `uploaded successfully: ${profilePhotoName}` })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

// todo delete profilePhoto

module.exports = {
    users,
    userById,
    updateUser,
    deleteUser,
    isNotUser,
    // profilePhotoUpload,
    profilePhoto
}