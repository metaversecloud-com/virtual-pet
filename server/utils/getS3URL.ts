export const getS3URL = () => {
  return `https://${process.env.S3_BUCKET || "sdk-virtual-pet"}.s3.amazonaws.com`;
};
