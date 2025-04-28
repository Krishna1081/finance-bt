"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  _id: string;
  amount: string;
  date: string;
  description: string;
};

export default function Tables({
  items,
  fetchItems,
  setEditItem,
}: {
  items: Transaction[];
  fetchItems: () => Promise<void>;
  setEditItem: (item: Transaction) => void;
}) {
  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        console.log("Failed to delete");
      }
      await fetchItems();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Transaction Id</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item._id}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="flex gap-2">
                <button onClick={() => setEditItem(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={items.map((item) => ({
            ...item,
            amount: Number(item.amount), // Ensure amount is a number
          }))}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
