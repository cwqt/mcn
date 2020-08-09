import { Mongoose, Model } from "mongoose";
import { speciesSchema, ISpeciesModel } from "./Hydroponics/Species.model";

export interface IMcnMongoSchema {
  Species: Model<ISpeciesModel>;
}

export const getMcnMongoSchema = (mongoose: Mongoose) => {
  return {
    Species: mongoose.model("Species", speciesSchema),
  } as IMcnMongoSchema;
};
