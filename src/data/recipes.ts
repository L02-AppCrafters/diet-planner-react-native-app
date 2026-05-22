const featuredImage = require('../../assets/mediterranean-salad.png');
const bowlImage = require('../../assets/vegan-buddha-bowl.png');
const salmonImage = require('../../assets/grass-fed-steak-with-garlic-asparagus.png');
const berryImage = require('../../assets/antioxidant-berry-and-whey-power-bowl.png');

export const recipeFilters = ['All Recipes', 'Keto', 'Vegan', 'High Protein'];

export const featuredRecipe = {
  tag: "EDITOR'S CHOICE",
  title: 'Zesty Atlantic Salmon & Quinoa Power Bowl',
  time: '25 mins',
  calories: '420 kcal',
  protein: '32g Protein',
  image: featuredImage,
};

export const recipeCards = [
  {
    id: 'vegan-bowl',
    tag: 'VEGAN',
    title: 'Spiced Chickpea & Avocado Buddha Bowl',
    time: '15m',
    calories: '320 kcal',
    protein: '14g',
    image: bowlImage,
  },
  {
    id: 'keto-steak',
    tag: 'KETO',
    title: 'Grass-Fed Steak with Garlic Asparagus',
    time: '20m',
    calories: '480 kcal',
    protein: '42g',
    image: salmonImage,
  },
  {
    id: 'high-protein-berry',
    tag: 'HIGH PROTEIN',
    title: 'Antioxidant Berry & Whey Power Bowl',
    time: '5m',
    calories: '310 kcal',
    protein: '28g',
    image: berryImage,
  },
];

export const aiDiscovery = {
  title: 'AI Discovery',
  message:
    'Based on your workout intensity yesterday, we recommend increasing your leucine intake. Try adding hemp seeds to these recipes.',
  goalLabel: 'Daily Goal Progress',
  goalPercent: 65,
};
