import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Recipe } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';

const font = {
  bold: { fontFamily: fontFamily.bold, fontWeight: undefined },
  medium: { fontFamily: fontFamily.medium, fontWeight: undefined },
  regular: { fontFamily: fontFamily.regular, fontWeight: undefined },
  manropeBold: { fontFamily: fontFamily.manropeBold, fontWeight: undefined },
  manropeExtraBold: { fontFamily: fontFamily.manropeExtraBold, fontWeight: undefined },
} as const;

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

type EditRecipeScreenProps = {
  mode?: 'edit' | 'create';
  onCancel: () => void;
  onSave: (recipe: Recipe) => Promise<void> | void;
  recipe: Recipe;
};

export function EditRecipeScreen({ mode = 'edit', onCancel, onSave, recipe }: EditRecipeScreenProps) {
  const [title, setTitle] = useState(recipe.jsonData.recipeName ?? recipe.recipeName);
  const [description, setDescription] = useState(recipe.jsonData.description ?? '');
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl);
  const [imageError, setImageError] = useState('');
  const [mealType, setMealType] = useState((recipe.jsonData.mealType ?? 'snack').toLowerCase());
  const [cookTime, setCookTime] = useState(String(recipe.jsonData.cookTime ?? ''));
  const [servings, setServings] = useState(String(recipe.jsonData.serveTo ?? 1));
  const [calories, setCalories] = useState(String(recipe.jsonData.calories ?? ''));
  const [proteins, setProteins] = useState(String(recipe.jsonData.proteins ?? ''));
  const [carbs, setCarbs] = useState(String(recipe.jsonData.carbs ?? ''));
  const [fats, setFats] = useState(String(recipe.jsonData.fats ?? ''));
  const [ingredients, setIngredients] = useState(
    recipe.jsonData.ingredients?.map((item) => `${item.ingredient}${item.quantity ? ` - ${item.quantity}` : ''}`).join('\n') ?? '',
  );
  const [steps, setSteps] = useState(recipe.jsonData.steps?.join('\n') ?? '');

  const pickImage = async () => {
    setImageError('');
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setImageError('Photo library permission is required to upload a recipe image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ['images'],
      quality: 0.86,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const save = () => {
    const cleanTitle = title.trim() || 'Untitled Recipe';
    const nextRecipe: Recipe = {
      ...recipe,
      imageUrl: imageUrl.trim(),
      jsonData: {
        ...recipe.jsonData,
        calories: toNumber(calories),
        carbs: toNumber(carbs),
        cookTime: toNumber(cookTime),
        description: description.trim(),
        fats: toNumber(fats),
        ingredients: parseIngredients(ingredients),
        mealType: mealType.trim().toLowerCase(),
        proteins: toNumber(proteins),
        recipeName: cleanTitle,
        serveTo: Math.max(toNumber(servings), 1),
        steps: steps.split('\n').map((step) => step.trim()).filter(Boolean),
      },
      recipeName: cleanTitle,
    };

    onSave(nextRecipe);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>RECIPE STUDIO</Text>
        <Text style={styles.title}>{mode === 'create' ? 'Create Recipe' : 'Edit Recipe'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'create'
            ? 'Create a new recipe with image, nutrition, ingredients, and cooking steps.'
            : 'Update the image, nutrition, ingredients, and cooking steps for this meal.'}
        </Text>
      </View>

      <View style={styles.photoCard}>
        <Image source={{ uri: imageUrl }} style={styles.photoPreview} />
        <View style={styles.photoOverlay}>
          <Text style={styles.photoTitle}>Recipe image</Text>
          <Text style={styles.photoSubtitle}>Use a square or landscape food photo for best results.</Text>
          <Pressable accessibilityRole="button" onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </Pressable>
        </View>
      </View>
      {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Details</Text>
        <LabeledInput label="Recipe Name" onChangeText={setTitle} placeholder="Pho Bo Beef Noodle Soup" value={title} />
        <LabeledInput label="Image URL or local image URI" onChangeText={setImageUrl} placeholder="https://..." value={imageUrl} />
        <LabeledInput
          label="Description"
          multiline
          onChangeText={setDescription}
          placeholder="Describe the recipe, flavor, and serving style."
          value={description}
        />
        <Text style={styles.fieldLabel}>Meal Type</Text>
        <View style={styles.segmented}>
          {mealTypes.map((item) => {
            const active = mealType === item;
            return (
              <Pressable key={item} onPress={() => setMealType(item)} style={[styles.segment, active && styles.segmentActive]}>
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{titleCase(item)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nutrition</Text>
        <View style={styles.grid}>
          <LabeledInput compact keyboardType="number-pad" label="Calories" onChangeText={setCalories} placeholder="520" value={calories} />
          <LabeledInput compact keyboardType="number-pad" label="Protein (g)" onChangeText={setProteins} placeholder="34" value={proteins} />
          <LabeledInput compact keyboardType="number-pad" label="Carbs (g)" onChangeText={setCarbs} placeholder="62" value={carbs} />
          <LabeledInput compact keyboardType="number-pad" label="Fats (g)" onChangeText={setFats} placeholder="14" value={fats} />
          <LabeledInput compact keyboardType="number-pad" label="Cook Time (min)" onChangeText={setCookTime} placeholder="45" value={cookTime} />
          <LabeledInput compact keyboardType="number-pad" label="Servings" onChangeText={setServings} placeholder="1" value={servings} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ingredients & Steps</Text>
        <LabeledInput
          label="Ingredients"
          multiline
          onChangeText={setIngredients}
          placeholder={'Rice noodles - 180g cooked\nLean beef slices - 120g'}
          value={ingredients}
        />
        <LabeledInput
          label="Cooking Steps"
          multiline
          onChangeText={setSteps}
          placeholder={'Heat broth with spices.\nAdd noodles and beef.\nGarnish with herbs.'}
          value={steps}
        />
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onCancel} style={[styles.actionButton, styles.cancelButton]}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={save} style={[styles.actionButton, styles.saveButton]}>
          <Text style={styles.saveText}>{mode === 'create' ? 'Create Recipe' : 'Save Changes'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function LabeledInput({
  keyboardType,
  label,
  multiline,
  onChangeText,
  placeholder,
  compact,
  value,
}: {
  keyboardType?: 'default' | 'number-pad';
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  compact?: boolean;
  value: string;
}) {
  return (
    <View style={[styles.field, compact && styles.compactField]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.textArea]}
        textAlignVertical={multiline ? 'top' : 'center'}
        underlineColorAndroid="transparent"
        value={value}
      />
    </View>
  );
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseIngredients(value: string) {
  return value
    .split('\n')
    .map((line) => {
      const [ingredient, ...quantityParts] = line.split('-');
      return {
        ingredient: ingredient.trim(),
        quantity: quantityParts.join('-').trim() || undefined,
      };
    })
    .filter((item) => item.ingredient);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    height: 58,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  cancelButton: {
    backgroundColor: colors.accentSoft,
  },
  cancelText: {
    color: colors.ink,
    ...font.bold,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E4E8F6',
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.lg,
    padding: 22,
  },
  compactField: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 128,
  },
  errorText: {
    color: '#B91C1C',
    ...font.medium,
    fontSize: 13,
    marginTop: -8,
  },
  eyebrow: {
    color: colors.primary,
    ...font.bold,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.inkMuted,
    ...font.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
    paddingTop: spacing.xl,
  },
  input: {
    backgroundColor: colors.accentSoft,
    borderColor: '#DCE4F5',
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    ...font.regular,
    fontSize: 15,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  photoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    height: 250,
    overflow: 'hidden',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 24, 33, 0.32)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  photoPreview: {
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  photoSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    ...font.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    maxWidth: 260,
  },
  photoTitle: {
    color: colors.surface,
    ...font.manropeBold,
    fontSize: 22,
  },
  saveButton: {
    backgroundColor: colors.primaryMid,
  },
  saveText: {
    color: colors.surface,
    ...font.bold,
    fontSize: 15,
  },
  screen: {
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.ink,
    ...font.manropeBold,
    fontSize: 19,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.inkMuted,
    ...font.medium,
    fontSize: 12,
  },
  segmentTextActive: {
    color: colors.primary,
    ...font.bold,
  },
  segmented: {
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 5,
  },
  subtitle: {
    color: colors.inkMuted,
    ...font.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  textArea: {
    minHeight: 118,
    textAlignVertical: 'top',
  },
  title: {
    color: colors.ink,
    ...font.manropeExtraBold,
    fontSize: 34,
    lineHeight: 40,
  },
  uploadButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#A7EBCF',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  uploadText: {
    color: colors.primary,
    ...font.bold,
    fontSize: 13,
  },
});
