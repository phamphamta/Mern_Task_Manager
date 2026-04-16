import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user._id) {
    console.warn("Auth Middleware: Unauthorized access attempt. No user found in request.");
    console.log("Auth Middleware: Session ID:", req.sessionID);
    console.log("Auth Middleware: Session present:", !!req.session);
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
