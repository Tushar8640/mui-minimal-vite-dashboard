import { Helmet } from "react-helmet-async";

// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
// components

import Iconify from "../components/iconify";

import { Link } from "react-router-dom";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

export default function AddProduct() {
  const [value, setValue] = useState(null);
  const [age, setAge] = useState("");
  return (
    <>
      <Helmet>
        <title> Add Todo | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Todos
          </Typography>
          <Link to={"/dashboard/addproduct"}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Todo
            </Button>
          </Link>
        </Stack>

        <Box
          spacing={2}
          width={"100%"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <Stack direction="row" spacing={2}>
            <Stack spacing={2} width={500}>
              <TextField fullWidth label="Product Name" id="fullWidth" />
              <TextField
                fullWidth
                label="Product Descriptions"
                id="fullWidth"
                multiline
                rows={4}
              />
            </Stack>
            <Stack width={500} spacing={2}>
              <TextField fullWidth id="fullWidth" type="file" />
              <TextField
                fullWidth
                id="fullWidth"
                label="Quantity"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
