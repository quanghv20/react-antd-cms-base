import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes";
import { ForbiddenPage, LoginPage } from "./pages";
import { ConfigProvider, Spin } from "antd";
import { MessageHolder } from "./utils/message";
import { LoadingProvider, useAppLoading } from "./context/LoadingContext";
import { PATH } from "./routes/path";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

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
        ;
      </Spin>
    </>
  );
}

function App() {
  return (
    <ConfigProvider>
      <LoadingProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LoadingProvider>
    </ConfigProvider>
  );
}

export default App;
