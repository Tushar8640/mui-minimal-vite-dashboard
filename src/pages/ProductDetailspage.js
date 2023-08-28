/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";

import supabase from "../supabase";
import Iconify from "../components/iconify/Iconify";
import { Link, useParams } from "react-router-dom";

export default function UserPage() {
  const [product, setProduct] = useState({});
  const params = useParams();

  const getProduct = async () => {
    let { data: product } = await supabase
      .from("products")
      .select(
        `
    product_id, name, description, price, category, quantity,
    category(category_name),
    product_colors(color_id(color_name)),
    product_images(image_url)
  `
      )
      .eq("product_id", params.id);

    setProduct(product[0]);
  };
  // https://gmbtnewweoaowruiondh.supabase.co/storage/v1/object/public/product-5.jpg
  // https://gmbtnewweoaowruiondh.supabase.co/storage/v1/object/public/Image/slide-4.jpg
  useEffect(() => {
    getProduct();
  }, [params]);
  console.log(product);
  return (
    <>
      <Helmet>
        <title> Product| Minimal UI </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {product?.name}
          </Typography>
          <Link to={"/dashboard/addproduct"}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Product
            </Button>
          </Link>
        </Stack>
        <Container maxWidth="lg" sx={{ padding: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack display={"flex"} spacing={2}>
                {product?.product_images?.map((item, i) => (
                  <img key={i} src={item?.image_url} alt="image" />
                ))}

                {product?.product_images?.length == 0 && (
                  <Typography variant="h4" gutterBottom>
                    Image Not Available
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {product.description}
              </Typography>
              <Typography variant="h5" gutterBottom>
                ${product?.price}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Category: {product?.category?.category_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Available Quantity: {product.quantity}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Product Colors:
              </Typography>
              <Box sx={{ display: "flex" }}>
                {product?.product_colors?.map((color, index) => (
                  <Paper
                    key={index}
                    sx={{
                      backgroundColor: color.color_id.color_name,
                      width: 30,
                      height: 30,
                      marginRight: 1,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </>
  );
}
