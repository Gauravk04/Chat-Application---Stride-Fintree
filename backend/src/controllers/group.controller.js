import Group from "../models/group.model.js";

export const createGroup = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !members || !Array.isArray(members) || members.length < 2) {
    return res.status(400).json({ message: "Group name and at least two members required" });
  }

  try {
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};