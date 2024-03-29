import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToWords } from "to-words";
import dayjs from "dayjs";
import { getStrOrderStatus } from "../../constants/messages";

export const getPayload = (
  original: { [key: string]: any },
  payload?: Array<string>
) => {
  let result: { [key: string]: any } = {};
  if (payload) {
    payload?.map((item) => {
      result[item] = original[item];
    });
  }
  return result;
};

export const removePostFix = (value: string): any => {
  const reg = /([\d]+(?:\.[\d]+)?(?![\d]))|([a-z.]+)(?![a-z.])/gi;
  return value.match(reg) || ["", ""];
};

export const margeObj = (
  init: { [key: string]: any },
  data: { [key: string]: any }
) => {
  let newObj: { [key: string]: any } = {};
  Object.keys(init).forEach((key) => {
    newObj[key] = data[key] === null ? "" : data[key];
  });
  return newObj;
};

export const queryToStr = (queryObj: { [key: string]: any }) => {
  const query = [];
  for (const key in queryObj) {
    query.push(
      encodeURIComponent(key)
        .concat("=")
        .concat(encodeURIComponent(queryObj[key]))
    );
  }
  return query.length ? query.join("&") : "";
};

export const nullFree = (value: any) => {
  if (value === undefined || value === null) return 0;
  return value;
};

export const reactToPdf = async (ref: any, saveName: string) => {
  const canvas = await html2canvas(ref);
  const data = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4", false);
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(saveName);
};

export const totalGst = (totalAmount: number, igst: string) => {
  const i = parseFloat(igst);
  const igstNum = isNaN(i) ? 0 : i;
  return {
    gst: totalAmount / (1 + igstNum / 100),
    igstNum,
  };
};

export function numberToEnIn(value: string): string {
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  const num = Number(value);
  if (isNaN(num)) {
    return "Zero";
  }
  return toWords.convert(num, {
    doNotAddOnly: true,
  });
}

export const filterPhoneNo = (phone: string, r91?: boolean) => {
  if (phone) {
    const spaceFree = phone.replace(/\s/g, "");
    return r91
      ? spaceFree.replace("+91", "")
      : spaceFree.includes("+91")
      ? spaceFree
      : "+91" + spaceFree;
  }
  return "";
};

export const round2 = (value: number | string | null | undefined) => {
  if (typeof value === "string") {
    const conNm = parseFloat(value);
    return !isNaN(conNm) ? conNm.toFixed(2) : 0.0;
  } else if (typeof value === "number") return value.toFixed(2);
  return 0.0;
};

// !Table Units Start

export const addSno = (
  data: Array<Record<string, any>>,
  keyName: string = "s_no"
) =>
  data.map((row, index) => ({
    [keyName]: index + 1,
    ...row,
  }));

export const orderStatusReadable = (
  data: Array<Record<string, any>>,
  extractName: string = "order_status",
  addKeyName: string = "order_status"
) =>
  data.map((row) => ({
    ...row,
    [addKeyName]: getStrOrderStatus(`${row[extractName]}`),
  }));

export const dateTimeFormatTable = (
  data: Array<Record<string, any>>,
  dateExtractKeyName: string,
  addTimeKeyName: string
) =>
  data.map((row) =>
    row[dateExtractKeyName]
      ? {
          ...row,
          [dateExtractKeyName]: dayjs(row[dateExtractKeyName]).format(
            "D-M-YYYY"
          ),
          [addTimeKeyName]: dayjs(row[dateExtractKeyName]).format("h:mm"),
        }
      : row
  );

export const margeRowTable = (
  data: Array<Record<string, any>>,
  whoMarge: Array<string>,
  nameOfCol: string
) =>
  data.map((row) => ({
    ...row,
    [nameOfCol]: whoMarge.reduce((p, c) =>
      whoMarge[0] === p && whoMarge[1] === c
        ? `${row[p] ? row[p] : ""} (${row[c] ? row[c] : ""})`
        : `${p ? p : ""} (${row[c] ? row[c] : ""})`
    ),
  }));

export const addTaxNetAmount = (
  data: Array<Record<string, any>>,
  taxKeyName: string = "tax_amount",
  netKeyName: string = "net_amount"
) =>
  data.map((row) => {
    const both = row?.retailer_state === row?.billing_state;
    const { gst, igstNum } = totalGst(
      nullFree(row?.total_price),
      nullFree(row?.igst)
    );
    if (igstNum !== 0) {
      const netAmount = gst;
      const taxAmount = nullFree(row?.total_price) - gst;
      return {
        ...row,
        [taxKeyName]: taxAmount.toFixed(2),
        [netKeyName]: netAmount.toFixed(2),
        ...(both
          ? {
              sgst_amt: (taxAmount / 2).toFixed(2),
              cgst_amt: (taxAmount / 2).toFixed(2),
              igst_amt: "",
              igst: "",
            }
          : {
              sgst: "",
              cgst: "",
              sgst_amt: "",
              cgst_amt: "",
              igst_amt: taxAmount.toFixed(2),
            }),
      };
    } else {
      return {
        ...row,
        [taxKeyName]: 0,
        [netKeyName]: row?.total_price,
        ...(both
          ? {
              sgst_amt: 0,
              cgst_amt: 0,
              igst_amt: "",
              igst: "",
            }
          : {
              sgst: "",
              cgst: "",
              sgst_amt: "",
              cgst_amt: "",
              igst_amt: 0,
            }),
      };
    }
  });

export const margeAsList = (
  data: Array<Record<string, any>>,
  whoMarge: Array<string>,
  nameOfCol: string
) =>
  data.map((row) => ({
    ...row,
    [nameOfCol]: whoMarge.map((value) => row[value] || ""),
  }));

export const setExtraValue = (
  data: Array<Record<string, any>>,
  keyName: string,
  setName: string
) =>
  data.map((row) => ({
    ...row,
    [keyName]: setName,
  }));

export const removeEsc = (data: Array<Record<string, any>>) =>
  data.map((row) => {
    const newRow: typeof row = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        if (typeof row[key] === "string") {
          newRow[key] = row[key].replace(/\t/g, " ").replace(/\n/g, " ");
        }
      }
    }
    return { ...row, ...newRow };
  });

// !Table Units End

export const objectToForm = (obj: Record<string, any>) => {
  const formData = new FormData();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
};

export function checkCancelOrderStatus(status: string) {
  const value: Array<string> = [
    "7",
    "9",
    "10",
    "11",
    "13",
    "15",
    "11,13,15",
    "7,9,10",
  ];
  for (const iterator of value) {
    if (status === iterator) {
      return true;
    }
  }
  return false;
}

export function dtypeValidation(value: any, dtype: "number" | "string") {
  if (dtype === "number") {
    if (typeof value === "number") {
      if (value < 0)
        return { error: true, message: "value should be positive" };
    } else {
      return { error: true, message: "data required" };
    }
  } else if (dtype === "string") {
    if (typeof value === "string") {
      if (!value) return { error: true, message: "not allowed to be empty" };
    } else {
      return { error: true, message: "data required" };
    }
  }
  return { error: false, message: "" };
}
