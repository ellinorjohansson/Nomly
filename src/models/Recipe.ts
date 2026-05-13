import mongoose, { Schema, Model } from "mongoose";

export interface IRecipe {
  _id?: string;
  name: string;
  description: string;
  tag: string;
  cookingTime: string;
  ingredients: string;
  link: string;
  prepTime: string;
  instructions: string;
}

const RecipeSchema = new Schema<IRecipe>({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
  },
  cookingTime: {
    type: String,
  },
  ingredients: {
    type: String,
  },
  link: {
    type: String,
  },
  prepTime: {
    type: String,
  },
  instructions: {
    type: String,
  },
});

const Race: Model<IRecipe> =
  mongoose.models.Race || mongoose.model<IRecipe>("Recipe", RecipeSchema);

export default Race;
