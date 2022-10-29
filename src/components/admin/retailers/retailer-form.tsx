import React from "react";
import { Box, Typography } from "@mui/material";
import { TextInput } from "../../form";
import { PatternFormat } from "react-number-format";

function RetailerForm(props: {
  errors?: any;
  values?: any;
  touched?: any;
  handleChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  handleBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
}) {
  const { values, handleChange, errors, handleBlur, touched } = props;
  const basicFields = React.useMemo(
    () => [
      {
        type: "string",
        label: "Retailer Name",
        name: "retailer_name",
      },
      {
        type: "email",
        label: "Email",
        name: "email_id",
      },
      {
        type: "text",
        label: "Company Name",
        name: "company_name",
      },
      {
        type: "numeric",
        label: "Phone Number",
        name: "phone_no",
        format: "+91 ### ### ####",
        allowEmptyFormatting: true,
        mask: "_",
      },
      {
        type: "string",
        label: "Zone Name",
        name: "zone_name",
      },
      {
        type: "string",
        label: "ERP Name",
        name: "erp_code",
      },
    ],
    []
  );

  const addressFields = React.useMemo(
    () => [
      {
        type: "string",
        label: "City",
        name: "city",
      },
      {
        type: "string",
        label: "State",
        name: "state",
      },
      {
        type: "string",
        label: "District",
        name: "district",
      },
      {
        type: "number",
        label: "Pin-Code",
        name: "pincode",
      },
    ],
    []
  );

  const otherFields = React.useMemo(
    () => [
      {
        type: "text",
        label: "Pan No",
        name: "pan_no",
      },
      {
        type: "text",
        label: "GST Number",
        name: "gst_number",
      },
      {
        type: "string",
        label: "Default Credit Limit",
        name: "default_credit_limit",
      },
      {
        type: "string",
        label: "Default Credit Period",
        name: "default_credit_period",
      },
      {
        type: "string",
        label: "Distributor Level",
        name: "distributor_level",
      },
      {
        type: "string",
        label: "Subzone ID",
        name: "subzone_id",
      },
    ],
    []
  );
  // format="+1 (###) #### ###" allowEmptyFormatting mask="_"
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Basic Information</Typography>
          <Typography>Section to config basic retailer information</Typography>
        </Box>
        {basicFields.map((item, index) => {
          const { type, format, ...others } = item;
          return item.type === "numeric" ? (
            <PatternFormat
              {...others}
              type="tel"
              format={format || ""}
              customInput={TextInput}
              key={index}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          ) : (
            <TextInput
              key={index}
              {...item}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          );
        })}
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>Retailer Address</Typography>
          <Typography>
            Section to config retailer address information
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {addressFields.map((item, index) => (
            <TextInput
              key={index}
              {...item}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          ))}
        </div>
        <TextInput
          type="text"
          label="Jurisdiction"
          name="jurisdiction"
          value={values.jurisdiction}
          onChange={handleChange}
          error={errors.jurisdiction && touched.jurisdiction ? true : false}
          helperText={touched.jurisdiction ? errors.jurisdiction : ""}
          onBlur={handleBlur}
        />
        <TextInput
          type="text"
          label="Address"
          name="address"
          value={values.address}
          onChange={handleChange}
          error={errors.address && touched.address ? true : false}
          helperText={touched.address ? errors.address : ""}
          onBlur={handleBlur}
          multiline
          rows={4}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box>
          <Typography variant={"h6"}>
            Retailer Organizations Information
          </Typography>
          <Typography>
            Section to config retailer organizations information
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {otherFields.map((item, index) => (
            <TextInput
              key={index}
              {...item}
              value={values[item.name] || ""}
              onChange={handleChange}
              error={errors[item.name] && touched[item.name] ? true : false}
              helperText={touched[item.name] ? errors[item.name] : ""}
              onBlur={handleBlur}
            />
          ))}
        </div>
        <TextInput
          type="text"
          label="Terms & Conditions"
          name="terms_conditions"
          value={values.terms_conditions}
          onChange={handleChange}
          error={
            errors.terms_conditions && touched.terms_conditions ? true : false
          }
          helperText={touched.terms_conditions ? errors.terms_conditions : ""}
          onBlur={handleBlur}
          multiline
          rows={4}
        />
      </Box>
    </Box>
  );
}

export default React.memo(RetailerForm);

export const initialValues = {
  retailer_name: "",
  company_name: "",
  email_id: "",
  phone_no: "",
  zone_name: "",
  erp_code: "",
  address: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  jurisdiction: "",
  terms_conditions: "",
  pan_no: "",
  default_credit_limit: "",
  default_credit_period: "",
  subzone_id: "",
};
