import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: function (v) {
          // Validate date format YYYY-MM-DD
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: "Date must be in YYYY-MM-DD format",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters"],
      maxlength: [200, "Description must be less than 200 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error in Next.js hot reload
export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
