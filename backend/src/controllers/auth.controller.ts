import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return req.session.save(() => {
        res.send(`
          <script>
            window.location.href = "${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure";
          </script>
        `);
      });
    }

    return req.session.save(() => {
      res.send(`
        <script>
          window.location.href = "${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}";
        </script>
      `);
    });
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Auth Controller: Starting registration for", req.body.email);
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);
    console.log("Auth Controller: Registration successful.");

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Auth Controller: Starting login for", req.body.email);
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          console.error("Auth Controller Error: Passport auth error:", err);
          return next(err);
        }

        if (!user) {
          console.warn("Auth Controller: Login failed - Invalid credentials.");
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("Auth Controller Error: req.logIn error:", err);
            return next(err);
          }

          console.log("Auth Controller: Login successful for", user);
          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        return res
          .status(HTTPSTATUS.OK)
          .json({ message: "Logged out successfully" });
      });
    });
  }
);
