import { otpHandler } from "../../_mcp/account.js";
import { methodNotAllowed } from "../../_mcp/http.js";
export const onRequestPost = otpHandler("login");
export const onRequestGet = methodNotAllowed;
