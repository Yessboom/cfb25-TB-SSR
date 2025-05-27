import { readFileSync } from 'fs';
import { join } from 'path';

interface PortraitMapping {
  [key: string]: {
    portraitId: number;
    recipe: string;
    complexionId: number;
    image: string;
    thumbnail: string;
  };
}

let portraitMapping: PortraitMapping | null = null;

export function loadPortraitMapping(): PortraitMapping {
  if (portraitMapping) {
    return portraitMapping;
  }
  
  try {
    const filePath = join(process.cwd(), 'public', 'mappings', 'portraitID_mapping.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    portraitMapping = JSON.parse(fileContent);
    return portraitMapping!;
      } catch (error) {
    console.error('Error loading portrait mapping:', error);
    return {};
  }
}

export function getPortraitImage(portraitId: number, useThumb = false): string | null {
  const mapping = loadPortraitMapping();
  const portrait = mapping[portraitId.toString()];
  
  if (!portrait) {
    return null;
  }
  
  return useThumb ? portrait.thumbnail : portrait.image;
}