import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  nameEn: string;

  @Prop({ required: true })
  nameAr: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({
    type: [String],
    enum: ['Fried', 'Asian', 'Burgers', 'Italian', 'Mexican', 'Dessert'],
    validate: [
      (val: string[]) => val.length >= 1 && val.length <= 3,
      'Must have between 1 to 3 cuisines',
    ],
  })
  cuisines: string[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
  })
  locationType: string;

  @Prop({
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2dsphere',
  })
  coordinates: number[];
}

export type RestaurantDocument = Restaurant & Document;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
