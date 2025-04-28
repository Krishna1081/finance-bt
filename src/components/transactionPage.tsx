"use client";

import { useState, useEffect } from "react";
import Forms from "@/components/forms";
import Tables from "@/components/tables";

type Transaction = {
  _id: string;
  amount: string;
  date: string;
  description: string;
};

export default function TransactionPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [editItem, setEditItem] = useState<Transaction | null>(null);

  async function fetchItems() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setItems(data.data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Personal Finance Tracker
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-8">
        <Forms fetchItems={fetchItems} editItem={editItem} />
        <Tables
          items={items}
          fetchItems={fetchItems}
          setEditItem={setEditItem}
        />
      </div>
    </div>
  );
}
