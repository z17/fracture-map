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
  month: number;
  year: number;
}

export interface InjuryFormData {
  description: string;
  month: number;
  year: number;
}

