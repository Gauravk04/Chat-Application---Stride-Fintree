import GroupMessage from "../models/group.message.model.js";
import Group from "../models/group.model.js";

export const sendGroupMessage = async (req, res) => {
  const { groupId, senderId, text, image } = req.body;

  if (!groupId || !senderId || (!text && !image)) {
    return res.status(400).json({ message: "groupId, senderId, and text or image required" });
  }

  // Optional: Check if group exists and sender is a member
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }
  if (!group.members.includes(senderId)) {
    return res.status(403).json({ message: "Sender is not a member of the group" });
  }

  try {
    const groupMessage = new GroupMessage({ groupId, senderId, text, image });
    await groupMessage.save();
    res.status(201).json(groupMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};