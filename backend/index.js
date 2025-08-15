import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

//GET all complaints
app.get("/api/complaints", async (req, res) => {
  try {
    const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

//POST a new complaint
app.post("/api/complaints", async (req, res) => {
  try {
    const { name, email, complaint } = req.body;
    if (!name || !email || !complaint) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("complaints")
      .insert([{ name, email, complaint }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Complaint submitted", complaint: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

//PATCH to toggle status
app.patch("/api/complaints/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const { data, error } = await supabase
      .from("complaints")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Status updated", complaint: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

//DELETE a complaint
app.delete("/api/complaints/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("complaints")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Complaint deleted", complaint: data[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete complaint" });
  }
});

//Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
