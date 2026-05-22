import mongoose, { Model, Schema } from "mongoose";
import type { PersistedShoppingListState } from "@/lib/shoppingBagState";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  shoppingBagSelectedRecipeIds?: string[];
  shoppingBagPersistedState?: PersistedShoppingListState | null;
}

const ShoppingBagGroupSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    itemKeys: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const ShoppingBagStateSchema = new Schema(
  {
    groups: {
      type: [ShoppingBagGroupSchema],
      default: [],
    },
    checkedItemKeys: {
      type: [String],
      default: [],
    },
    deletedItemKeys: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    shoppingBagSelectedRecipeIds: {
      type: [String],
      default: [],
    },
    shoppingBagPersistedState: {
      type: ShoppingBagStateSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
