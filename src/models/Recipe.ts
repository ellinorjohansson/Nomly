import mongoose, { Schema, Model } from "mongoose";
import {
  DEFAULT_RECIPE_TYPE,
  RECIPE_TYPE_OPTIONS,
  type RecipeType,
} from "@/lib/recipeType";

export interface IRecipe {
  _id?: string;
  imageSrc: string;
  name: string;
  description: string;
  recipeType?: RecipeType;
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
  recipeType: {
    type: String,
    enum: RECIPE_TYPE_OPTIONS.map((option) => option.value),
    default: DEFAULT_RECIPE_TYPE,
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
