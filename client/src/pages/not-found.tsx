import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { arrowLeftIcon, warningCircleIcon } from "@progress/kendo-svg-icons";
import { Card, CardBody } from "@progress/kendo-react-layout";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card
        className="w-full max-w-md mx-4"
        style={{
          backgroundColor: "var(--card)",
        }}
        rounded={"large"}
      >
        <CardBody className="pt-6">
          <div className="flex mb-4 gap-2">
            <SvgIcon
              size={"xxlarge"}
              icon={warningCircleIcon}
              className="text-red-500"
            />
            <h1 className="text-2xl font-bold text-foreground">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Did you forget to add the page to the router?
          </p>
          <Button
            themeColor={"light"}
            style={{ marginTop: "2rem" }}
            svgIcon={arrowLeftIcon}
            fillMode={"flat"}
            onClick={() => (window.location.href = "/")}
          >
            Go Back Home
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
