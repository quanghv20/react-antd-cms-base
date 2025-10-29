// src/contexts/LoadingContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

interface LoadingContextType {
  loading: boolean;
  openAppLoading: () => void;
  closeAppLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  openAppLoading: () => {},
  closeAppLoading: () => {},
});

export const useAppLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const openAppLoading = () => setLoading(true);
  const closeAppLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider
      value={{ loading, openAppLoading, closeAppLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
