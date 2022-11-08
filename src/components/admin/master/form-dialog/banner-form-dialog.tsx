import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { TextInput } from "../../../form";
import FileUploader from "../../../form/inputs/file-uploader";
import ImageView from "../../../Image/image-view";
import {
  shopBannerImgDownLoad,
  shopBannerUpload,
} from "../../../../http/server-api/server-apis";

export default function BannerFormDialog(props: {
  open: boolean;
  close: () => void;
  reload: Function;
  banner?: { [key: string]: any };
  variant: "edit" | "add";
}) {
  const { open, close, banner, reload, variant } = props;
  const [file, setFile] = React.useState<File | string | undefined>();
  const [data, setData] = React.useState({
    title: banner?.title || "",
  });
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const putRequest = async (bannerData: FormData) => {
    try {
      const res = await shopBannerUpload("put", bannerData, banner?.banner_id);
      if (res.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Banner update successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Banner update failed!😢", {
        variant: "error",
      });
    }
  };
  const postRequest = async (bannerData: FormData) => {
    try {
      const res = await shopBannerUpload("post", bannerData);
      if (res.status === 200) {
        close();
        setTimeout(
          () =>
            enqueueSnackbar("Banner add successfully!👍😊", {
              variant: "success",
            }),
          200
        );
        reload();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Banner add failed!😢", {
        variant: "error",
      });
    }
  };

  const onUpload = async () => {
    setLoading(true);
    if (file) {
      const bannerData = new FormData();
      bannerData.append("title", data.title);
      file !== banner?.image ? bannerData.append("image", file) : null;
      await (variant === "edit" ? putRequest : postRequest)(bannerData);
      setLoading(false);
    } else {
      enqueueSnackbar("banner Image Missing😢", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const imgDownload = async () => {
    try {
      const res = await shopBannerImgDownLoad(banner?.image);
      if (res.status === 200) {
        const img = URL.createObjectURL(res.data);
        setFile(img);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (variant === "edit") imgDownload();
  }, []);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Banner</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 1 }}>
          <TextInput
            type="text"
            label="Title of Image"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
          />
          <ImageView src={file ? file : ""} />
        </Box>
        <FileUploader handleChange={(file) => setFile(file)} />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexFlow: "row-reverse",
          }}
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onUpload}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : undefined
            }
          >
            {variant === "add" ? "Save" : "Update"}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            disabled={loading}
            onClick={close}
          >
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}