import { createElement, lazy } from "react";

const NewEmployeePage = lazy(() => import("../pages/newEmployee"));
const OffBoardingPage = lazy(() => import("../pages/offBoarding"));
const DataKaryawanPage = lazy(() => import("../pages/allEmployee"));
const PrintLetterPage = lazy(() => import("../pages/printLetter"));
const EmployeeDetailPage = lazy(() => import("../pages/detailEmployee"));
const MasterSetempatPage = lazy(() => import("../pages/masterSetempat"));
const MasterWilayahPendidikanPage = lazy(
  () => import("../pages/masterWilayahPendidikan"),
);
const CheckAttendancePage = lazy(() => import("../pages/checkAttendance"));

export const ROUTE = [
  {
    path: "/",
    element: createElement(NewEmployeePage),
  },
  {
    path: "/offboarding",
    element: createElement(OffBoardingPage),
  },
  {
    path: "/employees",
    element: createElement(DataKaryawanPage),
  },
  {
    path: "/master-setempat",
    element: createElement(MasterSetempatPage),
  },
  {
    path: "/master-wilayah-pendidikan",
    element: createElement(MasterWilayahPendidikanPage),
  },
  {
    path: "/check-absensi",
    element: createElement(CheckAttendancePage),
  },
  {
    path: "/printLetter",
    element: createElement(PrintLetterPage),
  },
  {
    path: "/detailEmployee/:employeeId",
    element: createElement(EmployeeDetailPage),
  },
  {
    path: "/detailEmployee",
    element: createElement(EmployeeDetailPage),
  },
];

export const SIDEBARMENU = [
  { name: "Karyawan Baru", icon: "/icon/dashboard.svg", path: "/" },
  {
    name: "Karyawan Keluar",
    icon: "/icon/offBoarding.svg",
    path: "/offboarding",
  },
  { name: "Daftar Karyawan", icon: "/icon/karyawan.svg", path: "/employees" },
  {
    name: "Master Setempat",
    icon: "/icon/setting.svg",
    path: "/master-setempat",
  },
  {
    name: "Master Wilayah & Pendidikan",
    icon: "/icon/setting.svg",
    path: "/master-wilayah-pendidikan",
  },
  {
    name: "Check Data Absen",
    icon: "/icon/karyawan.svg",
    path: "/check-absensi",
  },
];
