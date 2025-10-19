import { Types } from 'mongoose';

export const isValidMongodbId = (id: string) => {
  return Types.ObjectId.isValid(id);
};
