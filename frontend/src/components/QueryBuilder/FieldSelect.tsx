// import { useMemo, useState } from "react";
// import { TextField, MenuItem } from "@mui/material";

// export default function FieldSelect({ value, onChange, columns, tables }: any) {
//   const [search, setSearch] = useState("");

//   const tableMap = useMemo(() => {
//     const map: any = {};

//     tables.forEach((t: any) => {
//       map[t.Id] = t.DisplayName || t.Name;
//     });

//     return map;
//   }, [tables]);

//   const grouped = useMemo(() => {
//     const map: any = {};

//     const filtered = columns.filter((c: any) =>
//       c.DisplayName.toLowerCase().includes(search.toLowerCase()),
//     );

//     filtered.forEach((c: any) => {
//       const key = tableMap[c.TableId] || "Others";

//       if (!map[key]) map[key] = [];

//       map[key].push(c);
//     });

//     return map;
//   }, [columns, search, tableMap]);

//   return (
//     <TextField
//       select
//       size="small"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       sx={{ minWidth: 200 }}
//     >
//       <MenuItem disabled>
//         <TextField
//           size="small"
//           placeholder="Search field..."
//           fullWidth
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </MenuItem>

//       {Object.keys(grouped).map((group) => [
//         <MenuItem key={group} disabled>
//           <b>{group}</b>
//         </MenuItem>,

//         grouped[group].map((c: any) => (
//           <MenuItem key={c.Id} value={c.Id}>
//             {c.DisplayName}
//           </MenuItem>
//         )),
//       ])}
//     </TextField>
//   );
// }

/////

// import { useMemo, useState } from "react";
// import { Autocomplete, TextField } from "@mui/material";

// export default function FieldSelect({ value, onChange, columns, tables }: any) {
//   const [inputValue, setInputValue] = useState("");

//   const tableMap = useMemo(() => {
//     const map: any = {};

//     tables.forEach((t: any) => {
//       map[t.Id] = t.DisplayName || t.Name;
//     });

//     return map;
//   }, [tables]);

//   const options = useMemo(() => {
//     return columns.map((c: any) => ({
//       id: c.Id,
//       label: c.DisplayName,
//       group: tableMap[c.TableId] || "Others",
//     }));
//   }, [columns, tableMap]);

//   const selected = options.find((o: any) => o.id === value) || null;

//   return (
//     <Autocomplete
//       value={selected}
//       inputValue={inputValue}
//       options={options}
//       groupBy={(option) => option.group}
//       getOptionLabel={(option) => option.label}
//       isOptionEqualToValue={(option, val) => option.id === val.id}
//       onInputChange={(event, newInputValue) => {
//         setInputValue(newInputValue);
//       }}
//       onChange={(event, newValue) => {
//         if (newValue) {
//           onChange(newValue.id);
//         }
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           placeholder="Select column..."
//           variant="outlined"
//         />
//       )}
//       sx={{
//         // minWidth: 240,

//         // "& .MuiInputBase-root": {
//         //   height: 54,
//         //   paddingTop: "4px",
//         //   paddingBottom: "4px",
//         // },

//         // "& .MuiAutocomplete-input": {
//         //   padding: "10px 8px !important",
//         // },

//         minWidth: 220,

//         "& .MuiInputBase-root": {
//           height: 36,
//         },

//         "& .MuiAutocomplete-input": {
//           padding: "6px 8px !important",
//         },
//       }}
//     />
//   );
// }

import { useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
export default function FieldSelect({
  value,
  onChange,
  columns,
  tables,
  className,
  error,
  helperText,
}: any) {
  const [inputValue, setInputValue] = useState("");

  const tableMap = useMemo(() => {
    const map: any = {};
    tables.forEach((t: any) => {
      map[t.Id] = t.DisplayName || t.Name;
    });
    return map;
  }, [tables]);

  const options = useMemo(() => {
    return columns.map((c: any) => ({
      id: c.Id,
      label: c.DisplayName,
      group: tableMap[c.TableId] || "Others",
    }));
  }, [columns, tableMap]);

  const selected = options.find((o: any) => o.id === value) || null;

  return (
    <Autocomplete
      // options={columns}
      // getOptionLabel={(o: any) => o.DisplayName || ""}
      // value={columns.find((c: any) => c.Id === value) || null}
      // onChange={(_, v) => onChange(v?.Id)}
      // renderInput={(params) => (
      //   <TextField
      //     {...params}
      //     size="small"
      //     error={!!error}
      //     helperText={error}
      //   />
      // )}

      size="small"
      value={selected}
      inputValue={inputValue}
      options={options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      onInputChange={(e, val) => setInputValue(val)}
      onChange={(e, val) => {
        if (val) onChange(val.id);
      }}
      className={className}
      // popupIcon={<ArrowDropDownIcon sx={{ fontSize: 16 }} />}
      // clearIcon={<CloseIcon sx={{ fontSize: 14 }} />}

      popupIcon={<ArrowDropDownIcon sx={{ fontSize: 18 }} />}
      clearIcon={<CloseIcon sx={{ fontSize: 16 }} />}
      forcePopupIcon
      // slotProps={{
      //   clearIndicator: {
      //     sx: {
      //       padding: 0,
      //       margin: 0,
      //       width: 20,
      //       height: 20,
      //     },
      //     disableRipple: true,
      //   },
      //   popupIndicator: {
      //     sx: {
      //       padding: 0,
      //       margin: 0,
      //       width: 20,
      //       height: 20,
      //     },
      //     disableRipple: true,
      //   },
      // }}
      slotProps={{
        clearIndicator: {
          sx: {
            width: 30, // 3 * 8 = 24px (MUI spacing unit)
            height: 30,
            mr: 0.5, // marginRight = 4px
          },
          disableRipple: true,
        },
        popupIndicator: {
          sx: {
            width: 30,
            height: 30,
            ml: 0.5, // marginLeft = 2px
          },
          disableRipple: true,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select column"
          error={!!error}
          helperText={helperText}
        />
      )}
      // sx={{
      //   "& .MuiInputBase-root": {
      //     height: 42,
      //     paddingRight: "8px",
      //   },

      //   "& .MuiAutocomplete-input": {
      //     padding: "10px 8px !important",
      //   },

      //   // // 🔥 reduce clickable area (clean UI)
      //   // "& .MuiAutocomplete-clearIndicator": {
      //   //   padding: 2,
      //   // },

      //   // "& .MuiAutocomplete-popupIndicator": {
      //   //   padding: 2,
      //   // },

      //   // 🔥 remove box around clear (X)
      //   "& .MuiAutocomplete-clearIndicator": {
      //     padding: 0,
      //     marginRight: 4,
      //     backgroundColor: "transparent",
      //     "&:hover": {
      //       backgroundColor: "transparent",
      //     },
      //   },

      //   // 🔥 remove box around dropdown arrow
      //   "& .MuiAutocomplete-popupIndicator": {
      //     padding: 0,
      //     backgroundColor: "transparent",
      //     "&:hover": {
      //       backgroundColor: "transparent",
      //     },
      //   },

      //   // 🔥 (optional) remove ripple effect completely
      //   "& .MuiButtonBase-root": {
      //     "&:hover": {
      //       backgroundColor: "transparent",
      //     },
      //   },
      // }}

      // sx={{
      //   "& .MuiAutocomplete-clearIndicator svg": {
      //     fontSize: "1.1rem",
      //   },
      //   "& .MuiAutocomplete-popupIndicator svg": {
      //     fontSize: "1.25rem",
      //   },

      //   "& .MuiAutocomplete-endAdornment": {
      //     right: 0.75, // 6px
      //     gap: 0.5, // 4px
      //   },
      // }}
      // sx={{
      //   "& .MuiInputBase-root": {
      //     height: 42,
      //     paddingRight: "8px",
      //   },

      //   "& .MuiAutocomplete-input": {
      //     padding: "10px 8px !important",
      //   },

      //   // 🔥 remove ALL button styling (box effect)
      //   "& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator":
      //     {
      //       padding: 0,
      //       margin: 0,
      //       borderRadius: 0,
      //       backgroundColor: "transparent !important",
      //     },

      //   // 🔥 remove hover + focus + ripple background
      //   "& .MuiAutocomplete-clearIndicator:hover, & .MuiAutocomplete-popupIndicator:hover":
      //     {
      //       backgroundColor: "transparent",
      //     },

      //   // 🔥 remove focus ring (this is often the “box” you see)
      //   "& .MuiAutocomplete-clearIndicator.Mui-focusVisible, & .MuiAutocomplete-popupIndicator.Mui-focusVisible":
      //     {
      //       backgroundColor: "transparent",
      //       outline: "none",
      //     },

      //   // 🔥 remove ripple completely
      //   "& .MuiTouchRipple-root": {
      //     display: "none",
      //   },

      //   // 🔥 shrink actual icon
      //   "& .MuiAutocomplete-clearIndicator svg": {
      //     fontSize: 16,
      //   },
      //   "& .MuiAutocomplete-popupIndicator svg": {
      //     fontSize: 18,
      //   },

      //   "& .MuiAutocomplete-clearIndicator:focus, & .MuiAutocomplete-popupIndicator:focus":
      //     {
      //       outline: "none",
      //     },
      // }}
    />
  );
}
