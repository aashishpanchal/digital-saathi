import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import usePrintData from "../../../../../hooks/usePrintData";
import ShopAvatar from "../../../../Image/shop-avatar";
import { LabelText } from "../styled";

const labels = [
  { title: "SKU Name", accessor: "sku_name" },
  { title: "Dimension", accessor: "dimension" },
  { title: "Qty", accessor: "quantity" },
  { title: "Weight", accessor: "weight" },
  { title: "Unit Price Sub Total", accessor: "total_price" },
];

function OrderDetailsCard(props: { orderDetail: { [key: string]: any } }) {
  const { orderDetail } = props;

  const { printData: obj } = usePrintData({
    labels: labels,
    data: orderDetail,
  });

  return (
    <Card
      sx={{
        display: "flex",
        maxWidth: 600,
      }}
      elevation={5}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Grid container>
            {obj.map((item, index) => (
              <Grid key={index} item lg={12}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LabelText fontSize={"small"}>{item.get("title")}:</LabelText>
                  <Typography fontSize={"small"}>{item.get("Cell")}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Box>
      <ShopAvatar
        src={orderDetail?.sku_image}
        sx={{ height: 180, width: 150 }}
        variant="square"
        download
        {...props}
      />
    </Card>
  );
}

export default React.memo(OrderDetailsCard);
