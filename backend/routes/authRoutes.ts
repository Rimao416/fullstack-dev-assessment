import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/authController";
import sendEmail from "../utils/email";
// import sendEmail from "../utils/email";

const router: Router = Router();

router.post("/sign", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);


router.post("/send-mail", async (req, res) => {
  const { to, sub, body } = req.body;

  try {
    await sendEmail(to, sub, body);
    res.status(201).json({
      status: "created",
      message: "Message sent",
    });
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: "Error sending message",
    });
  }
});

export default router;
