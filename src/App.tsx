import AppRouter from "./routers/AppRouter";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";
import LoadingDialogBox from "./components/dialog-box/loading-dialog-box";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { UpdateToken } from "./redux/slices/acessTokenSlice"

export default function App() {
  const dispatch = useDispatch()
  let [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  token && dispatch(UpdateToken(token))
  const {
    adminSlice: { pageLoading },
  } = useSelector((state: RootState) => state);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <div>
          <SnackbarProvider
            maxSnack={2}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <AppRouter />
          </SnackbarProvider>
          <LoadingDialogBox open={pageLoading} />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
