import React, { useEffect, useState, useCallback, useRef } from "react";
import { Select, Spin, Button, type SelectProps } from "antd";

// ====== CONFIG MẶC ĐỊNH ======
const DEFAULT_PAGE_START = 0; // page bắt đầu cho backend
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_DEBOUNCE_DELAY = 300;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface LazySelectProps<T>
  extends Omit<
    SelectProps<string>,
    "options" | "onChange" | "value" | "onSearch"
  > {
  fetchFn: (params: {
    page: number;
    size: number;
    keyword?: string;
  }) => Promise<T[]>;
  renderOption: (item: T) => { label: React.ReactNode; value: string };
  pageSize?: number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  preloadOptions?: { label: React.ReactNode; value: string }[]; // ✅ thêm preloadOptions
}

function LazySelect<T>({
  fetchFn,
  renderOption,
  pageSize = DEFAULT_PAGE_SIZE,
  value,
  onChange,
  placeholder,
  preloadOptions = [], // default empty array
  ...rest
}: LazySelectProps<T>) {
  const [options, setOptions] = useState<
    { label: React.ReactNode; value: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchValue, DEFAULT_DEBOUNCE_DELAY);
  const loadingRef = useRef(false);
  const [, forceRender] = useState({});

  const pageRef = useRef(DEFAULT_PAGE_START);
  const hasMoreRef = useRef(true);

  const loadData = useCallback(
    async (currentPage: number, keyword?: string, reset = false) => {
      if (loadingRef.current || (!hasMoreRef.current && !reset)) return;

      loadingRef.current = true;
      forceRender({});

      setError(null);
      try {
        const data = await fetchFn({
          page: currentPage,
          size: pageSize,
          keyword,
        });

        const newOptions = data.map(renderOption);

        setOptions((prev) => {
          const merged = reset
            ? newOptions
            : [
                ...prev,
                ...newOptions.filter(
                  (n) => !prev.some((p) => p.value === n.value)
                ),
              ];
          return merged;
        });

        const stillHasMore = data.length === pageSize;
        hasMoreRef.current = stillHasMore; // ✅ update ref

        pageRef.current = currentPage + 1; // ✅ update page
      } catch (err) {
        console.error("Fetch error", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        hasMoreRef.current = false; // ✅ update ref khi lỗi
      } finally {
        loadingRef.current = false;
        forceRender({});
      }
    },
    [fetchFn, pageSize, renderOption] // ✅ bỏ hasMore khỏi deps
  );

  const handleSearch = (val: string) => {
    console.log("val: ", val);
    pageRef.current = DEFAULT_PAGE_START; // ✅ reset page
    hasMoreRef.current = true; // ✅ reset hasMore
    setSearchValue(val);
    setError(null);
  };

  const handleRetry = () => {
    pageRef.current = DEFAULT_PAGE_START; // ✅ reset page
    hasMoreRef.current = true; // ✅ reset hasMore
    setError(null);
    loadData(DEFAULT_PAGE_START, debouncedSearch, true);
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (error) return;
    const target = e.currentTarget;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 50) {
      loadData(pageRef.current, debouncedSearch); // ✅ dùng ref thay vì state
    }
  };

  // Merge preloadOptions vào options khi mount
  useEffect(() => {
    if (preloadOptions.length > 0) {
      setOptions(preloadOptions);
    }
  }, [preloadOptions]);

  // Load page đầu tiên hoặc search
  useEffect(() => {
    loadData(DEFAULT_PAGE_START, debouncedSearch, true);
  }, [debouncedSearch, loadData]);

  // Fix vấn đề overscroll của AntD Select dropdown:
  // Khi scroll tới đầu hoặc cuối dropdown, event wheel không bị bubble lên body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dropdowns = document.querySelectorAll<HTMLDivElement>(
        ".ant-select-dropdown"
      );
      dropdowns.forEach((dropdown) => {
        if ((dropdown as any).__wheelFixed) return;

        const onWheel = (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const delta = e.deltaY;
          const atTop = target.scrollTop === 0 && delta < 0;
          const atBottom =
            target.scrollTop + target.clientHeight === target.scrollHeight &&
            delta > 0;
          if (atTop || atBottom) e.preventDefault();
        };

        dropdown.addEventListener("wheel", onWheel, { passive: false });
        (dropdown as any).__wheelFixed = true;
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: "100%" }}
      filterOption={false}
      options={options}
      notFoundContent={
        loadingRef.current ? (
          <Spin size="small" />
        ) : error ? (
          <div style={{ color: "red", padding: 8 }}>
            {error}{" "}
            <Button size="small" type="link" onClick={handleRetry}>
              Thử lại
            </Button>
          </div>
        ) : options.length === 0 ? (
          <div style={{ color: "#999", padding: 8 }}>Không có dữ liệu</div>
        ) : null
      }
      onPopupScroll={handlePopupScroll}
      onSearch={handleSearch}
      styles={{
        popup: {
          root: {
            maxHeight: 300,
            overflow: "auto",
            overscrollBehavior: "none",
          },
        },
      }}
      getPopupContainer={(trigger) => trigger.parentElement!}
      {...rest}
    />
  );
}

export default LazySelect;
