import { Button, Container, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import AddProductForm from "../components/From/AddProductForm";
import { ArrowBack } from "@mui/icons-material";

export default function AddProduct() {
  const navigate = useNavigate();
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
              onClick={() => navigate(-1)}
              variant="contained"
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
          </Link>
        </Stack>

        <AddProductForm />
      </Container>
    </>
  );
}
