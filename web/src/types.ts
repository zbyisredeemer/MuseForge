export interface GalleryRecommended {
  aspect_ratio: string;
  framing: string;
  lighting: string;
}

export interface GalleryItem {
  id: string;
  index: number;
  title: string;
  category: string;
  tags: string[];
  adult_subject: boolean;
  catalog_cell: {
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
  catalog: {
    image: string;
    rows: number;
    columns: number;
    item_count: number;
  };
  safety: {
    adult_subjects_only: boolean;
    note: string;
  };
  items: GalleryItem[];
}
