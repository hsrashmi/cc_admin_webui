import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d0ed57",
  "#a4de6c",
];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/ilp/v1/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Failed to fetch dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);
  if (loading || !summary) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <Container maxWidth="xl" className="py-6">
      {/* Top Stats */}
      <Grid container spacing={2}>
        {/* Active Users */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">{summary.active_users}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Schools */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Schools</Typography>
              <Typography variant="h4">
                {summary.school_counts.schools}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Region Distribution */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Region Distribution
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                gap={2}
                sx={{ height: "280px" }}
              >
                {/* Bar Chart */}
                <Box flex={2} minWidth={0} height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(summary.region_counts).map(
                        ([key, value]) => ({
                          region: key.charAt(0).toUpperCase() + key.slice(1),
                          count: value,
                        })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* Region Cards */}
                <Box
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  sx={{ height: "280px" }}
                >
                  {Object.entries(summary.region_counts).map(([key, value]) => (
                    <Card key={key}>
                      <CardContent className="text-center">
                        <Typography variant="subtitle2" className="uppercase">
                          {key}
                        </Typography>
                        <Typography variant="h6">{value}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution */}
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={summary.role_distribution}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ role }) => role}
                  >
                    {summary.role_distribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Regions and Schools */}
      <Grid container spacing={2} className="mt-4">
        {/* Recent Regions */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 350, overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recently Added Regions
              </Typography>
              {summary.recent_regions.map((region, idx) => (
                <Box key={idx} className="flex justify-between border-b py-2">
                  <Box>
                    <Typography variant="body1">{region.name}</Typography>
                    <Typography
                      variant="body2"
                      className="capitalize text-gray-500"
                    >
                      {region.type}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(region.created_at).format("DD MMM YYYY")}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Schools */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: 350, overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recently Added Schools
              </Typography>
              {summary.recent_schools.map((school, idx) => (
                <Box key={idx} className="flex justify-between border-b py-2">
                  <Box>
                    <Typography variant="body1">{school.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {school.city}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(school.created_at).format("DD MMM YYYY")}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
