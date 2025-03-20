import { Loader } from "@progress/kendo-react-indicators";

export default function Loading() {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 grid place-items-center h-screen">
      <div className="mx-auto max-w-screen-sm text-center flex flex-col items-center">
        <Loader type="converging-spinner" size="large" />
        Loading...
      </div>
    </div>
  );
}
