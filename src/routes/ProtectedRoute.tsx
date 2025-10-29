import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PATH } from "@/routes/path";
import { Spin } from "antd";
import { storage } from "@/utils/storage";
import type { IUserLogged } from "@/services/auth/auth.types";
import useHasPermission from "@/components/Permission/useHasPermission";

type ProtectedRouteProps = {
  element: React.ReactElement;
  requiredPermissions?: string | string[];
  options?: { all?: boolean };
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredPermissions,
  options,
}) => {
  const { hasPermission } = useHasPermission();
  const [isChecking, setIsChecking] = useState(true);
  const [userLogged, setUserLogged] = useState<IUserLogged | null>(null);

  useEffect(() => {
    // simulate check login từ localStorage / async API
    const userLogged = storage.getUserLogged();
    setUserLogged(userLogged);
    setIsChecking(false);
  }, []);

  // ⏳ Trong lúc đang check → không render gì hết (hoặc show loading)
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // // ❌ Chưa login → redirect login
  if (!userLogged) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  // ✅ Nếu route không yêu cầu quyền → cho vào
  if (!requiredPermissions) {
    return element;
  }

  // // ✅ Nếu có yêu cầu quyền → check
  const isAllowed = hasPermission(requiredPermissions, options);
  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return element;
};

export default ProtectedRoute;
