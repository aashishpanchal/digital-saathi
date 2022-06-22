import React from "react";
import { Spinner } from "flowbite-react";
import AdminContainer from "../../../../components/AdminContainer";
import MainContainer from "../../../../components/common/MainContainer";
import { shopUnits } from "../../../../http";
import { useNavigate } from "react-router-dom";
import { FcDeleteDatabase } from "react-icons/fc";
import { DeleteModal } from "../../../../components/modals";
import {
  ActiveDeactivateCell,
  Table,
  TableActionsCell,
} from "../../../../components/table";
import { SelectColumActiveDeactivateFilter } from "../../../../components/filter/SelectColumnFilter";
import Button from "../../../../components/button/Button";
import { BsShopWindow } from "react-icons/bs";

export default function Units() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteModalShow, setDeleteModalShow] = React.useState(false);
  const [value, setValue] = React.useState<{
    units_id: string;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }>();
  const navigate = useNavigate();

  const onShopUnitsGet = async () => {
    setLoading(true);
    try {
      const res: any = await shopUnits("get");
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      console.log(err);
    }
    setLoading(false);
  };

  const onShopUnitsDelete = async () => {
    if (value) {
      setDeleteModalShow(false);
      const { units_id, setDeleteLoading } = value;
      setValue(undefined);
      try {
        setDeleteLoading(true);
        const res: any = await shopUnits("delete", {
          params: units_id,
        });
        if (res.status === 200) {
          await onShopUnitsGet();
        }
      } catch (err: any) {
        console.log(err.response);
      }
      setDeleteLoading(false);
    }
  };

  const onActivate = async (
    value: { [key: string]: any },
    setActiveLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const { units_id, active } = value;

    const isActive = active === 1 ? 0 : 1;
    try {
      setActiveLoading(true);
      const res = await shopUnits("put", {
        params: units_id,
        data: JSON.stringify({
          units: value.units,
          active: isActive,
        }),
      });
      if (res?.status === 200) {
        await onShopUnitsGet();
      }
    } catch (err: any) {
      console.log(err.response);
    }
    setActiveLoading(false);
  };
  const onNew = () => navigate("/masters/units/new");
  const onShopUnitsEdit = (values: { [key: string]: any }) =>
    navigate(`/masters/units/${values.units_id}`);

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: "units_id",
        extraProps: {
          columnStyle: {
            width: "150px",
            textAlign: "center",
            paddingRight: "0px",
          },
        },
      },
      {
        Header: "Status",
        accessor: "active",
        Filter: SelectColumActiveDeactivateFilter,
        filter: "equals",
        Cell: (cell: any) => (
          <ActiveDeactivateCell cell={cell} onClick={onActivate} />
        ),
        extraProps: {
          columnStyle: {
            maxWidth: "250px",
            textAlign: "center",
            paddingRight: "0px",
          },
          align: "center",
        },
      },
      {
        Header: "Units Name",
        accessor: "units",
        extraProps: {
          align: "center",
        },
        Cell: (cell: any) => <span className="font-bold">{cell.value}</span>,
      },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <TableActionsCell
            cell={cell}
            onDelete={async (value, setDeleteLoading) => {
              setDeleteModalShow(true);
              setValue({
                units_id: value.units_id,
                setDeleteLoading,
              });
            }}
            onEdit={onShopUnitsEdit}
          />
        ),
      },
    ],
    []
  );

  const getData = React.useMemo(() => data, [data]);

  React.useEffect(() => {
    onShopUnitsGet();
  }, []);

  return (
    <AdminContainer>
      <MainContainer heading="Units">
        <div className="mb-4">
          <Button
            onClick={onNew}
            icon={<BsShopWindow size={18} />}
            color="dark"
          >
            New
          </Button>
        </div>
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
        onClickYes={onShopUnitsDelete}
      />
    </AdminContainer>
  );
}
