import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,searchUser, getUsers } from "../controllers/userControllers.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1,
    }
]),registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT,logoutUser);
router.route('/access-token').post(refreshAccessToken)
router.route("/search").get(searchUser)
router.get(
  "/users",
  verifyJWT,
  authorizeRoles("admin"),
  getUsers
);

router.route("/dashboard").get(verifyJWT, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin, this is the dashboard." });
});

export default router;