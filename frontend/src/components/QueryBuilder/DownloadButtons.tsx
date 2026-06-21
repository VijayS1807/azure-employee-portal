import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { exportCSV, exportExcel, exportPDF } from "../../utils/exportUtils";
import DownloadIcon from "@mui/icons-material/Download";
import { runQuery as runQueryBuild } from "../../api/query.api";

export const DownloadMenuOptions = ({ row }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton> */}

      <Button
        disabled={row.length === 0}
        //variant="text"
        //variant="contained"
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleOpen}
      >
        Download
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            //handleDownload(row);
            handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            onClick={() => exportExcel(row, "Report")}
          >
            Export Excel
          </Button>
        </MenuItem>

        <MenuItem
          onClick={() => {
            //handleDownloadPdf(row);
            handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            onClick={() => exportPDF(row, "Report")}
          >
            Export PDF
          </Button>
        </MenuItem>

        <MenuItem
          onClick={() => {
            //handleDownloadCsv(row);
            handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            onClick={() => exportCSV(row, "Report")}
          >
            Export CSV
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  row: any;
  onClose: () => void;
};

export function DownloadMenuOptionsInList({
  anchorEl,
  open,
  row,
  onClose,
}: Props) {
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const open = Boolean(anchorEl);

  // const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      {/* <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton> */}

      {/* <Button
        disabled={row.length === 0}
        //variant="text"
        //variant="contained"
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleOpen}
      >
        Download
      </Button> */}

      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
          onClick={() => {
            //handleDownload(row);
            //handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            // onClick={() => {
            //   const data = await runQueryBuild(row);;
            //   exportExcel(data, "Report")
            // }
            // }
            onClick={() => handleDownload(row.queryModel, "excel")}
          >
            Export Excel
          </Button>
        </MenuItem>

        <MenuItem
          onClick={() => {
            //handleDownloadPdf(row);
            //handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            onClick={() => handleDownload(row.queryModel, "pdf")}
          >
            Export PDF
          </Button>
        </MenuItem>

        <MenuItem
          onClick={() => {
            //handleDownloadCsv(row);
            //handleClose();
          }}
        >
          <Button
            variant="outlined"
            //disabled={row.length === 0}
            onClick={() => handleDownload(row.queryModel, "csv")}
          >
            Export CSV
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}

const handleDownload = async (row: any, type: "excel" | "pdf" | "csv") => {
  try {
    const data = await runQueryBuild(row);

    switch (type) {
      case "excel":
        exportExcel(data, "Report");
        break;

      case "pdf":
        exportPDF(data, "Report");
        break;

      case "csv":
        exportCSV(data, "Report");
        break;
    }
  } catch (error) {
    console.error("Download failed:", error);
  }
};
