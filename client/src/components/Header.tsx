import { Button } from "@progress/kendo-react-buttons";
import { Typography } from "@progress/kendo-react-common";
import { menuIcon, questionCircleIcon } from "@progress/kendo-svg-icons";
import logoSvg from "@/assets/logo.svg";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: Readonly<HeaderProps>) => {
  return (
    <header className="sticky top-0 z-[999] backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 lg:space-x-4 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="flex items-center justify-center">
              <img src={logoSvg} alt="Screenly Logo" className="w-10 h-auto" />
            </div>
            <div>
              <Typography.h4 style={{ lineHeight: "0.2", marginTop: ".85rem" }}>
                Screenly
              </Typography.h4>
              <p className="text-sm text-muted-foreground">
                AI-powered feedback to land interviews faster.
              </p>
            </div>
          </div>

          <div className="min-[600px]:hidden">
            <Button
              size={"large"}
              themeColor={"light"}
              fillMode={"clear"}
              svgIcon={menuIcon}
              onClick={toggleSidebar}
            ></Button>
          </div>

          <div className="flex items-center space-x-4 max-[600px]:hidden">
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
        </div>
      </div>
    </header>
  );
};
export default Header;
