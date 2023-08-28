import { useEffect, useState } from "react";
import supabase from "../supabase";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export default function FilesPage() {
  const [imageUrl, setImageUrl] = useState([]);
  const getImages = async () => {
    try {
      const { data, error } = await supabase.storage.from("Image").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.error("Error fetching images:", error);
        return;
      }

      const publicUrls = data.map((image) => {
        const publicURL = `https://gmbtnewweoaowruiondh.supabase.co/storage/v1/object/public/Image/${encodeURIComponent(
          image.name
        )}`;
        const imageName = image.name;
        return { imageName, publicURL };
      });

      setImageUrl(publicUrls);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getImages();
  }, []);
  const navigate = useNavigate();
  console.log(imageUrl);
  return (
    <>
      <Helmet>
        <title> Add Product | Minimal UI </title>
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <ImageList variant="masonry" cols={3} gap={8}>
            {imageUrl.map((item, i) => (
              <ImageListItem key={i}>
                <img
                  src={`${item.publicURL}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.publicURL}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.imageName}
                  loading="lazy"
                />
                <ImageListItemBar position="below" title={item.imageName} />
              </ImageListItem>
            ))}
          </ImageList>
        </Stack>
      </Container>
    </>
  );
}
