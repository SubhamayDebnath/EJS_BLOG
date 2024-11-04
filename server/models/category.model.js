import { Schema, model } from "mongoose";
const categorySchema = new Schema(
  {
    name: {
      type: "String",
      required: [true, "name is required"],
      minLength: [3, "Name must be greater than 3 character long"],
      maxLength: [26, "Name must be less than 26 character long"],
      lowercase: true,
      trim: true,
      unique: true
    },
  },
  {
    timestamps: true,
  }
);
const Category = model("Category", categorySchema);
export default Category;
