// import { Box } from "@mui/material";

// export default function QueryRow({ children }: any) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 1,
//         //marginTop: 1,
//         alignItems: "center",
//         flexWrap: "wrap",

//         "& .qb-field": {
//           minWidth: 220,
//           flex: "1 1 220px",
//         },

//         "& .qb-operator": {
//           width: 80,
//         },

//         "& .qb-value": {
//           minWidth: 140,
//           flex: "1 1 140px",
//         },

//         "& .qb-condition": {
//           width: 90,
//         },

//         "& .qb-direction": {
//           width: 100,
//         },
//       }}
//     >
//       {children}
//     </Box>
//   );
// }

////////

import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";

export default function QueryRow({ children, hasError, autoFocus }: any) {
  const ref = useRef<HTMLDivElement>(null);

  // ✅ Auto scroll to first error
  useEffect(() => {
    if (hasError && autoFocus && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      ref.current.focus?.();
    }
  }, [hasError, autoFocus]);

  return (
    // <div
    //   ref={ref}
    //   tabIndex={-1}
    //   className={`qb-row ${hasError ? "qb-row-error" : ""}`}
    // >
    <Box
      ref={ref}
      tabIndex={-1}
      sx={{
        display: "flex",
        gap: 1,
        //marginTop: 1,
        alignItems: "center",
        flexWrap: "wrap",

        "& .qb-field": {
          minWidth: 220,
          flex: "1 1 220px",
        },

        "& .qb-operator": {
          width: 80,
        },

        "& .qb-value": {
          minWidth: 140,
          flex: "1 1 140px",
        },

        "& .qb-condition": {
          width: 90,
        },

        "& .qb-direction": {
          width: 100,
        },
      }}
    >
      {children}
    </Box>
    // </div>
  );
}
