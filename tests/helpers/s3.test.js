const path = require('path');
const { S3 } = require('aws-sdk');

const mockS3HelperInstance = { 
  uploadFile: jest.fn().mockReturnThis(),
  deleteFile: jest.fn().mockReturnThis(),
  getFileStream: jest.fn().mockReturnThis(),
 }

jest.mock('../../src/helpers/s3', () => mockS3HelperInstance);

const { uploadFile, getFileStream, deleteFile } = require("../../src/helpers/s3");

test("Should upload correctly", async () => {
  const image = path.resolve(__dirname, `../fixtures/image.jpg`);
  const filename = 'image'

  mockS3HelperInstance.uploadFile.mockResolvedValueOnce('fake response');
  const actual = await uploadFile(image, filename);
  
  expect(actual).toEqual('fake response');
  expect(mockS3HelperInstance.uploadFile).toHaveBeenCalledTimes(1)
});

test("Should delete object correctly", async () => {

  mockS3HelperInstance.deleteFile.mockResolvedValueOnce('fake response delete object');
  const actual = await deleteFile('image');

  expect(actual).toEqual('fake response delete object');
  expect(mockS3HelperInstance.deleteFile).toHaveBeenCalledTimes(1)
});

test("Should get object correctly", async () => {

  mockS3HelperInstance.getFileStream.mockResolvedValueOnce('fake response');
  const actual = await getFileStream('image');

  expect(actual).toEqual('fake response');
  expect(mockS3HelperInstance.getFileStream).toHaveBeenCalledTimes(1)
});