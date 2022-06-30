import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import startCase from "lodash/startCase";

const parseFiltersToParams = (filtersObj) => {
  let filterParams = "";

  Object.entries(filtersObj).forEach((keyValue) => {
    const key = keyValue[0];
    let value = keyValue[1];

    if (Array.isArray(value) && value.length) {
      const parsedValue = value.map((filterObj) => filterObj.value);
      value = parsedValue.join();
    }

    if (value && !Array.isArray(value)) {
      if (!filterParams.length) {
        filterParams += `?${key}=${value}`;
      } else {
        filterParams += `&${key}=${value}`;
      }
    }
  });

  return filterParams;
};

const arrayObjFrom = (str = "") => {
  return str
    ? str.split(",").map((el) => ({
        label: startCase(el || ""),
        value: el,
      }))
    : [];
};

const getFiltersFromURL = (urlQueryObj, filterName, defaultValue) => {
  const queryElValue = urlQueryObj[filterName];
  if (queryElValue === "true") {
    return true;
  }
  if (Array.isArray(defaultValue)) {
    return queryElValue
      ? arrayObjFrom(queryElValue)
      : arrayObjFrom(defaultValue.join(","));
  }
  if (typeof defaultValue === "string") {
    return queryElValue || defaultValue;
  }
  return defaultValue;
};

const updateURLFilters = (
  pathname,
  history,
  filters,
  latestURLFilters,
  setLatestURLFilters
) => {
  const urlParams = parseFiltersToParams(filters);
  if (urlParams !== latestURLFilters) {
    history.push(`${pathname}${urlParams}`);
    setLatestURLFilters(urlParams);
  }
};

const useURLFilters = () => {
  const [latestURLFilters, setLatestURLFilters] = useState("");
  const { pathname, search } = useLocation();
  const history = useHistory();

  const urlQueryObj = Object.fromEntries(new URLSearchParams(search));

  const setURLFilters = (filters) => {
    return updateURLFilters(
      pathname,
      history,
      filters,
      latestURLFilters,
      setLatestURLFilters
    );
  };
  const getURLFilter = (filterName, defaultValue) => {
    return getFiltersFromURL(urlQueryObj, filterName, defaultValue);
  };

  return [getURLFilter, setURLFilters];
};

export default useURLFilters;
