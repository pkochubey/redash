import { useCallback, useState } from "react";
import localOptions from "@/lib/localOptions";
import { get, extend } from "lodash";

function isAutoLimitAvailable(dataSource) {
  const isSupportAutoLimit = get(dataSource, "supports_auto_limit", false)

  if (dataSource == null){
    return isSupportAutoLimit
  }

  const oldApplyAutoLimit = localOptions.get("applyAutoLimit", true);

  localOptions.set("applyAutoLimit", isSupportAutoLimit);

  if (isSupportAutoLimit && !oldApplyAutoLimit){
    localOptions.set("applyAutoLimit", oldApplyAutoLimit);
  }

  return isSupportAutoLimit;
}

export default function useAutoLimitFlags(dataSource, query, setQuery) {
  const isAvailable = isAutoLimitAvailable(dataSource);
  const [isChecked, setIsChecked] = useState(query.options.apply_auto_limit);
  query.options.apply_auto_limit = isChecked;

  const setAutoLimit = useCallback(
    state => {
      setIsChecked(state);
      localOptions.set("applyAutoLimit", state);
      setQuery(extend(query.clone(), { options: { ...query.options, apply_auto_limit: state } }));
    },
    [query, setQuery]
  );

  return [isAvailable, isChecked, setAutoLimit];
}
