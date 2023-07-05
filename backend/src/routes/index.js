import Router from 'koa-router'
import getHealth from './health/health'
import groups from './group/groups'

const router = new Router()

router.get('/health', getHealth)

router.get('/api/group', groups.getAllgroups) //Obtiene todos los groupos de la lista
/*router.get('/api/group/:name', groups.getgroupsName) //Obtiene todos los groupos que contengan ese nombre
router.get('/api/group/:id', groups.getgroupId) //Obtiene el groupo por su ID
router.post('/api/group', groups.addgroups) //Añade groupos mediante el formato utilizado
router.put('/api/group/:id', groups.updategroup) //Actualiza un groupo con el formato usado
router.delete('/api/group/:id', groups.deletegroup) //Elimina un groupo mediante el id*/


export default router