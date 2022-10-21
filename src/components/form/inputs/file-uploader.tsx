import { FileUploader as ReactFileUploader } from "react-drag-drop-files";
import { styled, Typography } from "@mui/material";
import upload from "../../../assets/upload.png";
import { useSnackbar } from "notistack";
import React from "react";

const ImageContainer = styled("div")`
  --tw-border-opacity: 1;
  align-items: center;
  border-color: #d1dbd9;
  border-radius: 0.5rem;
  border-style: dashed;
  border-width: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  position: relative;

  :hover {
    border-color: green;
  }

  img {
    margin-left: auto;
    margin-right: auto;
  }
`;

const LabelContainer = styled("div")`
  text-align: center;
`;

export default function FileUploader(props: {
  handleChange?: (file: File) => void;
}) {
  const { handleChange } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const sizeError = (file: any) =>
    enqueueSnackbar(file, {
      variant: "error",
    });

  const typeError = (err: any) => enqueueSnackbar(err, { variant: "error" });

  React.useEffect(() => () => closeSnackbar());

  return (
    <ReactFileUploader
      types={["JPEG", "PNG"]}
      onTypeError={typeError}
      onSizeError={sizeError}
      maxSize={1}
      multiple={false}
      handleChange={handleChange}
    >
      <ImageContainer sx={{ p: 1, minHeight: "fit-content" }}>
        <LabelContainer sx={{ my: 4 }}>
          <Typography>
            <img src={upload} alt="image-logo" />
            <Typography component={"span"} color="black">
              Drop your image here, or{" "}
            </Typography>
            <Typography component={"span"} color="blue">
              browse
            </Typography>
          </Typography>
          <Typography
            sx={{
              color: "neutral.400",
            }}
          >
            Support: jpeg, png
          </Typography>
        </LabelContainer>
      </ImageContainer>
    </ReactFileUploader>
  );
}