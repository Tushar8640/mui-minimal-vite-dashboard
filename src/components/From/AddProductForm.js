// @mui
import {
  Stack,
  Button,
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
import supabase from "../../supabase/index";
import { useEffect, useState } from "react";
import { UploadFileOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

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

export default function AddProductForm() {
  const [selecetdColors, setSelecetdColors] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [colors, setColors] = useState([]);
  const [productData, setProductData] = useState({});
  const theme = useTheme();
const navigate = useNavigate();
  const handleOnChange = (event) => {
    const { value, name } = event.target;
    const newData = { ...productData, [name]: value };
    setProductData(newData);
  };

  console.log(productData);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelecetdColors(
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

  const [category, setCategory] = useState("");

  const getCategories = async () => {
    let { data: categories } = await supabase.from("categories").select("*");
    setCategoryData(categories);
  };

  const getColors = async () => {
    let { data: colors } = await supabase.from("colors").select("*");
    setColors(colors);
  };

  useEffect(() => {
    getCategories();
    getColors();
  }, []);

  const filteredColorsId = colors
    .filter((data) => selecetdColors.includes(data.color_name))
    .map((filteredData) => filteredData.color_id);

  const addProducts = async () => {
    if (
      productData?.name &&
      productData?.description &&
      productData?.quantity !== undefined &&
      productData?.price !== undefined &&
      category
    ) {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: productData?.name,
            description: productData?.description,
            quantity: productData?.quantity,
            price: productData?.price,
            category: category,
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
        const colorsToAssociate = filteredColorsId; // Array of color IDs

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
      enqueueSnackbar("Product added successfully!", { variant: "success" });
      console.log(data, "Product and color associations added successfully.");
      setProductData({})
      navigate("/dashboard/products")
    } else {
      enqueueSnackbar("Please fill all of the fields!", { variant: "error" });
    }
  };

  return (
    <>
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
              required
            />
            <TextField
              required
              name="description"
              fullWidth
              onChange={(e) => handleOnChange(e)}
              label="Product Descriptions"
              id="fullWidth"
              multiline
              rows={4}
            />
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                required
                name="price"
                type="number"
                label="Price"
                onChange={(e) => handleOnChange(e)}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel id="demo-multiple-chip-label">Color</InputLabel>
              <Select
                required
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selecetdColors}
                onChange={handleChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Color" />
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
                {colors?.map((data) => (
                  <MenuItem
                    key={data?.color_id}
                    value={data?.color_name}
                    style={getStyles(data?.color_name, selecetdColors, theme)}
                  >
                    {data?.color_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack width={500} spacing={2}>
            {/* <TextField fullWidth id="fullWidth" type="file" /> */}
            <TextField
              required
              onChange={(e) => handleOnChange(e)}
              fullWidth
              id="fullWidth"
              label="Quantity"
              name="quantity"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl onChange={(e) => handleOnChange(e)} fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                {categoryData &&
                  categoryData?.map((data) => {
                    return (
                      <MenuItem
                        key={data?.category_id}
                        value={data?.category_id}
                        style={getStyles(
                          data?.category_name,
                          selecetdColors,
                          theme
                        )}
                      >
                        {data?.category_name}
                      </MenuItem>
                    );
                  })}
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
              sx={{ height: 195 }}
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
    </>
  );
}
