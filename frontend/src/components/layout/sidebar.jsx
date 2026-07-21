import { useLocation, useNavigate } from "react-router-dom";

import { SIDEBARMENU } from "../../constants/routes";

export const SideBar = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  const handlePress = (label, title) => {
    if (label !== pathname) {
      navigate(label, { state: { title } });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-colors dark:border-slate-800 dark:bg-slate-950 lg:bottom-auto lg:h-full lg:w-72 lg:border-t-0 lg:px-0 lg:py-0 lg:pl-5 lg:pr-4 lg:shadow-none">
      <div className="hidden h-[4rem] items-center lg:flex">
        <img src="/logoPersonalia.svg" className="max-w-full" />
      </div>

      <div className="flex gap-2 overflow-x-auto lg:mt-5 lg:flex-col lg:gap-5 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
        {SIDEBARMENU.map((item) => (
          <button
            key={item.name}
            className={`flex min-w-[76px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 transition-colors lg:min-w-0 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-lg lg:px-4 ${
              pathname === item.path
                ? "border-primary bg-primary/5 dark:border-sky-400 dark:bg-sky-400/10"
                : "border-white dark:border-slate-950"
            } hover:border-primary dark:hover:border-sky-400`}
            onClick={() => handlePress(item.path, item.name)}
            title={item.name}
            type="button"
          >
            <img src={item.icon} alt={item.name} className="h-6 w-6 shrink-0" />
            <p
              className={`max-w-[68px] truncate text-center font-Poppins text-[10px] font-[500] leading-tight lg:max-w-none lg:whitespace-normal lg:text-left lg:text-base ${item.name === "Logout" ? "text-red" : "text-primary dark:text-slate-200"}`}
            >
              {item.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
