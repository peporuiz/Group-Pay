import Koa from 'koa'
import bodyParser from 'koa-body'
import router from './routes/group/groups'

const app = new Koa()
const port = 3000

app.use(bodyParser({multipart:true, urlencodede:true}))
app.use(router.routes())

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`)
})