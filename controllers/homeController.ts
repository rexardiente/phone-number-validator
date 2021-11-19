import { table, insert, update, remove, isExists } from "../utils/dbQueries";
import { throws } from "assert/strict";

const PNF = require("google-libphonenumber").PhoneNumberFormat;
// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

// fetch all phone numbers.
export const fetch_phone_numbers = function (req: any, res: any) {
  // res.send('NOT IMPLEMENTED: Author list');
  table()
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200; // 400 = Bad request
      res.write(JSON.stringify(result));
      res.end();
    })
    .catch((_: any) =>
      customHttpResponse(true, null, 500, "system error", res)
    );
};

export const insert_phone_num = function (req: any, res: any) {
  let requestBody = req.body;
  let phone = requestBody.phone ?? 0;
  let language = requestBody.language ?? "PH";

  try {
    // Parse number with country code and keep raw input.
    const number = phoneUtil.parseAndKeepRawInput(phone, language);
    const isValid = phoneUtil.isValidNumber(number);
    // check if valid phone number format
    if (isValid) {
      // convert to standformat with no white spaces
      const standardFormat = phoneUtil
        .format(number, PNF.NATIONAL)
        .replace(/\s/g, "");
      // check if number not exist, else throw an err..
      return insert(standardFormat)
        .then((x) =>
          customHttpResponse(
            false,
            standardFormat,
            200,
            "SUCCESFULLY INSERTED",
            res
          )
        )
        .catch((_: any) =>
          customHttpResponse(
            true,
            number.getRawInput(),
            409,
            "phone number already exists",
            res
          )
        );
    }
    throw new Error("");
  } catch (error) {
    customHttpResponse(true, phone, 422, "invalid number format", res);
  }
};

export const update_phone_num = function (req: any, res: any) {
  let requestBody = req.body;
  let paramID = req.params.id ?? null;
  // validate number to be added..
  let phone = requestBody?.phone ?? 0;
  let language = requestBody.language ?? "PH";
  try {
    // Parse number with country code and keep raw input.
    const number = phoneUtil.parseAndKeepRawInput(phone, language);
    const isValid = phoneUtil.isValidNumber(number);

    // check if valid phone number format
    if (isValid && paramID != null) {
      // convert to standformat with no white spaces
      const standardFormat = phoneUtil
        .format(number, PNF.NATIONAL)
        .replace(/\s/g, "");
      // update now..
      return isExists(paramID)
        .then((exists) => {
          if (exists) {
          } // do nothing and continue, else throw error
          else throw "not id not found";
        })
        .then(() => {
          update(paramID, standardFormat).then((x) =>
            customHttpResponse(
              false,
              standardFormat,
              200,
              "SUCCESFULLY UPDATED",
              res
            )
          );
        })
        .catch((err) =>
          customHttpResponse(true, number.getRawInput(), 500, err, res)
        );
    }
    throw new Error("");
  } catch (error) {
    customHttpResponse(true, phone, 422, "invalid number or id", res);
  }
};

export const delete_phone_num = function (req: any, res: any) {
  let requestBody = req.body;
  let paramID = req.params.id ?? null;
  // validate number to be added..
  let phone = requestBody.phone ?? 0;
  let language = requestBody.language ?? "PH";
  try {
    // Parse number with country code and keep raw input.
    const number = phoneUtil.parseAndKeepRawInput(phone, language);
    const isValid = phoneUtil.isValidNumber(number);

    // check if valid phone number format
    if (isValid || paramID != null) {
      // convert to standformat with no white spaces
      const standardFormat = phoneUtil
        .format(number, PNF.NATIONAL)
        .replace(/\s/g, "");
      // update now..
      return isExists(paramID, standardFormat)
        .then((exists) => {
          if (exists) {
          } // do nothing and continue, else throw error
          else throw "not id not found";
        })
        .then(() => {
          remove(paramID, standardFormat).then((x) =>
            customHttpResponse(
              false,
              standardFormat,
              200,
              "SUCCESFULLY DELETED",
              res
            )
          );
        })
        .catch((err) =>
          customHttpResponse(true, number.getRawInput(), 500, err, res)
        );
    }
    throw new Error("");
  } catch (error) {
    customHttpResponse(true, phone, 422, "invalid number or id", res);
  }
};

const customHttpResponse = (
  isError: boolean,
  input: any,
  code: number,
  msg: string,
  res: any
) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = code;
  res.write(
    JSON.stringify({ is_error: isError, phone_number: input, message: msg })
  );
  res.end();
};
