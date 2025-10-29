import { useCallback, useEffect, useState } from "react";

type HasPermissionOptions = {
  /** true = user cần có tất cả permissions; false (default) = cần có ít nhất 1 */
  all?: boolean;
};

type UseHasPermissionReturn = {
  hasPermission: (
    required: string | string[],
    options?: HasPermissionOptions
  ) => boolean;
  permissions: string[];
  refresh: () => void;
};

function readPermissionsFromLocalStorage(): string[] {
  try {
    const userLogged = JSON.parse(localStorage.getItem("USER_LOGGED") || "{}");
    return Array.isArray(userLogged.permissions) ? userLogged.permissions : [];
  } catch {
    return [];
  }
}

export default function useHasPermission(): UseHasPermissionReturn {
  const [permissions, setPermissions] = useState<string[]>(() =>
    readPermissionsFromLocalStorage()
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "USER_LOGGED") {
        setPermissions(readPermissionsFromLocalStorage());
      }
    };

    const handleCustom = () =>
      setPermissions(readPermissionsFromLocalStorage());

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "userPermissionsChanged",
      handleCustom as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "userPermissionsChanged",
        handleCustom as EventListener
      );
    };
  }, []);

  const refresh = useCallback(() => {
    setPermissions(readPermissionsFromLocalStorage());
  }, []);

  const hasPermission = useCallback(
    (
      required: string | string[],
      options: HasPermissionOptions = { all: false }
    ) => {
      // ✅ SUPER_ADMIN có toàn quyền
      if (permissions.includes("SUPER_ADMIN")) return true;

      const req = Array.isArray(required) ? required : [required];
      if (req.length === 0) return true;

      if (options.all) {
        return req.every((r) => permissions.includes(r));
      }
      return req.some((r) => permissions.includes(r));
    },
    [permissions]
  );

  return { hasPermission, permissions, refresh };
}
