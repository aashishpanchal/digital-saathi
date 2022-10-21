import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FaFileCsv } from "react-icons/fa";
import RowSearch from "../../table/row-search";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export type DatesType = {
  from: Dayjs | null;
  to: Dayjs | null;
};

export default function OrdersToolbar(props: {
  onClickExport?: () => void;
  onSearch: (value: string, dates: DatesType) => void;
  children?: string;
}) {
  const { onClickExport, onSearch, children } = props;

  const [searchText, setSearchText] = React.useState("");

  const [dates, setDates] = React.useState<DatesType>({
    from: null,
    to: null,
  });

  const endMinDate = React.useMemo(
    () => (dates.from === null ? undefined : dates.from),
    [dates.from]
  );

  const handleChangeDate = (key: string) => (newValue: Dayjs | null) =>
    setDates({ ...dates, [key]: newValue });

  const onReset = () => {
    setSearchText("");
    onSearch("", { from: null, to: null });
    setDates({ from: null, to: null });
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h5">
          {children}
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            color="secondary"
            startIcon={<FaFileCsv fontSize="small" />}
            sx={{
              mr: 1,
            }}
            onClick={onClickExport}
          >
            Export
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item>
                <RowSearch
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search Orders"
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label="Start Date"
                  inputFormat="DD/MM/YYYY"
                  value={dates.from}
                  onChange={handleChangeDate("from")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      sx={{
                        "& .MuiInputBase-input:focus": {
                          boxShadow: "none",
                        },
                      }}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label="End Date"
                  inputFormat="DD/MM/YYYY"
                  minDate={endMinDate}
                  value={dates.to}
                  onChange={handleChangeDate("to")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      sx={{
                        "& .MuiInputBase-input:focus": {
                          boxShadow: "none",
                        },
                      }}
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                marginTop: 0.5,
                justifyContent: "flex-end",
              }}
            >
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={() => onSearch(searchText, dates)}
              >
                Search
              </Button>
              <Button
                sx={{
                  borderColor: "neutral.200",
                  color: "neutral.600",
                  "&:hover": {
                    borderColor: "neutral.300",
                    color: "neutral.800",
                  },
                }}
                variant="outlined"
                size="small"
                onClick={onReset}
              >
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}