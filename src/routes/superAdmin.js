import { superAdminController } from "../controller/superAdmin.js";
import express from "express";

const superAdmin = express();

superAdmin.post("/register", superAdminController.registerSuperAdmin);
superAdmin.post("/login", superAdminController.login);
superAdmin.get('/', superAdminController.getAllSuperAdmins);
export default superAdmin;