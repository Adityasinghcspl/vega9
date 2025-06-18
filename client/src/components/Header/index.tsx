import DropdownUser from "./DropdownUser";
import { PenTool } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex flex-grow items-center justify-between px-2 py-2 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 ">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BlogCraft
              </h1>
              <p className="text-gray-600 text-sm">
                Your creative writing space
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4"></ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
