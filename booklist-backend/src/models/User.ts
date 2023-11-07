import mongoose from 'mongoose'
import { User } from '../types';

const schema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true
  },
  /* passwordHash: {
    type: String,
    required: true
  } */
})

schema.set("toJSON", {
    transform: (_doc_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.passwordHash;
    }
  });
  
  const model = mongoose.model<User>("User", schema);
  
  export default model;