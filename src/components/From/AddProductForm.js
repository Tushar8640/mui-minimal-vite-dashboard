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
  Grid,
} from "@mui/material";
// components
import { useTheme } from "@mui/material/styles";
import supabase from "../../supabase/index";
import { useEffect, useState } from "react";
import { UploadFileOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelecetdColors(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const [selectedImages, setSelectedImages] = useState([]);
  const handleSelectedFile = (event) => {
    const files = Array.from(event.target.files);

    // Filter out only image files
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setSelectedImages(imageFiles);
  };
  const handleRemoveImage = (index) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = async () => {
    for (const file of selectedImages) {
      const fileSizeInMB = file.size / (1024 * 1024);
      console.log(fileSizeInMB);
      const { data, error } = await supabase.storage
        .from("Image")
        .upload(`${file.name}`, file);

      if (error) {
        console.error("Error uploading file:", error);
      } else {
        console.log("File uploaded successfully:", data);
      }
    }
  };
  const [isDragging, setIsDragging] = useState(false);
  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = Array.from(event.dataTransfer.files);
    console.log(selectedFile);
    setSelectedImages(selectedFile);
    setIsDragging(false);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };
  const [category, setCategory] = useState("");
  console.log(isDragging);
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
      setIsLoading(true);
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

        const templateUrl =
          "https://gmbtnewweoaowruiondh.supabase.co/storage/v1/object/public/Image/";

        const resultArray =
          selectedImages.length !== 0 &&
          selectedImages?.map((file) => ({
            product_id: productID,
            image_url: `${templateUrl}${file.name}`,
          }));

        const { data: imagedata, error } = await supabase
          .from("product_images")
          .insert(resultArray)
          .select();

        if (colorError) {
          console.error(colorError.message);
          return;
        }
      }
      enqueueSnackbar("Product added successfully!", { variant: "success" });
      console.log(data, "Product and color associations added successfully.");
      setProductData({});
      setIsLoading(false);
      navigate("/dashboard/products");
    } else {
      enqueueSnackbar("Please fill all of the fields!", { variant: "error" });
    }
  };

  console.log(selectedImages);
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
              sx={{
                height: 195,
                backgroundColor: isDragging ? "rgba(0, 0, 0, 0.2)" : "initial",
                transition: "background-color 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
              className={`dropzone-button ${isDragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              Upload Image / Drop Image
              <input
                type="file"
                hidden
                multiple
                onChange={handleSelectedFile}
                accept="image/*"
              />
            </Button>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {selectedImages.map((image, index) => (
                <Grid item xs={2} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      margin: "5px",
                    }}
                    key={index}
                  >
                    <img
                      style={{ width: "100%", height: "100px" }}
                      src={URL.createObjectURL(image)}
                      alt={`Selected Image ${index}`}
                      onClick={() => handleRemoveImage(index)}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <LoadingButton
              size="large"
              onClick={() => handleImageUpload()}
              variant="contained"
              sx={{ mt: 2 }}
              color="secondary"
            >
              <span> Upload Image</span>
            </LoadingButton>
          </Stack>
        </Stack>

        <LoadingButton
          size="large"
          onClick={() => addProducts()}
          loading={isLoading}
          variant="contained"
          sx={{ mt: 2 }}
          color="secondary"
        >
          <span> Create Product</span>
        </LoadingButton>
      </Box>
    </>
  );
}
