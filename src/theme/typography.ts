export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
  manropeRegular: 'Manrope_400Regular',
  manropeBold: 'Manrope_700Bold',
  manropeExtraBold: 'Manrope_800ExtraBold',
} as const;

export const typography = {
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: 22,
    lineHeight: 28,
  },
  heading: {
    fontFamily: fontFamily.extraBold,
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  caption: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    lineHeight: 14,
  },
} as const;
