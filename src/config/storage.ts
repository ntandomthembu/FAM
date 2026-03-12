import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storageConfig = {
    driver: process.env.STORAGE_DRIVER || 'local',
    local: {
        uploadDir: process.env.UPLOAD_DIR || './uploads',
    },
    s3: {
        bucket: process.env.S3_BUCKET || '',
        region: process.env.S3_REGION || 'us-east-1',
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
};

const localStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, storageConfig.local.uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp',
        'video/mp4', 'video/quicktime',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};

export const upload = multer({
    storage: localStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

export default storageConfig;