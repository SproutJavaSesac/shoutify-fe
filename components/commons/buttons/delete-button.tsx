"use client";

import { Button } from "@/components/ui/button";
import { withAuth } from "@/lib/hoc/withAuth";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BaseDeleteButton = ({
  onClick,
  children = "삭제",
  className,
  size = "sm",
  executeWithAuth,
}: DeleteButtonProps) => {
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
      variant="ghost"
      size={size}
    >
      <Trash2 className="h-3 w-3 mr-1" />
      {children}
    </Button>
  );
};

export const DeleteButton = withAuth(BaseDeleteButton);
