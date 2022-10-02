import { Spinner } from "flowbite-react";
import React from "react";
import { TbDatabaseOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import MainContainer from "../../../components/common/MainContainer";
import {
  DateColumnFilter,
  DateTimeFilterMethod,
} from "../../../components/filter/RangeColumnFilters";
import { DeleteModal } from "../../../components/modals";
import { Table, TableActionsCell } from "../../../components/table";
import { DateFormate } from "../../../components/Utils";
import { shopOrders } from "../../../http";

export default function MainOrders(props: {
  orderId: number;
  headerTitle: string;
  params?: string;
  postfix?: string;
  exportOff?: boolean;
}) {
  const [data, setData] = React.useState({
    totalItems: 0,
    totalPages: 1,
    orders: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [deleteModalShow, setDeleteModalShow] = React.useState(false);
  const [value, setValue] = React.useState<{
    order_id: string;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }>();
  const navigator = useNavigate();

  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(10);

  const onGet = async () => {
    setLoading(true);
    try {
      const res = await shopOrders("get", {
        params: props.params,
        postfix:
          `?page=${page}&size=${size}&order_status=${props.orderId}` +
          (props.postfix || ""),
      });
      if (res?.status === 200) {
        // formatting date time column
        const rowData = res.data;
        if (rowData.orders) {
          for (let i = 0; i < rowData.orders.length; i++) {
            rowData.orders[i].order_date = DateFormate(
              rowData.orders[i]?.order_date
            );
          }
        }
        setData(rowData);
      }
    } catch (err: any) {
      console.log(err.response);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    if (value) {
      setDeleteModalShow(false);
      const { order_id, setDeleteLoading } = value;
      setValue(undefined);
      try {
        setDeleteLoading(true);
        const res: any = await shopOrders("delete", {
          params: order_id,
        });
        if (res.status === 200) {
          await onGet();
        }
      } catch (err: any) {
        console.log(err.response);
      }
      setDeleteLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "order_id",
        extraProps: {
          columnStyle: {
            width: "0px",
            textAlign: "center",
            paddingRight: "0px",
          },
        },
      },
      {
        Header: "Order Date",
        accessor: "order_date",
        id: "order_date",
        extraProps: {
          columnStyle: { textAlign: "center" },
        },
        filter: DateTimeFilterMethod, // filter add datetime
        Filter: DateColumnFilter, // filter input add datetime
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        Cell: (cell: any) => <div className="font-bold">Rs {cell.value}</div>,
      },
      {
        Header: "Farmer Name",
        accessor: "customer_id",
      },
      {
        Header: "Retailer Name",
        accessor: "retailer_id",
      },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <TableActionsCell
            cell={cell}
            onDelete={async (value, setDeleteLoading) => {
              setDeleteModalShow(true);
              setValue({
                order_id: value.order_id,
                setDeleteLoading,
              });
            }}
            onView={(values) => {
              navigator(`/orders/order-details/${values.order_id}`);
            }}
            onPrint={(values) => {
              navigator(`/orders/order-invoice-print/${values.order_id}`);
            }}
          />
        ),
      },
    ],
    [page, size]
  );

  const getData = React.useMemo(() => data.orders, [data, page]);

  React.useEffect(() => {
    onGet();
  }, [page, size]);

  return (
    <MainContainer heading={props.headerTitle}>
      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-3 mt-4">
          <Spinner color="green" size="xl" className="object-cover w-24 h-24" />
          <h2 className="dark:text-gray-100">
            Please wait fetch data from server....
          </h2>
        </div>
      ) : data.totalItems ? (
        <Table
          columns={columns}
          data={getData}
          showPagination
          page={page}
          changePage={(page: number) => setPage(page)}
          totalEntries={data.totalItems}
          totalPages={data.totalPages - 1}
          entriesPerPage={size}
          changePageSize={(value) => setSize(value)}
          showExport={!props.exportOff}
          exportFileName={`shop-order-status-${props.orderId}`}
        />
      ) : (
        <div className="flex flex-col space-y-4 justify-center items-center font-bold">
          <TbDatabaseOff size={100} className="text-blue-light" />
          <h2 className="text-lg">Sorry Data Not Available</h2>
        </div>
      )}
      <DeleteModal
        show={deleteModalShow}
        onClose={() => setDeleteModalShow(false)}
        onClickNo={() => setDeleteModalShow(false)}
        onClickYes={onDelete}
      />
    </MainContainer>
  );
}