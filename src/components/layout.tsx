import type { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
}>;

export const Layout = (props: PageLayoutProps) => {
  const { leftComponent, rightComponent } = props;

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 flex items-center justify-center bg-customRed p-4 lg:col-span-2">
        {leftComponent}
      </div>
      <div className="col-span-1 flex items-center justify-center bg-customSky p-4 lg:col-span-1">
        {rightComponent}
      </div>
    </div>
  );
};
