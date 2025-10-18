import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CuisineEnum } from './enums/cuisine.enum';

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
    enum: CuisineEnum,
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
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: '2dsphere' });

export type RestaurantDocument = Restaurant & Document;
export { RestaurantSchema };
