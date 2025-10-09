const { Router } = require("express")
const multer = require("multer")
const storage = require("../controllers/storage")

const router = Router()
const upload = multer()
const controller = storage
router.post('/', upload.single('file'), async (req,res) => {
    await controller.upload(req,res)
})

router.get('/', async (req,res) => {
    await controller.getAll(req,res)
})

router.delete('/:key', async (req,res) => {
    await controller.delete(req,res)
})

router.get('/:key', async (req,res) => {
    await controller.download(req,res)
})

router.put('/version', async (req,res) => {
    await controller.enableVersioning(req,res)
})

router.get('/versions/:key', async (req,res) => {
    await controller.listVersions(req,res)
})

router.post('/version/:key/:versionId', async (req,res) => {
    await controller.restoreVersion(req,res)
})

module.exports = router 