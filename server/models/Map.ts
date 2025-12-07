import mongoose, { Schema, Document } from 'mongoose';

export interface IInjury {
  id: string;
  boneId: string;
  description: string;
  date: string;
}

export interface IMap extends Document {
  slug: string;
  editKey: string;
  name: string;
  injuries: IInjury[];
  createdAt: Date;
  updatedAt: Date;
}

const InjurySchema = new Schema<IInjury>({
  id: { type: String, required: true },
  boneId: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
});

const MapSchema = new Schema<IMap>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    editKey: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    injuries: { type: [InjurySchema], default: [] },
  },
  { timestamps: true }
);

export const MapModel = mongoose.model<IMap>('Map', MapSchema);

