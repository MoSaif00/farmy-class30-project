import mongoose from 'mongoose';

// const reviewSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'User',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

const ingredientSchema = mongoose.Schema(
  {
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bundles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bundle',
      },
    ],
    // bundlesNames: [
    //   {
    //     name: { type: String, required: true },
    //     image: { type: String, required: true },
    //     bundle: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       required: true,
    //       ref: 'Bundle',
    //     },
    //   },
    // ],
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    // reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    // numReviews: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
