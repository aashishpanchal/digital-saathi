import React from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { queryToStr } from "../utils";
import { shopOrders } from "../../../http";
import DataTable from "../../table/data-table";
import LinkRouter from "../../../routers/LinkRouter";
import TablePagination from "../../table/table-pagination";
import usePaginate from "../../../hooks/usePaginate";
import SerialNumber from "../serial-number";
import { TextCenter } from "./styles";
import MoveOrdersDialog from "./move-orders/move-orders-dailog";
import ReturnMoveOrdersDialog from "./move-orders/return-move-orders-dailog";

export default function OrdersListResults(props: {
  postfix?: string;
  params?: string;
  orderStatus: string;
  searchText: string;
  otherQuery?: { [key: string]: any };
  moveVariant?: "return" | "normal";
  moveCellShow?: boolean;
}) {
  const { page, setPage, size, setSize } = usePaginate();
  const {
    searchText,
    orderStatus,
    params,
    otherQuery,
    postfix: otherPostfix,
    moveVariant,
    moveCellShow,
  } = props;
  const [moveOrder, setMoveOrder] = React.useState({
    open: false,
    values: {},
  });

  const postfix = React.useMemo(() => {
    const x = queryToStr({
      ...otherQuery,
      page,
      size,
      order_status: orderStatus,
    });
    return searchText ? `${searchText}&${x}` : `?${x}`;
  }, [searchText, page, size, orderStatus]);

  const { isLoading, data, refetch } = useQuery(
    [`order-${orderStatus}`, postfix],
    () =>
      shopOrders("get", {
        params,
        postfix: otherPostfix ? `${postfix}&${otherPostfix}` : postfix,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const onCloseMoveOrder = () => setMoveOrder({ open: false, values: {} });

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: (_row: any, i: number) => i + 1,
        Cell: (cell: any) => (
          <SerialNumber cell={cell} page={page} size={size} />
        ),
        width: "5%",
      },
      {
        Header: "Order ID",
        accessor: "main_order_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize="small">
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Suborder No",
        accessor: "suborder_no",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center" fontSize={"small"}>
            {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        width: "15%",
        Cell: (cell: any) => (
          <Typography textAlign={"center"}>
            {dayjs(cell.value).format("D-MMM-YYYY")}
          </Typography>
        ),
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        width: "8%",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} textAlign="center">
            ₹ {cell.value}
          </Typography>
        ),
      },
      {
        Header: "Farmer Name",
        accessor: "customer_name",
        Cell: (cell: any) => <TextCenter>{cell.value}</TextCenter>,
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_name",
        Cell: (cell: any) => (
          <Typography fontWeight={"600"} fontSize="small" textAlign="center">
            {cell.row.original.retailer_company_name} ( {cell.value} )
          </Typography>
        ),
      },
      {
        Header: "Action",
        width: "10%",
        Cell: (cell: any) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Move Orders">
              <IconButton
                disableRipple={false}
                size="small"
                color="secondary"
                onClick={() =>
                  setMoveOrder({ open: true, values: cell.row.original })
                }
              >
                <MdOutlineDriveFileMove />
              </IconButton>
            </Tooltip>
            <LinkRouter
              to={`/orders/order-details/${cell.row.original.order_id}?order_status=${orderStatus}`}
            >
              <Tooltip title="View Orders">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaEye />
                </IconButton>
              </Tooltip>
            </LinkRouter>
            <LinkRouter
              to={`/orders/order-invoice-print/${cell.row.original.order_id}`}
            >
              <Tooltip title="Order Invoice">
                <IconButton
                  disableRipple={false}
                  size="small"
                  color="secondary"
                >
                  <FaFileInvoice />
                </IconButton>
              </Tooltip>
            </LinkRouter>
          </Box>
        ),
      },
    ],
    [postfix]
  );

  const getData = React.useMemo(() => {
    if (data?.status === 200) {
      return data.data;
    }
    return {
      totalItems: 0,
      totalPages: 1,
      orders: [],
    };
  }, [data]);

  React.useEffect(() => {
    if (searchText) setPage(0);
  }, [searchText]);

  return (
    <>
      <DataTable
        loading={isLoading}
        columns={columns}
        data={getData.orders}
        showNotFound={getData.totalItems === 0}
        components={{
          pagination: (
            <TablePagination
              page={page}
              pageSize={size}
              totalItems={getData.totalItems}
              count={getData.totalPages}
              onChangePage={setPage}
              onPageSizeSelect={setSize}
            />
          ),
        }}
      />
      {moveOrder.open &&
        (moveVariant === "return" ? (
          <ReturnMoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ) : (
          <MoveOrdersDialog
            open={moveOrder.open}
            orderStatus={orderStatus}
            onClose={onCloseMoveOrder}
            orders={moveOrder.values}
            refetch={refetch}
          />
        ))}
    </>
  );
}
