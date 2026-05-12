import mongoose, { Schema, Model } from 'mongoose';

export interface IRecipe {
	_id?: string;
	name: string;
}

const RecipeSchema = new Schema<IRecipe>(
	{
		name: {
			type: String,
			required: true,
		}
	}
);

const Race: Model<IRecipe> = mongoose.models.Race || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Race;
