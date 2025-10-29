import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import { ForbiddenPage, LoginPage } from "./pages";
import { ConfigProvider, Spin, theme } from "antd";
import { MessageHolder } from "./utils/message";
import { LoadingProvider, useAppLoading } from "./context/LoadingContext";
import { PATH } from "./routes/path";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useEffect, useState } from "react";
import type { ThemeConfig } from "antd/es/config-provider/context";

// ----------------- AppContent -----------------
function AppContent() {
  const { loading } = useAppLoading();

  return (
    <>
      <Spin
        spinning={loading}
        size="large"
        style={{
          color: "#fff",
          position: "fixed",
          top: 60,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999999,
        }}
        wrapperClassName="app-loading-spin"
      >
        {/* Global message */}
        <MessageHolder />
        <Routes>
          <Route path={PATH.LOGIN} element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          <Route path="/" element={<ProtectedRoute element={<MainLayout />} />}>
            {ROUTES.map((route) =>
              route.path === "/" ? (
                <Route key={route.key} index element={<route.element />} />
              ) : (
                <Route
                  key={route.key}
                  path={route.path.slice(1)}
                  element={<route.element />}
                />
              )
            )}
          </Route>
        </Routes>
      </Spin>
    </>
  );
}

// ----------------- App (root) -----------------
function App() {
  const [primaryColor, setPrimaryColor] = useState("#ffb547");

  // Cập nhật CSS variables để bạn có thể dùng trong file CSS / Tailwind
  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--primary-color-hover",
      "#ffc066"
    );
    document.documentElement.style.setProperty(
      "--primary-color-active",
      "#e6a33d"
    );
    document.documentElement.style.setProperty(
      "--primary-color-shadow",
      "rgba(255, 181, 71, 0.25)"
    );
  }, [primaryColor]);

  // Cấu hình theme Ant Design
  const themeConfig: ThemeConfig = {
    token: {
      colorPrimary: primaryColor,
    },
    algorithm: theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <LoadingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LoadingProvider>
    </ConfigProvider>
  );
}

export default App;
