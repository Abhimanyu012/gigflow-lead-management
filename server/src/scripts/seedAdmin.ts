import mongoose from "mongoose";
import { User, UserRole } from "../models/User.model";
import { env } from "../config/env";

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@gigflow.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Updating to Admin role...");
      existingAdmin.role = UserRole.ADMIN;
      await existingAdmin.save();
      console.log("Admin updated successfully.");
    } else {
      console.log("Creating new Admin user...");
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: "AdminPassword123!",
        role: UserRole.ADMIN,
      });
      console.log("Admin created successfully.");
    }

    console.log("Credentials:");
    console.log("Email: admin@gigflow.com");
    console.log("Password: AdminPassword123!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
