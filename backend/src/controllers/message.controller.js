import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/**
 * @api {get} /users/sidebar Get Users for Sidebar
 * @apiName GetUsersForSidebar
 * @apiGroup User
 * @apiDescription Fetches a list of users excluding the logged-in user.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {String} users._id User ID.
 * @apiSuccess {String} users.name User name.
 * @apiSuccess {String} users.email User email.
 *
 * @apiError (500) InternalServerError Internal server error.
 */
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @api {get} /messages/:id Get Messages
 * @apiName GetMessages
 * @apiGroup Message
 * @apiDescription Fetches messages between the logged-in user and another user.
 *
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {String} id ID of the user to chat with.
 *
 * @apiSuccess {Object[]} messages List of messages.
 * @apiSuccess {String} messages._id Message ID.
 * @apiSuccess {String} messages.senderId Sender ID.
 * @apiSuccess {String} messages.receiverId Receiver ID.
 * @apiSuccess {String} messages.content Message content.
 * @apiSuccess {Date} messages.timestamp Message timestamp.
 *
 * @apiError (500) InternalServerError Internal server error.
 */
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let documentUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      documentUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: documentUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
