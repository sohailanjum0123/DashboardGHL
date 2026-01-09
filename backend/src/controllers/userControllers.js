import { asyncHnadler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../Service/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw apiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHnadler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  if ([fullName, userName, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "all fields required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format.");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user alredy existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new apiError(400, "avatar image is required");
  }

  const user = await User.create({
    fullName,
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  if (!createdUser) {
    throw new apiError(500, "something wrong by Server registering the user");
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        201,
        { accessToken, refreshToken, user: createdUser },
        "User registered & logged in"
      )
    );
});

const loginUser = asyncHnadler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new apiError(400, "Please enter userDetail");
  }

  const user = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  });

  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const isPassword = await user.isPasswordCorrect(password);
  if (!isPassword) {
    throw new apiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        "User Logged in"
      )
    );
});

const logoutUser = asyncHnadler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false, 
    sameSite: "lax", 
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "Logged Out user successfully"));
});

const refreshAccessToken = asyncHnadler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incommingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new apiError(401, "Invalid Refresh Token");
  }

  if (incommingRefreshToken != user?.refreshToken) {
    throw new apiError(401, "Refresh Token is Expired or User");
  }

  const { accessToken, newRefreshToken } = user.generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "AccessToken  refreshed"
      )
    );
});

const searchUser = asyncHnadler(async (req, res) => {
  try {
    const { keyword } = req.query;

    const filters = {};
    if (keyword) {
      filters.$or = [
        { userName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    const user = await User.find(filters);
    return res.status(200).json(
      new apiResponse(200, {
        user,
      })
    );
  } catch (error) {
    throw new apiError(500, `Searching Server Error:${error.message}`);
  }
});

const getUsers = asyncHnadler(async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new apiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    throw new apiError(500, `Getting users server error: ${error.message}`);
  }
});



const updateUser = asyncHnadler(async (req, res) => {
  const { id } = req.params;


  if (req.user.role !== "admin" && req.user._id.toString() !== id) {
    throw new apiError(403, "You are not authorized to update this user");
  }

  const { fullName, userName, email } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new apiError(400, "Invalid email format.");
    }
  }


  let updateData = { fullName, userName, email };
  if (req.files?.avatar) {
    const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    updateData.avatar = avatar.url;
  }
  if (req.files?.coverImage) {
    const coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    updateData.coverImage = coverImage.url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new apiError(404, "User not found");
  }

  return res.status(200).json(new apiResponse(200, updatedUser, "User updated successfully"));
});

const deleteUser = asyncHnadler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    throw new apiError(403, "You are not authorized to delete users");
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res.status(200).json(new apiResponse(200, {}, "User deleted successfully"));
});

const getUserDetail = asyncHnadler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin" && req.user._id.toString() !== id) {
    throw new apiError(403, "You are not authorized to view this user");
  }

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res.status(200).json(new apiResponse(200, user, "User details fetched successfully"));
});




const requestPasswordReset = asyncHnadler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; 

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: `You requested a password reset.\n\nClick the link below:\n${resetURL}\n\nThis link will expire in 30 minutes.`,
  });

  return res.status(200).json(
    new apiResponse(200, {}, "Password reset link sent to your email")
  );
});



const resetPassword = asyncHnadler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new apiError(400, "Password is required");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired reset token");
  }

  // Update password (bcrypt hook will run)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return res.status(200).json(
    new apiResponse(200, {}, "Password reset successfully")
  );
});



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  searchUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserDetail,
  requestPasswordReset ,
  resetPassword 

};
