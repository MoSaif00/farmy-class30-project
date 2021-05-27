import dotenv from 'dotenv';
import colors from 'colors';
import mongoose from 'mongoose';
import { createRequire } from 'module'; // Bring in the ability to create the 'require' method
import connectDB from './config/db.js';

import Farm from './models/farmModel.js';
import User from './models/userModel.js';
import Bundle from './models/bundleModel.js';
import Ingredient from './models/ingredientModel.js';
import Subscription from './models/subscriptionModel.js';

import users from './data/users.js';
import bundles from './data/bundles.js';
import soupIngredients from './data/soupIngredients.js';
import fridayIngredients from './data/fridayIngredients.js';
import veggiesIngredients from './data/veggiesIngredients.js';
import berriesIngredients from './data/berriesIngredients.js';
import chefsTableIngredients from './data/chefsTableIngredients.js';
import vitaminBoostIngredients from './data/vitaminBoostIngredients.js';

const require = createRequire(import.meta.url); // construct the require method
const farms = require('./data/farms.json');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Farm.deleteMany();
    await User.deleteMany();
    await Bundle.deleteMany();
    await Ingredient.deleteMany();
    await Subscription.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleBundles = bundles.map((bundle) => ({
      ...bundle,
      createdByUser: adminUser,
    }));

    await Farm.insertMany(farms);

    const bundleIds = await Bundle.insertMany(sampleBundles);
    const vitaminBoostBundleId = bundleIds[0]._id;
    const chefsTableBundleId = bundleIds[1]._id;
    const fridayBundleId = bundleIds[2]._id;
    const berriesBundleId = bundleIds[3]._id;
    const veggiesBundleId = bundleIds[4]._id;
    const soupBundleId = bundleIds[5]._id;

    const linkBundleIngredients = async (
      ingredients,
      bundleId,
      ingredientModel,
      bundleModel,
      admin,
    ) => {
      const bundleOfIngredients = ingredients.map((ingredient) => ({
        ...ingredient,
        createdByUser: admin,
        bundles: bundleId,
      }));
      const ingredientsInsert = await ingredientModel.insertMany(bundleOfIngredients);
      await bundleModel.updateOne(
        { _id: bundleId },
        {
          $set: {
            ingredients: [...ingredientsInsert],
          },
        },
        { upsert: true },
      );
    };
    await linkBundleIngredients(
      vitaminBoostIngredients,
      vitaminBoostBundleId,
      Ingredient,
      Bundle,
      adminUser,
    );
    await linkBundleIngredients(
      chefsTableIngredients,
      chefsTableBundleId,
      Ingredient,
      Bundle,
      adminUser,
    );
    await linkBundleIngredients(fridayIngredients, fridayBundleId, Ingredient, Bundle, adminUser);
    await linkBundleIngredients(berriesIngredients, berriesBundleId, Ingredient, Bundle, adminUser);
    await linkBundleIngredients(veggiesIngredients, veggiesBundleId, Ingredient, Bundle, adminUser);
    await linkBundleIngredients(soupIngredients, soupBundleId, Ingredient, Bundle, adminUser);

    // Function To Update The Ingredients Bundles
    const updateIngredientsBundles = async (ingredientModel, ingredientName, ...bundlesIds) => {
      await ingredientModel.updateMany(
        { name: ingredientName },
        {
          $set: {
            bundles: [...bundlesIds],
          },
        },
        { upsert: true },
      );
    };

    await updateIngredientsBundles(
      Ingredient,
      'Carrots',
      chefsTableBundleId,
      soupBundleId,
      veggiesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(
      Ingredient,
      'Cucumbers',
      chefsTableBundleId,
      veggiesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(Ingredient, 'Kale', chefsTableBundleId, vitaminBoostBundleId);

    await updateIngredientsBundles(
      Ingredient,
      'Tomatoes',
      chefsTableBundleId,
      soupBundleId,
      veggiesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(
      Ingredient,
      'Red Onions',
      chefsTableBundleId,
      soupBundleId,
      veggiesBundleId,
    );

    await updateIngredientsBundles(Ingredient, 'Parsnip', chefsTableBundleId, soupBundleId);

    await updateIngredientsBundles(Ingredient, 'Parsley', chefsTableBundleId, soupBundleId);

    await updateIngredientsBundles(
      Ingredient,
      'Blueberries',
      berriesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(
      Ingredient,
      'Raspberries',
      berriesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(
      Ingredient,
      'Strawberries',
      berriesBundleId,
      vitaminBoostBundleId,
    );

    await updateIngredientsBundles(Ingredient, 'Grapes', berriesBundleId, fridayBundleId);

    await updateIngredientsBundles(Ingredient, 'Apples', vitaminBoostBundleId, fridayBundleId);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Farm.deleteMany();
    await User.deleteMany();
    await Bundle.deleteMany();
    await Ingredient.deleteMany();
    await Subscription.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

// // VITAMIN BOOST BUNDLE
// const vitaminBoostBundleIngredients = vitaminBoostIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: vitaminBoostBundleId,
// }));
// const vitaminBoostInsert = await Ingredient.insertMany(vitaminBoostBundleIngredients);

// await Bundle.updateOne(
//   { _id: vitaminBoostBundleId },
//   {
//     $set: {
//       ingredients: [...vitaminBoostInsert],
//     },
//   },
//   { upsert: true }
// );

// // CHEFS TABLE BUNDLE
// const chefsTableBundleIngredients = chefsTableIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: chefsTableBundleId,
// }));
// const chefsTableInsert = await Ingredient.insertMany(chefsTableBundleIngredients);
// await Bundle.updateOne(
//   { _id: chefsTableBundleId },
//   {
//     $set: {
//       ingredients: [...chefsTableInsert],
//     },
//   },
//   { upsert: true }
// );

// // ITS FRIDAY BUNDLE
// const fridayBundleIngredients = fridayIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: fridayBundleId,
// }));
// const fridayBundleInsert = await Ingredient.insertMany(fridayBundleIngredients);
// await Bundle.updateOne(
//   { _id: fridayBundleId },
//   {
//     $set: {
//       ingredients: [...fridayBundleInsert],
//     },
//   },
//   { upsert: true }
// );

// // BERRIES BUNDLE
// const berriesBundleIngredients = berriesIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: berriesBundleId,
// }));
// const berriesBundleInsert = await Ingredient.insertMany(berriesBundleIngredients);
// await Bundle.updateOne(
//   { _id: berriesBundleId },
//   {
//     $set: {
//       ingredients: [...berriesBundleInsert],
//     },
//   },
//   { upsert: true }
// );

// // VEGGIES BUNDLE
// const veggiesBundleIngredients = veggiesIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: veggiesBundleId,
// }));
// const veggiesBundleInsert = await Ingredient.insertMany(veggiesBundleIngredients);
// await Bundle.updateOne(
//   { _id: veggiesBundleId },
//   {
//     $set: {
//       ingredients: [...veggiesBundleInsert],
//     },
//   },
//   { upsert: true }
// );

// // SOUP BUNDLE
// const soupBundleIngredients = soupIngredients.map((ingredient) => ({
//   ...ingredient,
//   createdByUser: adminUser,
//   bundles: soupBundleId,
// }));
// const soupBundleInsert = await Ingredient.insertMany(soupBundleIngredients);
// await Bundle.updateOne(
//   { _id: soupBundleId },
//   {
//     $set: {
//       ingredients: [...soupBundleInsert],
//     },
//   },
//   { upsert: true }
// );
