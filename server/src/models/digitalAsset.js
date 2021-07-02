import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DigitalAssetSchema = new Schema({
  fileName: String,
  assetType: String,
  fileType: String,
  description: { type: String, required: false },
});

export default mongoose.model("digitalAsset", DigitalAssetSchema);
