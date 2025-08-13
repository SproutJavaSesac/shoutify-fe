"use client";

import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/hoc/withAuth";
import { Edit } from "lucide-react";

interface PostWriteButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BasePostWriteButton = ({
  onClick,
  children = "글쓰기",
  className,
  variant = "default",
  size = "default",
  executeWithAuth,
}: PostWriteButtonProps) => {
  const handleClick = () => {
    if (executeWithAuth) {
      executeWithAuth(onClick);
    } else {
      onClick();
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      <Edit className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
};

export const PostWriteButton = withAuth(BasePostWriteButton);
