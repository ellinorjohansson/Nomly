import mongoose, { Schema, Model } from "mongoose";

export interface IRecipe {
  _id?: string;
  imageSrc: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  tag: string[];
  cookingTime: string;
  ingredients: string;
  link: string;
  prepTime: string;
  instructions: string;
  servings?: string;
  sourceUrl?: string;
  sourceName?: string;
  authorId?: string;
  authorName?: string;
}

const RecipeSchema = new Schema<IRecipe>({
  imageSrc: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String],
    default: [],
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
  servings: {
    type: String,
  },
  sourceUrl: {
    type: String,
  },
  sourceName: {
    type: String,
  },
  authorId: {
    type: String,
  },
  authorName: {
    type: String,
  },
});

const RecipeModel: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);

export default RecipeModel;
