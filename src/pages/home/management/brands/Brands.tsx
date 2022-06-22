import React from "react";
import { Spinner } from "flowbite-react";
import AdminContainer from "../../../../components/AdminContainer";
import MainContainer from "../../../../components/common/MainContainer";
import { brands } from "../../../../http";
import { useNavigate } from "react-router-dom";
import Image from "../../../../components/Image/Index";
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

export default function Brands() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteModalShow, setDeleteModalShow] = React.useState(false);
  const [value, setValue] = React.useState<{
    brand_id: string;
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const navigate = useNavigate();

  const onBrandsGet = async () => {
    setLoading(true);
    try {
      const res: any = await brands("get");
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      console.log(err);
    }
    setLoading(false);
  };

  const onBrandDelete = async () => {
    if (value) {
      setDeleteModalShow(false);
      const { brand_id, setDeleteLoading } = value;
      setValue(undefined);
      try {
        setDeleteLoading(true);
        const res: any = await brands("delete", {
          params: brand_id,
        });
        if (res.status === 200) {
          await onBrandsGet();
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
    const { brand_id, active } = value;
    const isActive = active === 1 ? 0 : 1;
    try {
      setActiveLoading(true);
      const res = await brands("put", {
        params: brand_id,
        data: JSON.stringify({
          active: isActive,
        }),
      });
      if (res?.status === 200) {
        await onBrandsGet();
      }
    } catch (err: any) {
      console.log(err.response);
    }
    setActiveLoading(false);
  };

  const onNew = () => navigate("/management/brands/new");
  const onBrandEdit = (value: { [key: string]: any }) =>
    navigate(`/management/brands/${value.brand_id}`);

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: "brand_id",
        extraProps: {
          columnStyle: {
            width: "0px",
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
            width: "250px",
            textAlign: "center",
            paddingRight: "0px",
          },
          align: "center",
        },
      },
      {
        Header: "Image",
        accessor: "brand_image",
        extraProps: {
          columnStyle: { textAlign: "center" },
          align: "center",
        },
        Cell: (cell: any) => {
          return (
            <Image
              src={`brand-images/${cell.row.original.brand_image}`}
              alt={""}
            />
          );
        },
      },
      {
        Header: "Brand Name",
        accessor: "brand_name",
        extraProps: {
          align: "center",
        },
        Cell: (cell: any) => {
          return <h1 className="text-md font-bold">{cell.value}</h1>;
        },
      },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <TableActionsCell
            cell={cell}
            onDelete={async (value, setDeleteLoading) => {
              setDeleteModalShow(true);
              setValue({
                brand_id: value.brand_id,
                setDeleteLoading,
              });
            }}
            onEdit={onBrandEdit}
          />
        ),
      },
    ],
    []
  );

  const getData = React.useMemo(() => data, [data]);

  React.useEffect(() => {
    onBrandsGet();
  }, []);
  return (
    <AdminContainer>
      <MainContainer heading="Brands">
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
        onClickYes={onBrandDelete}
      />
    </AdminContainer>
  );
}
