const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, PutBucketVersioningCommand, ListObjectVersionsCommand, CopyObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require('dotenv');
const { randomBytes } = require("node:crypto");
const path = require('node:path')
dotenv.config()
class StorageService {
    client;
    bucket;
    constructor () {
        this.client = new S3Client({
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS,
                secretAccessKey: process.env.S3_SECRET
            },
            region: process.env.S3_REGION
        })

        this.bucket = process.env.S3_BUCKET
    }

    async getAll () {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucket
            })

            return await this.client.send(command)
        } catch (error) {
            throw error
        }
    }

    async upload(file) {
        try {
            const extension = path.extname(file.originalname)
            const fileName = randomBytes(16).toString('hex') + extension
            
            const meta = {
                originalFilename: file.originalname,
                userId: '1'
            }
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                Metadata: meta,
            })


            await this.client.send(command)
            const getObjectCommand = new GetObjectCommand({
                Bucket: this.bucket,
                Key: fileName
            })

            const url = await getSignedUrl(this.client, getObjectCommand, {
                expiresIn: 60
            })

            return {fileName, url}
        } catch (error) {
            throw error
        }
    }

    async delete(key) {
        try {const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        })
    
        return await this.client.send(command)
        } catch (error) {
            throw error
        }
    }

    async download(key) {
        try {const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        })
    
        return await this.client.send(command)
        } catch (error) {
            throw error
        }
    }

    async enableVersioning() {
        try {
            const command = new PutBucketVersioningCommand({
                Bucket: this.bucket,
                VersioningConfiguration: {
                    Status: 'Enabled'
                }
            })

            return await this.client.send(command)
        } catch (error) {
            throw error

        }
    }

    async listVersions(key) {
        try {
            const command = new ListObjectVersionsCommand({
                Bucket: this.bucket,
                Prefix: key,
            })

            const response = await this.client.send(command)

            return response.Versions.filter((v) => v.Key === key)
        } catch (error) {
            throw error
        }
    }

    async restoreVersion(key, versionId) {
        try {
            const command = new CopyObjectCommand({
                Bucket: this.bucket,
                Key: key,
                CopySource: `${this.bucket}/${key}?versionId=${versionId}`
            })

            return await this.client.send(command)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new StorageService()