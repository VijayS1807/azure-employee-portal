import { createContext, useContext, useEffect, useState } from "react";
import {
  getReferenceData,
  EMPTY_REFERENCE_DATA,
  type ReferenceData,
} from "../api/reference.api";

type ReferenceContextType = {
  referenceData: ReferenceData;
};

const ReferenceContext = createContext<ReferenceContextType>({
  referenceData: EMPTY_REFERENCE_DATA,
});

export const ReferenceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [referenceData, setReferenceData] =
    useState<ReferenceData>(EMPTY_REFERENCE_DATA);

  useEffect(() => {
    getReferenceData()
      .then(setReferenceData)
      .catch(() => {
        // API unreachable — defaults stay in place
      });
  }, []);

  return (
    <ReferenceContext.Provider value={{ referenceData }}>
      {children}
    </ReferenceContext.Provider>
  );
};

export const useReference = () => useContext(ReferenceContext);
