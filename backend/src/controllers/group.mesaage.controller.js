import GroupMessage from "../models/group.message.model.js";
import Group from "../models/group.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js"; 

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId, text, image } = req.body;
    const senderId = req.body.senderId;

    // Validate input
    if (!groupId || (!text && !image)) {
      return res.status(400).json({ message: "groupId and text or image required" });
    }

    // Check group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Check sender is part of the group
    if (!group.members.some(member => member.equals(senderId))) {
      return res.status(403).json({ message: "Sender is not a member of the group" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "group_messages",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Save group message
    const newMessage = new GroupMessage({
      groupId,
      senderId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit to all group members (if you're using socket.io rooms)
    io.to(groupId.toString()).emit("newGroupMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await GroupMessage.find({ groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};