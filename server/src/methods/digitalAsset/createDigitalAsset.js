import models from "../../models";

const createNewDigitalAsset = async ({
  fileName,
  assetType,
  description,
  fileType,
}) => {
  const newDigitalAsset = new models.DigitalAsset({
    fileName,
    assetType,
    description,
    fileType,
  });
  await newDigitalAsset.save();
  return true;
};

export default createNewDigitalAsset;
