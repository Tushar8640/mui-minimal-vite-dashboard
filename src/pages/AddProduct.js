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
  OutlinedInput,
  InputAdornment,
  Chip,
} from "@mui/material";
// components
import { useTheme } from "@mui/material/styles";
import Iconify from "../components/iconify";

import { Link } from "react-router-dom";

import { useState } from "react";
import { UploadFileOutlined } from "@mui/icons-material";
import supabase from "../supabase";

const names = ["Red", "Green", "Blue", "Pink", "Purple", "Black", "White"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddProduct() {
  const [personName, setPersonName] = useState([]);
  const theme = useTheme();

  const handleOnChange = (event) => {
    const { value, name } = event.target;
    console.log(value, name);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const handleSelectedFile = (event) => {
  //   const files = Array.from(event.target.files);
  //   console.log(files);
  //   const statusStep = 100 / files.length;

  //   for (let i = 0; i < files.length; i++) {
  //     setState(state + statusStep);
  //   }
  // };

  const [value, setValue] = useState(null);
  const [age, setAge] = useState("");

  const getProducts = async () => {
    let { data: products } = await supabase.from("products").select("*");
    console.log(products);
  };
  getProducts();
  const addProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: "Macbook Air",
          description: "Awesome product",
          quantity: 45,
          price: 180000,
          category_id: 1,
        },
      ])
      .select();
    console.log(data);
    if (error) {
      console.error(error.message);
      return;
    }

    const productID = data[0]?.product_id;

    if (productID) {
      const colorsToAssociate = [3, 4, 5]; // Array of color IDs

      const colorAssociations = colorsToAssociate.map((colorID) => ({
        product_id: productID,
        color_id: colorID,
      }));

      const { data, error: colorError } = await supabase
        .from("product_colors")
        .insert(colorAssociations)
        .select();
      console.log(data);
      if (colorError) {
        console.error(colorError.message);
        return;
      }
    }

    console.log(data, "Product and color associations added successfully.");
  };

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
              <TextField
                name="name"
                onChange={(e) => handleOnChange(e)}
                fullWidth
                label="Product Name"
                id="fullWidth"
              />
              <TextField
                name="description"
                fullWidth
                onChange={(e) => handleOnChange(e)}
                label="Product Descriptions"
                id="fullWidth"
                multiline
                rows={4}
              />
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  name="price"
                  onChange={(e) => handleOnChange(e)}
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  label="Price"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="demo-multiple-chip-label">Color</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, personName, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack width={500} spacing={2}>
              <TextField fullWidth id="fullWidth" type="file" />
              <TextField
                onChange={(e) => handleOnChange(e)}
                fullWidth
                id="fullWidth"
                label="Quantity"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl onChange={(e) => handleOnChange(e)} fullWidth>
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
              <Button
                variant="outlined"
                type="submit"
                size="large"
                color="secondary"
                component="label"
                fullWidth
                startIcon={<UploadFileOutlined />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  multiple
                  // onChange={handleSelectedFile}
                />
              </Button>
            </Stack>
          </Stack>
          <Button
            onClick={() => addProducts()}
            variant="contained"
            type="submit"
            size="large"
            color="secondary"
            component="label"
            sx={{ mt: 2 }}
          >
            Create Product
          </Button>
        </Box>
      </Container>
    </>
  );
}
