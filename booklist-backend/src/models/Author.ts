import { Author } from "../types"
import mongoose from 'mongoose'

const schema = new mongoose.Schema<Author>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

schema.set("toJSON", {
  transform: (_doc_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const model = mongoose.model<Author>('Author', schema)
export default model