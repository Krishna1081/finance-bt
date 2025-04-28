"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

type Transaction = {
  _id: string;
  amount: string;
  date: string;
  description: string;
};

export default function Forms({
  fetchItems,
  editItem,
}: {
  fetchItems: () => Promise<void>;
  editItem?: Transaction | null;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (editItem) {
      setAmount(editItem.amount);
      setDate(editItem.date);
      setDescription(editItem.description);
      setEditId(editItem._id);
      setEditMode(true);
    }
  }, [editItem]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Basic validation
    if (!amount.trim()) {
      toast.error("Amount is required");
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }
    if (!date.trim()) {
      toast.error("Date is required");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      toast.error("Date must be in YYYY-MM-DD format");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (description.length < 3 || description.length > 200) {
      toast.error("Description must be between 3 and 200 characters");
      return;
    }

    const data = { amount, date, description };

    try {
      const res = await fetch("/api/transactions", {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMode ? { id: editId, ...data } : data),
      });

      if (!res.ok) throw new Error("Failed to submit form");

      await fetchItems();
      toast.success(editMode ? "Transaction Updated!" : "Transaction Added!", {
        duration: 2000,
      });

      // Reset form
      setAmount("");
      setDate("");
      setDescription("");
      setEditMode(false);
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form", { duration: 5000 });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Amount</label>
          <input
            type="text"
            placeholder="1302"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300"
        >
          {editMode ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
}
