import React from "react";
import Box from "@mui/material/Box";
import { MainContainer } from "../../../components/layout";
import CommonToolbar from "../../../components/admin/common-toolbar";
import AreaList from "../../../components/admin/master/area-list";
import useStateWithCallback from "../../../hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../redux/slices/admin-slice";
import { addSno } from "../../../components/admin/utils";
import { shopAreas } from "../../../http";
import { areasFields } from "../../../constants";
import { MdAcUnit } from "react-icons/md";

export default function Units() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const { state: csvData, updateState: setCsvData } = useStateWithCallback<
    Array<Record<string, any>>
  >([]);
  const ref = React.useRef<any>(null);
  const dispatch = useDispatch();

  const onAdd = () => setOpen(true);
  const onClose = () => setOpen(false);

  const searchHandler = async (value: string) => {
    setSearchText(value ? `/search?search_area=${value}` : "");
  };

  const exportHandle = async () => {
    try {
      dispatch(setPageLoading(true));
      const res = await shopAreas("get", {
        postfix: searchText,
      });
      if (res?.status === 200) {
        let csvData = res.data || [];
        // indexing
        csvData = addSno(csvData);

        setCsvData(csvData, () => {
          ref.current.link.click();
          dispatch(setPageLoading(false));
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(setPageLoading(false));
    }
  };

  return (
    <MainContainer>
      <CommonToolbar
        title="Areas"
        icon={<MdAcUnit/>}
        onAddProps={{ title: "Add Area", onClick: onAdd }}
        onSearch={searchHandler}
        exportProps={{
          ref,
          data: csvData,
          filename: `area-csv`,
          onClick: exportHandle,
          headers: areasFields,
        }}
      />
      <Box sx={{ mt: 3 }}>
        <AreaList searchText={searchText} addClose={onClose} addOpen={open} />
      </Box>
    </MainContainer>
  );
}
