import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/PersonAdd";

export default function Persons() {
  const [persons, setPersons] = useState<any[]>([]);
  const apiKey = localStorage.getItem("x-api-key");
  const [addOpen, setAddOpen] = useState(false);

  // Add person form state
  const [addName, setAddName] = useState("");
  const [addUserId, setAddUserId] = useState("");
  const [addImages, setAddImages] = useState<File[]>([]);
  const [adding, setAdding] = useState(false);

  // Fetch persons
  const fetchPersons = () => {
    fetch("http://127.0.0.1:8001/v2/persons", {
      headers: { "x-api-key": apiKey || "" },
    })
      .then((res) => res.json())
      .then((data) => setPersons(data.users || []));
  };

  useEffect(() => {
    fetchPersons();
    // eslint-disable-next-line
  }, [apiKey]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure to delete this person?")) return;
    const formData = new FormData();
    formData.append("user_id", userId);

    const res = await fetch("http://127.0.0.1:8001/v2/delete-person", {
      method: "DELETE",
      headers: { "x-api-key": apiKey || "" },
      body: formData,
    });
    if (res.ok) {
      setPersons((prev) => prev.filter((p) => p.personInfo.user_id !== userId));
    } else {
      alert("Failed to delete");
    }
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addUserId || addImages.length === 0) {
      alert("Please fill all fields and select images.");
      return;
    }
    setAdding(true);
    const formData = new FormData();
    formData.append("name", addName);
    formData.append("user_id", addUserId);
    addImages.forEach((img) => formData.append("images", img));
    const res = await fetch("http://127.0.0.1:8001/v2/add-person", {
      method: "POST",
      headers: { "x-api-key": apiKey || "" },
      body: formData,
    });
    setAdding(false);
    if (res.ok) {
      setAddOpen(false);
      setAddName("");
      setAddUserId("");
      setAddImages([]);
      fetchPersons();
    } else {
      alert("Failed to add person");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Persons
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        startIcon={<AddIcon />}
        onClick={() => setAddOpen(true)}
      >
        Add Person
      </Button>

      {/* Add Person Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <form onSubmit={handleAddPerson}>
          <DialogTitle>Add Person</DialogTitle>
          <DialogContent sx={{ minWidth: 350 }}>
            <TextField
              label="Name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="User ID"
              value={addUserId}
              onChange={(e) => setAddUserId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Images</InputLabel>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ marginTop: 8 }}
                onChange={(e) => setAddImages(Array.from(e.target.files || []))}
              />
            </FormControl>
            {addImages.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {addImages.map((img, idx) => (
                  <Avatar
                    key={idx}
                    src={URL.createObjectURL(img)}
                    sx={{ width: 32, height: 32 }}
                    variant="rounded"
                  />
                ))}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={adding}>
              {adding ? "Adding..." : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Images</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {persons.map((person) => (
            <TableRow key={person.personInfo.user_id}>
              <TableCell>{person.personInfo.user_id}</TableCell>
              <TableCell>{person.personInfo.name}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {person.images?.slice(0, 3).map((img: string, idx: number) => (
                    <Avatar
                      key={idx}
                      src={`http://127.0.0.1:8001/${img}`}
                      sx={{ width: 32, height: 32 }}
                      variant="rounded"
                    />
                  ))}
                  {person.images?.length > 3 && (
                    <span>+{person.images.length - 3}</span>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={() => handleDelete(person.personInfo.user_id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
