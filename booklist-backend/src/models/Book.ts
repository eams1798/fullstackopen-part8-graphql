import mongoose from 'mongoose'
import { Book } from '../types'

const schema = new mongoose.Schema<Book>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
})

schema.set("toJSON", {
  transform: (_doc_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const model = mongoose.model<Book>('Book', schema)
export default model;