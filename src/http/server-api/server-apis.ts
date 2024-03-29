import { baseUrlImg } from "../config";
import { api2, baseFunc } from "./server-base";

// list of all the endpoints of farmers
export const farmers = baseFunc("shop_customer");
// list of all the endpoints of shop_warehouses
export const warehouse = baseFunc("shop_warehouses");
// list of all the endpoints of shop_retailer
export const retailer = baseFunc("shop_retailer");
// list of all the endpoints of shop_categories
export const categories = baseFunc("shop_categories");
// list of all the endpoints of shop_subcategories
export const subCategories = baseFunc("shop_subcategories");
// list of all the endpoints of shop_brands
export const brands = baseFunc("shop_brands");
// list of all the endpoints of shop_deliverypartners
export const deliveryPartners = baseFunc("shop_deliverypartners");
// list of all the endpoints of shop_deliveryretailer
export const deliveryRetailer = baseFunc("shop_deliveryretailer");
export const shopDeliveryAgent = baseFunc("shop_deliveryagents");
// list of all the endpoints of shop_products
export const shopProducts = baseFunc("shop_products");
// list of all the endpoints of shop_productweightprice
export const shopProductWeightPrice = baseFunc("shop_productweightprice");
// list of all the endpoints of shop_productimages
export const shopProductImages = baseFunc("shop_productimages");
// list of all the endpoints of shop_packages
export const shopPackages = baseFunc("shop_packages");
// list of all the endpoints of shop_units
export const shopUnits = baseFunc("shop_units");
// list of all the endpoints of shop_areas
export const shopAreas = baseFunc("shop_areas");
// list of all the endpoints of shop_orders
export const shopOrders = baseFunc("shop_orders");
export const shopOrderDetails = baseFunc("shop_orderdetails");

// Retailer Dashboard api's
export const shopRetailerProductPrice = baseFunc("shop_retailerproductprice");
export const shopAssignRetailerProducts = baseFunc(
  "shop_assignretailerproducts"
);
export const shopRetailerArea = baseFunc("shop_retailerareas");
export const shopPartnerArea = baseFunc("shop_partnerareas");
// shop banner api
export const shopBanner = baseFunc("shop_banners");

export const shopImgDownLoad = (img: any) =>
  api2.request({
    url: `${baseUrlImg}${img || ""}`,
    method: "GET",
    responseType: "blob",
    headers: {
      Accept: "*/*",
    },
  });

// shop delivery charge api
export const shopDeliveryCharge = baseFunc("shop_deliverycharges");

// shop reason
export const shopReason = baseFunc("shop_reason");
