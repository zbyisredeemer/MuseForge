export type PromptModel = "generic" | "midjourney" | "flux" | "stable-diffusion";

export interface AdaptedPrompt {
  model: PromptModel;
  prompt: string;
  negative_prompt: string;
  parameters: Record<string, string | number>;
  notes: string[];
}

export interface GalleryRecommended {
  aspect_ratio: string;
  framing: string;
  lighting: string;
}

export interface GalleryCategoryGroup {
  id: string;
  label: string;
  categories: string[];
}

export interface GalleryItem {
  id: string;
  index: number;
  title: string;
  category: string;
  group: string;
  tags: string[];
  adult_subject: boolean;
  has_visual: boolean;
  catalog_cell?: {
    row: number;
    column: number;
  };
  prompt: string;
  negative_prompt: string;
  recommended: GalleryRecommended;
}

export interface GalleryManifest {
  version: number;
  title: string;
  description: string;
  item_count: number;
  catalog: {
    image: string;
    rows: number;
    columns: number;
    item_count: number;
    note?: string;
  };
  category_tree: GalleryCategoryGroup[];
  safety: {
    adult_subjects_only: boolean;
    note: string;
  };
  items: GalleryItem[];
}
