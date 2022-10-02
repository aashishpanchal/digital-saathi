import React from "react";
import { Spinner } from "flowbite-react";
import MainContainer from "../../../../components/common/MainContainer";
import { categories } from "../../../../http";
import { useNavigate } from "react-router-dom";
import Image from "../../../../components/Image/Index";
import { DeleteModal } from "../../../../components/modals";
import {
  ActiveDeactivateCell,
  Table,
  TableActionsCell,
} from "../../../../components/table";
import {
  SelectColumActiveDeactivateFilter,
  SelectColumnFilter,
} from "../../../../components/filter/SelectColumnFilter";
import Button from "../../../../components/button/Button";
import { MdOutlineAccountTree } from "react-icons/md";
import { TbDatabaseOff } from "react-icons/tb";
import useBucket from "../../../../hooks/useBucket";

export default function Categories() {
  const [data, setData] = React.useState({
    totalItems: 0,
    totalPages: 1,
    categories: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [deleteModalShow, setDeleteModalShow] = React.useState(false);
  const [value, setValue] = React.useState<{
    category: { [key: string]: any };
    setDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }>();
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const navigate = useNavigate();
  const { S3DeleteImage } = useBucket();

  const onCategoriesGet = async () => {
    setLoading(true);
    try {
      const res = await categories("get", {
        postfix: `?page=${page}&size=${pageSize}`,
      });
      if (res?.status === 200) {
        setData(res.data);
      }
    } catch (err: any) {
      console.log(err.response);
    }
    setLoading(false);
  };

  const onCategoryDelete = async () => {
    if (value) {
      setDeleteModalShow(false);
      const { category, setDeleteLoading } = value;
      setValue(undefined);
      setDeleteLoading(true);
      const metaData = await S3DeleteImage(category.image);
      if (metaData?.success) {
        try {
          const res: any = await categories("delete", {
            params: category.category_id,
          });
          if (res.status === 200) {
            await onCategoriesGet();
          }
        } catch (err: any) {
          console.log(err.response);
        }
      }
      setDeleteLoading(false);
    }
  };

  const onCategoryEdit = (value: { [key: string]: any }) =>
    navigate(`${value.category_id}`);

  const onNext = (values: { [key: string]: any }) => {
    navigate(`${values.category_id}/sub-categories/${decodeURI(values.name)}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S No.",
        accessor: "category_id",
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
          <ActiveDeactivateCell
            cell={cell}
            idKey="category_id"
            setData={setData}
            axiosFunction={categories}
          />
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
        accessor: "image",
        extraProps: {
          columnStyle: { textAlign: "center" },
          align: "center",
        },
        Cell: (cell: any) => {
          return <Image url={cell.value} alt={""} />;
        },
      },
      {
        Header: "Category Name",
        accessor: "name",
        extraProps: {
          align: "center",
        },
        Cell: (cell: any) => {
          return <h1 className="text-md font-bold">{cell.value}</h1>;
        },
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Action",
        Cell: (cell: any) => (
          <TableActionsCell
            cell={cell}
            onDelete={async (value, setDeleteLoading) => {
              setDeleteModalShow(true);
              setValue({
                category: value,
                setDeleteLoading,
              });
            }}
            onEdit={onCategoryEdit}
            onNext={onNext}
          />
        ),
      },
    ],
    []
  );

  const getData = React.useMemo(() => data.categories, [data, page]);

  React.useEffect(() => {
    onCategoriesGet();
  }, [page, pageSize]);

  return (
    <MainContainer heading="Categories">
      <div className="mb-4">
        <Button
          url="new"
          icon={<MdOutlineAccountTree size={18} />}
          color="dark"
        >
          New
        </Button>
      </div>
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
          entriesPerPage={pageSize}
          changePageSize={(size) => setPageSize(size)}
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
        onClickYes={onCategoryDelete}
      />
    </MainContainer>
  );
}