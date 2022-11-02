import React from "react";
import { MainContainer } from "../../../components/layout";
import exportFromJSON from "export-from-json";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { shopOrders } from "../../../http";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import CommonToolbar from "../../../components/admin/common-toolbar";
import DataSkuPricingList from "../../../components/admin/retailer-report/data-sku-pricing-list";

export default function DataSkuPricing() {
  const [searchText, setSearchText] = React.useState("");

  const searchHandler = async (value: string) => {
    setSearchText(value ? `/search?search_product=${value}` : "");
  };

  const dispatch = useDispatch();

  const exportHandler = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopOrders("get", {
        params: "csv",
        postfix: searchText,
      });
      if (res?.status === 200) {
        let csvData = res.data.orders;
        csvData = csvData.map((row: Record<string, any>, index: number) => ({
          ...row,
          s_no: index + 1,
        }));
        csvData = csvData.map((row: Record<string, any>) => ({
          ...row,
          order_status2:
            row.order_status === 0
              ? "New"
              : row.order_status === 1
              ? "Accepted"
              : row.order_status === 3
              ? "Picked-up "
              : row.order_status === 5
              ? "Delivered"
              : row.order_status === 7
              ? "Reject By Farmer"
              : row.order_status === 9
              ? "Rejected"
              : null,
        }));
        dispatch(setPageLoading(false));
        exportFromJSON({
          data: csvData,
          fileName: `data-sku-pricing-csv`,
          exportType: "csv",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainContainer>
      <CommonToolbar
        title="Data SKU Pricing"
        onSearch={searchHandler}
        onClickExport={exportHandler}
      />
      <Box sx={{ mt: 3 }}>
        <DataSkuPricingList searchText={searchText} />
      </Box>
    </MainContainer>
  );
}
