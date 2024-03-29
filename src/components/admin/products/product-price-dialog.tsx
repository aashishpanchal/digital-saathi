import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import ProductPriceForm, { initialValues } from "./product-price-form";
import { productPriceSchema } from "./schemas";
import { shopProductWeightPrice } from "../../../http";
import { useSnackbar } from "notistack";
import { removePostFix } from "../utils";

export default function ProductPriceDialog(props: {
  open: boolean;
  close: () => void;
  id: string;
}) {
  const { open, close, id } = props;
  const [data, setData] = React.useState(initialValues);
  const [priceId, setPriceId] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: productPriceSchema,

    async onSubmit(values) {

      //please update this in product validation schema and romove this line
      if (parseInt(values.price) > parseInt(values.mrp)) {
        return setTimeout(() => {
          enqueueSnackbar("Product Price is greater than MRP", {
            variant: "error",
          });
        }, 200);
      }

      let { weight, unit, gst, ...others }: any = values;
      gst = gst ? parseFloat(gst) : 0;
      const [igst, cgst, sgst] = [`${gst}%`, `${gst / 2}%`, `${gst / 2}%`];



      if (priceId) {
        try {
          const res = await shopProductWeightPrice("put", {
            params: priceId,
            data: JSON.stringify({
              ...others,
              igst,
              cgst,
              sgst,
              weight: `${weight}${unit}`,
            }),
          });
          if (res?.status === 200) {
            close();
            setTimeout(() => {
              enqueueSnackbar("Product Price Update  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error: any) {
          const {
            status,
            data: { message },
          } = error?.response;
          if (status === 400) {
            enqueueSnackbar(message, { variant: "error" });
          } else {
            enqueueSnackbar("Product Price Save Failed!😢", {
              variant: "error",
            });
          }
        }
      } else {
        try {
          const res = await shopProductWeightPrice("post", {
            data: JSON.stringify({
              sku_id: id,
              ...others,
              igst,
              cgst,
              sgst,
              weight: `${weight}${unit}`,
            }),
          });
          if (res?.status === 200) {
            close();
            setTimeout(() => {
              enqueueSnackbar("Product Price Save  successfully!👍😊", {
                variant: "success",
              });
            }, 200);
          }
        } catch (error: any) {
          const {
            status,
            data: { message },
          } = error?.response;
          if (status === 400) {
            enqueueSnackbar(message, { variant: "error" });
          } else {
            enqueueSnackbar("Product Price Save Failed!😢", {
              variant: "error",
            });
          }
        }
      }
    },
  });

  const onRetrieve = async () => {
    try {
      const res = await shopProductWeightPrice("get", {
        postfix: `?page=0&sku_id=${id}`,
      });
      if (res?.status === 200) {
        const {
          data: { product_prices, totalItems },
        } = res;
        if (totalItems !== 0) {
          const [weight, unit] = removePostFix(product_prices[0].weight || "");
          setData({
            ...product_prices[0],
            gst: product_prices[0]?.igst,
            weight,
            unit,
          });
          setPriceId(product_prices[0].price_id.toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    onRetrieve();
  }, []);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Product Price</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <ProductPriceForm
            values={values}
            handleChange={handleChange}
            errors={errors}
            handleBlur={handleBlur}
            touched={touched}
            setFieldValue={setFieldValue}
          />
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexFlow: "row-reverse",
            }}
          >
            <Button type="submit" color="secondary" variant="contained">
              Save
            </Button>
            <Button color="secondary" variant="outlined" onClick={close}>
              Close
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
