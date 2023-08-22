import { Button, Container, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Iconify from "../components/iconify";
import AddProductForm from "../components/From/AddProductForm";

export default function AddProduct() {
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

        <AddProductForm />
      </Container>
    </>
  );
}
