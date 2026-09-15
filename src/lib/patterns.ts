export function patternLabelForIndex(index: number): string {
  return `Design ${index + 1}`;
}

export function patternLabelForImage(
  imageUrl: string,
  patternImages: string[],
): string {
  const index = patternImages.indexOf(imageUrl);
  return index >= 0 ? patternLabelForIndex(index) : "Selected design";
}
