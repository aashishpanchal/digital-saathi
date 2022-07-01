import React from "react";
import { BiStore } from "react-icons/bi";
import {
  FaBoxes,
  FaCalendarTimes,
  FaCartPlus,
  FaRegChartBar,
  FaRupeeSign,
  FaShoppingBasket,
  FaTruckLoading,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import AdminContainer from "../../../../../components/AdminContainer";
import MainContainer from "../../../../../components/common/MainContainer";
import { DashboardCard } from "../../../../../components/DashboardCard";
import { shopOrders } from "../../../../../http";

export default function RetailerDashboard() {
  const { retailer_name, retailer_id } = useParams();
  const [totals, setTotals] = React.useState({
    orders: 0,
    retailers: 0,
    farmers: 0,
  });

  const layerOne = React.useMemo(
    () => [
      {
        Title: "Total Orders",
        Icon: <FaCartPlus size={50} />,
        num: totals.orders,
        onClick: () => {},
      },
      {
        Title: "Total SKUs",
        Icon: <FaBoxes size={50} />,
        num: totals.retailers,
        onClick: () => {},
      },
      {
        Title: "Total Farmer Serviced",
        Icon: <FaTruckLoading size={50} />,
        num: totals.farmers,
        onClick: () => {},
      },
    ],
    [totals]
  );

  const layerTwo = React.useMemo(
    () => [
      {
        Title: "Orders",
        Icon: <FaShoppingBasket size={50} />,
        onClick: () => {},
      },
      {
        Title: "Input Sale Details",
        Icon: <BiStore size={50} />,
        onClick: () => {},
      },
      {
        Title: "Cancelled Orders",
        Icon: <FaCalendarTimes size={50} />,
        onClick: () => {},
      },
      {
        Title: "Data SKU Units",
        Icon: <FaBoxes size={50} />,
        onClick: () => {},
      },
      {
        Title: "Data SKU Pricing",
        Icon: <FaRupeeSign size={50} />,
        onClick: () => {},
      },
      {
        Title: "Target vs Achievement",
        Icon: <FaRegChartBar size={50} />,
        onClick: () => {},
      },
    ],
    []
  );

  const onTotalOrders = async () => {
    try {
      const res = await shopOrders("get");
      if (res?.status === 200) {
        const orderRetailers = res.data?.orders.filter(
          (item: any) => item.retailer_id === retailer_id
        );
        setTotals({
          ...totals,
          orders: orderRetailers.length,
        });
      }
    } catch (err: any) {}
  };

  React.useEffect(() => {
    onTotalOrders();
  }, []);

  return (
    <AdminContainer>
      <MainContainer heading={`${retailer_name} / Retailer Dashboard`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layerOne.map((item, index) => (
            <DashboardCard.Container
              key={index.toString()}
              onClick={item.onClick}
            >
              <DashboardCard.CardNumTitleRender
                title={item.Title}
                num={item.num}
                Icon={item.Icon}
              />
            </DashboardCard.Container>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layerTwo.map((item, index) => (
            <DashboardCard.Container
              key={index.toString()}
              onClick={item.onClick}
            >
              <DashboardCard.FlexCenterTitle
                title={item.Title}
                Icon={item.Icon}
              />
            </DashboardCard.Container>
          ))}
        </div>
      </MainContainer>
    </AdminContainer>
  );
}
