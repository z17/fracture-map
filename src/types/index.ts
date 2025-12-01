export type BoneId = string;

export interface Bone {
  id: BoneId;
  name: string;
  pathData: string;
}

export interface Injury {
  id: string;
  boneId: BoneId;
  description: string;
  date: string; // ISO format "YYYY-MM"
}

export interface InjuryFormData {
  description: string;
  date: string; // ISO format "YYYY-MM"
}

