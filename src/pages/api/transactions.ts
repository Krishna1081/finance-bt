import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Transaction from "../../models/transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const items = await Transaction.find({});
        res.status(200).json({ success: true, data: items });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;

    case "POST":
      try {
        const item = await Transaction.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;

    case "PUT":
      try {
        const { id, ...updateData } = req.body;
        const updatedItem = await Transaction.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        );
        if (!updatedItem) {
          return res
            .status(404)
            .json({ success: false, error: "Transaction not found" });
        }
        res.status(200).json({ success: true, data: updatedItem });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        const deletedItem = await Transaction.findByIdAndDelete(id);
        if (!deletedItem) {
          return res
            .status(404)
            .json({ success: false, error: "Transaction not found" });
        }
        res.status(200).json({ success: true, data: deletedItem });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
