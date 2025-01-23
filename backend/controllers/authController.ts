import { NextFunction, Request, Response } from "express";
// import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";

import AppError from "../utils/appError";
import Trainer from "../models/trainerModel";

export interface AuthRequest extends Request {
  userId?: string; // Ajout du champ userId à la requête
}
interface DecodedToken extends JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!, 
    { expiresIn: "7d" }
  );
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    // sameSite: "Strict" as const, // Strict pour éviter CSRF",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 15 * 60 * 1000, // Expire en 15 minutes
  });


  // if (process.env.NODE_ENV === "production") {
  //   cookieOptions.secure = true;
  // }
  user.password = undefined;
  res.status(statusCode).json({
    token,
    name: user.name,
    email: user.email,
  });
};
export interface AuthRequest extends Request {
  userId?: string; 
}

export const signup = catchAsync(async (req, res) => {
  const newUser = await Trainer.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
});

const jwtVerifyPromisified = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

export const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        status: "fail",
        message: "Vous n'êtes pas connecté, veuillez vous connecter",
      });
    }

    const token = authHeader.split(" ")[1];

    // Promisify jwt.verify
    const decoded = (await jwtVerifyPromisified(
      token,
      process.env.JWT_SECRET!
    )) as DecodedToken;
    req.userId = decoded.id;
    next();
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new AppError("Please provide email and password", 400));
    }
    const user = await Trainer.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
  }
);

export const logout = (req: Request, res: Response) => {
  // Supprime les cookies contenant les tokens
  res.clearCookie("accessToken", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  });

  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const newAccessToken = signToken(decoded.userId);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Token de rafraîchissement invalide" });
  }
};
