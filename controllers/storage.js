const StorageService = require("../services/storage")
class StorageController {
    storage = StorageService
    async upload(req,res) {
        try {
            const file = req.file
            if (!file) return res.sendStatus(400)
            const uploaded = await this.storage.upload(file)
            res.status(200).json(uploaded)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    async getAll(req,res) {
        try {
            const files = await this.storage.getAll()
            res.status(200).json(files)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async download(req,res) {
        try {
            const {key} = req.params

            const file = await this.storage.download(key)
            console.log(file.Metadata)
            // res.sendFile(file)
            res.setHeader('Content-Type', file.ContentType ?? 'application/octet-stream')
            res.setHeader('Content-Length', file.ContentLength?.toString() ?? '')
            res.setHeader('Content-Disposition', `attachment; filename=${key}`);
            (file.Body).pipe(res)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async delete(req,res) {
        try {
            const {key} = req.params
            const deleted = await this.storage.delete(key)

            res.status(200).send(deleted)
        } catch (error) {
            res.status(500).send(error)
        }
    }


    async enableVersioning(req,res) {
        try {
            await this.storage.enableVersioning()

            res.sendStatus(200)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async listVersions(req,res) {
        try {
            const {key} = req.params
            const versions = await this.storage.listVersions(key)

            res.status(200).send(versions)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    async restoreVersion(req,res) {
        try {
            const {key, versionId} = req.params
            const versions = await this.storage.restoreVersion(key, versionId)

            res.status(200).send(versions)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

module.exports = new StorageController()