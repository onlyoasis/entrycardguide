// Registration starts email verification. It never returns a session or key.
import { otpHandler } from "../../_mcp/account.js";
import { methodNotAllowed } from "../../_mcp/http.js";
export const onRequestPost = otpHandler("register");
export const onRequestGet = methodNotAllowed;
