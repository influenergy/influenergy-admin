import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Header = () => {
  const authUser = useSelector((state:RootState) => state.auth.user);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center relative ">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="relative ">
        <button
          className="flex items-center space-x-2 profile-menu px-3 py-2 rounded-md hover:bg-gray-100 transition hover:scale-110 ease-in-out"
        >
          <FaUserCircle size={24} />
          <span>{authUser?.fullName}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
