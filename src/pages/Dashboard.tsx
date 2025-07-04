// src/pages/Dashboard.tsx
import { Typography, Paper, Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4">Vision Service SaaS Demo</Typography>
      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography>Welcome! Use the sidebar to navigate through features.</Typography>
        {/* Show counts, latest rollcall, usage stats here */}
      </Paper>
    </Box>
  );
}
