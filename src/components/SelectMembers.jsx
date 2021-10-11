import { React, useEffect, useState, useRef, useCallback } from "react";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { API_URL } from "../constants";

const textField = "name";
const keyField = "id";
const emptyItem = {
  [textField]: "loading ...",
};
const pageSize = 5;
const loadingData = [];

while (loadingData.length < pageSize) {
  loadingData.push({ ...emptyItem });
}

const init = {
  method: "GET",
  accept: "application/json",
  credentials: "include",
};

const SelectMembers = (props) => {
  let OnMembersChange = props.onMembersChange;
  const dataCaching = useRef([]);
  const pendingRequest = useRef();
  const requestStarted = useRef(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState(props.value);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const skipRef = useRef(0);

  const resetCache = () => {
    dataCaching.current.length = 0;
  };

  const requestData = useCallback((skip, filter) => {
    if (requestStarted.current) {
      clearTimeout(pendingRequest.current);
      pendingRequest.current = setTimeout(() => {
        requestData(skip, filter);
      }, 50);
      return;
    }

    const url = `${API_URL}/api/users?q=${filter}&skip=${skip}&top=${pageSize}&count=true`;
    requestStarted.current = true;

    fetch(url, init)
      .then((response) => response.json())
      .then((json) => {
        const total = json["count"];
        const items = [];

        if (total > 0) {
          json.data.forEach((element, index) => {
            const item = {
              id: element.id,
              name: element.profile.name ?? element.username,
            };
            items.push(item);
            dataCaching.current[index + skip] = item;
          });
        }
        if (skip === skipRef.current) {
          setData(items);
          setTotal(total);
        }
        requestStarted.current = false;
      });
  }, []);

  useEffect(() => {
    requestData(0, filter);
    return () => {
      resetCache();
    };
  }, [filter, requestData]);

  const onFilterChange = useCallback(
    (event) => {
      const filter = event.filter.value;
      resetCache();
      requestData(0, filter);
      setData(loadingData);
      skipRef.current = 0;
      setFilter(filter);
    },
    [requestData]
  );

  const shouldRequestData = useCallback((skip) => {
    for (let i = 0; i < pageSize; i++) {
      if (!dataCaching.current[skip + i]) {
        return true;
      }
    }
    return false;
  }, []);

  const getCachedData = useCallback((skip) => {
    const data = [];

    for (let i = 0; i < pageSize; i++) {
      data.push(dataCaching.current[i + skip] || { ...emptyItem });
    }

    return data;
  }, []);

  const pageChange = useCallback(
    (event) => {
      const newSkip = event.page.skip;

      if (shouldRequestData(newSkip)) {
        requestData(newSkip, filter);
      }

      const data = getCachedData(newSkip);
      setData(data);
      skipRef.current = newSkip;
    },
    [filter, getCachedData, requestData, shouldRequestData]
  );

  const onChange = useCallback((event) => {
    OnMembersChange(event);

    const value = event.target.value;

     if (value && value[textField] === emptyItem[textField]) {
      return;
    }
    setValue(value);
  }, [OnMembersChange]);

  return (
    <MultiSelect
      data={data}
      value={value}
      onChange={onChange}
      dataItemKey={keyField}
      textField={textField}
      filterable={true}
      onFilterChange={onFilterChange}
      virtual={{
        pageSize: pageSize,
        skip: skipRef.current,
        total: total,
      }}
      onPageChange={pageChange}
      placeholder="Add members..."
    />
  );
};

export default SelectMembers;
