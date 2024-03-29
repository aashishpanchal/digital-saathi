import React from "react";
import { MainContainer } from "../../../../components/layout";
import { retailer } from "../../../../http";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import LinkRouter from "../../../../routers/LinkRouter";
import RetailerForm, {
  initialValues,
} from "../../../../components/admin/retailers/retailer-form";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { retailerSchema } from "../../../../components/admin/retailers/schemas";
import { filterPhoneNo, margeObj } from "../../../../components/admin/utils";
import CircularProgress from "@mui/material/CircularProgress";

export default function CreateRetailers() {
  const [data, setData] = React.useState(initialValues);

  const { retailer_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: data,
      validationSchema: retailerSchema,
      enableReinitialize: true,
      async onSubmit(values) {
        try {
          setLoading(true);
          const res = await retailer("put", {
            params: retailer_id,
            data: JSON.stringify({
              ...values,
              phone_no: filterPhoneNo(values.phone_no),
            }),
          });
          if (res?.status === 200) {
            navigate(-1);
            setTimeout(() => {
              enqueueSnackbar("Retailer Update successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error: any) {
          const {
            status,
            data: { message },
          } = error.response;
          if (status === 400) {
            enqueueSnackbar(message, { variant: "error" });
          } else {
            enqueueSnackbar("Retailer Update Failed!😢", { variant: "error" });
          }
          setLoading(false);
        }
      },
    });

  const onRetrieve = async () => {
    try {
      const res = await retailer("get", {
        params: retailer_id,
      });
      if (res?.status === 200) {
        const { data } = res;
        setData(
          margeObj(initialValues, {
            ...res.data,
            phone_no: filterPhoneNo(data?.phone_no, true),
          }) as typeof data
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    onRetrieve();
  }, []);

  return (
    <MainContainer>
      <Container>
        <Typography variant="h5">Edit Retailer</Typography>
        <Card className="lg:col-span-2">
          <CardContent sx={{ pt: 2 }}>
            <form onSubmit={handleSubmit}>
              <RetailerForm
                values={values}
                handleChange={handleChange}
                errors={errors}
                handleBlur={handleBlur}
                touched={touched}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexFlow: "row-reverse",
                }}
              >
                <Button
                  disabled={loading}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  startIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : undefined
                  }
                >
                  Save
                </Button>
                <LinkRouter to={-1}>
                  <Button color="secondary" variant="outlined">
                    Close
                  </Button>
                </LinkRouter>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MainContainer>
  );
}
