import Router from 'koa-router'
const router = new Router()

// Ruta para obtener todos los grupos
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
});

// Ruta para crear un nuevo grupo
router.post('/', async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el grupo' });
  }
});

// Ruta para obtener un grupo por su ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el grupo' });
  }
});

// Ruta para actualizar un grupo por su ID
router.put('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!group) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el grupo' });
  }
});

// Ruta para eliminar un grupo por su ID
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    res.json({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el grupo' });
  }
});

module.exports = router;
