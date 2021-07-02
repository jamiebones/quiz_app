import fs from "fs";
import path from "path";

export default {
  Query: {
    getAssetsByType: async (_, { type }, { models }) => {
      const assets = await models.DigitalAsset.find({
        type: type,
      });
      return assets;
    },
  },
  Mutation: {
    saveAsset: async (
      _,
      { fileName, assetType, description, fileType },
      { models }
    ) => {
      const newDigitalAsset = new models.DigitalAsset({
        fileName,
        assetType,
        description,
        fileType,
      });
      await newDigitalAsset.save();
    },
    deleteAsset: async (_, { fileId, fileName }, { models }) => {
      const filePath = path.resolve("./uploads") + "/" + fileName;
      fs.unlinkSync(filePath);
      await models.DigitalAsset.deleteOne({ _id: fileId });
      return true;
    },
  },
};
