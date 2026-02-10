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
    <div className="h-full fixed w-52 pl-3">
      <div className="h-[4rem] flex items-center">
        <img src="/logoPersonalia.svg" />
      </div>

      <div className="flex flex-col gap-5 mt-5">
        {SIDEBARMENU.map((item) => (
          <button
            key={item.name}
            className={`items-center flex px-4 py-2 gap-3 border-2 ${pathname === item.path ? "border-primary" : "border-white"} hover:border-primary rounded-lg`}
            onClick={() => handlePress(item.path, item.name)}
          >
            <img src={item.icon} alt={item.name} />
            <p
              className={`font-Poppins text-left font-[500] ${item.name === "Logout" ? "text-red" : "text-primary"}`}
            >
              {item.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
