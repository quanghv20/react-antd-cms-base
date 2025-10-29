import React, { type ReactNode } from "react";
import useHasPermission from "../useHasPermission";

interface PermissionGateProps {
  requiredPermissions: string | string[];
  children: ReactNode;
  hideIfNoPermission?: boolean; // true = ẩn, false = render fallback
  fallback?: ReactNode; // UI thay thế nếu không có quyền
  all?: boolean; // true = cần tất cả quyền, false = chỉ cần 1 quyền
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredPermissions,
  children,
  hideIfNoPermission = true,
  fallback = null,
  all = false,
}) => {
  const { hasPermission } = useHasPermission();

  const isAllowed = hasPermission(requiredPermissions, { all });

  if (isAllowed) {
    return <>{children}</>;
  }

  if (hideIfNoPermission) {
    return null; // ẩn hẳn
  }

  return <>{fallback}</>; // render UI thay thế
};

export default PermissionGate;
