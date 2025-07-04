// src/pages/AdminPage.tsx
import { useState, useEffect } from "react";
import { Button, Typography, Box, TextField, Table, TableRow, TableCell, TableBody, TableHead, Checkbox, Paper } from "@mui/material";
import AdminKeyModal from "../components/AdminKeyModal";
import axios from "axios";

const BACKEND = "http://127.0.0.1:8001";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("admin-key") || "");
  const [openModal, setOpenModal] = useState(!adminKey);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New consumer state
  const [consumerName, setConsumerName] = useState("");
  const [apiList, setApiList] = useState<string[]>(["add-person", "recognize", "delete-person", "update-person", "check-spoofing-mn3"]); // Extend as needed
  const [selectedApis, setSelectedApis] = useState<string[]>([]);

  // Fetch consumers
  const fetchConsumers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/admin/consumers`, {
        headers: { "admin-key": adminKey }
      });
      setConsumers(res.data.consumers || []);
    } catch {
      alert("Invalid admin key or server error.");
      setOpenModal(true);
      setAdminKey("");
      localStorage.removeItem("admin-key");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (adminKey) fetchConsumers();
  }, [adminKey]);

  const handleAddConsumer = async () => {
    if (!consumerName || selectedApis.length === 0) return;
    try {
      await axios.post(`${BACKEND}/admin/consumer`, {
        name: consumerName,
        apis: selectedApis
      }, {
        headers: { "admin-key": adminKey }
      });
      setConsumerName("");
      setSelectedApis([]);
      fetchConsumers();
    } catch {
      alert("Failed to add consumer.");
    }
  };

  const handleToggleApi = (api: string) => {
    setSelectedApis(apis => apis.includes(api) ? apis.filter(a => a !== api) : [...apis, api]);
  };

  return (
    <Box p={4}>
      <AdminKeyModal open={openModal} onSet={k => {
        setAdminKey(k);
        localStorage.setItem("admin-key", k);
        setOpenModal(false);
      }} />
      <Typography variant="h4" mb={2}>Admin: Manage Consumers & Permissions</Typography>

      {/* Add new consumer */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>Add New Consumer</Typography>
        <TextField label="Consumer Name" value={consumerName} onChange={e => setConsumerName(e.target.value)} sx={{ mr: 2 }} />
        <Box mb={2} mt={2}>
          {apiList.map(api => (
            <Checkbox
              key={api}
              checked={selectedApis.includes(api)}
              onChange={() => handleToggleApi(api)}
              inputProps={{ "aria-label": api }}
              sx={{ mr: 1 }}
            /> 
          ))}
          {apiList.map(api => (
            <span style={{ marginRight: 16 }}>{api}</span>
          ))}
        </Box>
        <Button variant="contained" disabled={!consumerName || !selectedApis.length} onClick={handleAddConsumer}>
          Add Consumer
        </Button>
      </Paper>

      {/* Consumer List */}
      <Typography variant="h6" mb={2}>Consumers</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>API Key</TableCell>
            <TableCell>Allowed APIs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consumers.map((c: any) => (
            <TableRow key={c._id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.api_key}</TableCell>
              <TableCell>{c.apis.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
