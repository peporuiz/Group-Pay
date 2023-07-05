const Group = require('../models/group');

// Obtener todos los grupos
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grupos.' });
  }
};

// Crear un nuevo grupo
const createGroup = async (req, res) => {
  const { name, description, members } = req.body;

  if (!name || !members || members.length === 0) {
    return res.status(400).json({ error: 'Nombre y miembros del grupo son requeridos.' });
  }

  try {
    const newGroup = new Group({
      name,
      description,
      members,
      expenses: [],
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el grupo.' });
  }
};

// Eliminar un grupo
const deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    await Group.findByIdAndDelete(groupId);
    res.json({ message: 'Grupo eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el grupo.' });
  }
};

module.exports = {
  getAllGroups,
  createGroup,
  deleteGroup,
};
