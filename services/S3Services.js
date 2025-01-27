const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

exports.uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = "expense-tracker001";
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;

    const s3Client = new S3Client({
        region: "ap-south-1", 
        credentials: {
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        },
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename, 
        Body: data,
    };

    try {
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        console.log("Upload successful:", response);
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
    } catch (err) {
        console.error("Error uploading to S3:", err);
        throw err;
    }
};

