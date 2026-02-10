import { createElement, lazy } from "react";

const NewEmployeePage = lazy(() => import("../pages/newEmployee"));
const OffBoardingPage = lazy(() => import("../pages/offBoarding"));
const DataKaryawanPage = lazy(() => import("../pages/allEmployee"));
const PrintLetterPage = lazy(() => import("../pages/printLetter"));
const EmployeeDetailPage = lazy(() => import("../pages/detailEmployee"));

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
    path: "/printLetter",
    element: createElement(PrintLetterPage),
  },
  {
    path: "/detailEmployee",
    element: createElement(EmployeeDetailPage),
  },
];

export const SIDEBARMENU = [
  { name: "Karyawan Baru", icon: "/icon/dashboard.svg", path: "/" },
  { name: "Offboarding", icon: "/icon/offBoarding.svg", path: "/offboarding" },
  { name: "Daftar Karyawan", icon: "/icon/karyawan.svg", path: "/employees" },
  { name: "Cetak Surat", icon: "/icon/cetakSurat.svg", path: "/printLetter" },
];
