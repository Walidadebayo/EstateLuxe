import React from "react";

interface MetaTitleProps {
  title: string;
  children: React.ReactNode;
}

export default function MetaTitle({ title, children }: MetaTitleProps) {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
  return <>{children}</>;
}
