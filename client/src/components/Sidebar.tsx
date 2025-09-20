import { Button } from "@progress/kendo-react-buttons";
import { questionCircleIcon } from "@progress/kendo-svg-icons";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: Readonly<SidebarProps>) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9998] ${
          isSidebarOpen ? "" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-0 right-0 z-[9999] w-60 bg-gray-800 text-white min-h-screen 
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center flex-col gap-4 mt-6">
          <Button
            size={"large"}
            themeColor={"light"}
            fillMode={"clear"}
            svgIcon={questionCircleIcon}
            style={{
              padding: "0.5rem 1rem",
              gap: "0.5rem",
            }}
          >
            Help
          </Button>
          <Button
            size={"large"}
            rounded={"large"}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "0.5rem 1rem",
            }}
            disabled={true}
          >
            <i className="fas fa-crown mr-2"></i> Upgrade
          </Button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
