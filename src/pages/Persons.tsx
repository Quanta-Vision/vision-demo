// src/pages/Persons.tsx
import { useState, useEffect } from "react";
import api from "../api";
import {
  Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from "@mui/material";

function AddPersonDialog({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: () => void; }) {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!files) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("user_id", userId);
    Array.from(files).forEach(f => formData.append("images", f));
    setLoading(true);
    try {
      await api.post("/add-person", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onAdded();
      onClose();
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Error");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Person</DialogTitle>
      <DialogContent>
        <TextField label="Name" fullWidth sx={{ my: 1 }} value={name} onChange={e => setName(e.target.value)} />
        <TextField label="User ID" fullWidth sx={{ my: 1 }} value={userId} onChange={e => setUserId(e.target.value)} />
        <Button variant="outlined" component="label" sx={{ my: 1 }}>
          Upload Images (max 10)
          <input type="file" multiple hidden accept="image/*" onChange={e => setFiles(e.target.files)} />
        </Button>
        {files && <Typography>{files.length} files selected</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={loading}>{loading ? <CircularProgress size={20} /> : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Persons() {
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/persons");
      setPersons(res.data.users);
    } catch (e: any) {
      alert("Failed to fetch persons. Check your API key.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Persons</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setAddOpen(true)}>Add Person</Button>
      <AddPersonDialog open={addOpen} onClose={() => setAddOpen(false)} onAdded={load} />
      {loading ? <CircularProgress /> :
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Images</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {persons.map(p => (
              <TableRow key={p.personInfo.user_id}>
                <TableCell>{p.personInfo.user_id}</TableCell>
                <TableCell>{p.personInfo.name}</TableCell>
                <TableCell>
                  {p.images?.map((img: string, i: number) =>
                    <img key={i} src={`http://127.0.0.1:8001/${img}`} alt="" width={32} height={32} style={{ objectFit: "cover", marginRight: 4, borderRadius: 4 }} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    </Box>
  );
}
