import { Spinner } from "flowbite-react";
import React from "react";
import { FcDeleteDatabase } from "react-icons/fc";
import AdminContainer from "../../../../components/AdminContainer";
import MainContainer from "../../../../components/common/MainContainer";
import { DeleteModal } from "../../../../components/modals";
import { Table, TableActionsCell } from "../../../../components/table";
import {
  DateFormate,
  onFarmerRetrieve,
  onRetailerRetrieve,
} from "../../../../components/Utils";
import { shopOrders } from "../../../../http";

export default function Returned() {
  const [data, setData] = React.useState<Array<any>>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteModalShow, setDeleteModalShow] = React.useState(false);
  const [value, setValue] = React.useState<{
    order_id: string;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const onGet = async () => {
    setLoading(true);
    try {
      const res: any = await shopOrders("get");
      if (res.status === 200) {
        // filter new, new order status is zero
        const filterData = res.data.filter(
          (item: any) => item.order_status === 7
        );
        let realData = [];
        for (let i = 0; i < filterData.length; i++) {
          realData.push({
            farmerName: await onFarmerRetrieve(filterData[i].customer_id),
            retailerName: await onRetailerRetrieve(filterData[i].retailer_id),
            date: DateFormate(filterData[i].order_date),
            ...filterData[i],
          });
          setData(realData);
          if (i === 2) {
            setLoading(false);
          }
        }
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
          // remove item in shop_order
          const filterOrder = data.filter(
            (item: any) => item.order_id !== order_id
          );
          setData(filterOrder);
        }
      } catch (err: any) {
        console.log(err.response);
      }
      setDeleteLoading(false);
    }
  };

  const onView = (value: { [key: string]: any }) => {
    console.log(value);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        Cell: (row: any) => {
          return <div>{Number(row.row.id) + 1}</div>;
        },
        extraProps: {
          columnStyle: {
            width: "0px",
            textAlign: "center",
            paddingRight: "0px",
          },
        },
      },
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
        accessor: "date",
        id: "date",
        extraProps: {
          columnStyle: { textAlign: "center" },
        },
        // Cell: (cell: any) => <DateCell date={cell.value} />,
      },
      {
        Header: "Amount",
        accessor: "grand_total",
        Cell: (cell: any) => <div className="font-bold">Rs {cell.value}</div>,
      },
      {
        Header: "Farmer Name",
        accessor: "farmerName",
        // Cell: (cell: any) => <FarmerNameCell customer_id={cell.value} />,
      },
      {
        Header: "Retailer Name",
        accessor: "retailerName",
        // Cell: (cell: any) => <RetailerNameCell retailer_id={cell.value} />,
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
            onView={onView}
          />
        ),
      },
    ],
    []
  );
  const getData = React.useMemo(() => data, [data]);

  React.useEffect(() => {
    onGet();
  }, []);

  return (
    <AdminContainer>
      <MainContainer heading="Orders Returned">
        {loading ? (
          <div className="flex flex-col justify-center items-center space-y-3 mt-4">
            <Spinner
              color="blue"
              size="xl"
              className="object-cover w-24 h-24"
            />
            <h2 className="dark:text-gray-100">
              Please wait fetch data from server....
            </h2>
          </div>
        ) : data.length !== 0 ? (
          <Table columns={columns} data={getData} />
        ) : (
          <div className="flex flex-col space-y-4 justify-center items-center font-bold">
            <FcDeleteDatabase size={100} />
            <h2 className="text-lg">Sorry Data Not Available</h2>
          </div>
        )}
      </MainContainer>
      <DeleteModal
        show={deleteModalShow}
        onClose={() => setDeleteModalShow(false)}
        onClickNo={() => setDeleteModalShow(false)}
        onClickYes={onDelete}
      />
    </AdminContainer>
  );
}