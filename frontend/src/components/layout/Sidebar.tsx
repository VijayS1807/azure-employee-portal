import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import type {} from "@mui/material/themeCssVarsAugmentation";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { matchPath, useLocation } from "react-router";
import SidebarContext from "../../context/SidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "../../utils/constants";
import SidebarPageItem from "./SidebarPageItem";
import SidebarHeaderItem from "./SidebarHeaderItem";
import SidebarDividerItem from "./SidebarDividerItem";
import {
  getDrawerSxTransitionMixin,
  getDrawerWidthTransitionMixin,
} from "../layout/Mixins";
import { storage } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";

const getRole = (): "Admin" | "Employee" | null => {
  const data = storage.getData();
  //console.log("Data from storage:", data);
  const roleName = data?.roleName;
  if (roleName === "Admin" || roleName === "Employee") {
    return roleName;
  }
  return null;
};

export interface SidebarProps {
  expanded?: boolean;
  setExpanded: (expanded: boolean) => void;
  disableCollapsibleSidebar?: boolean;
  container?: Element;
}

export default function Sidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}: SidebarProps) {
  const { roleId } = useAuth();

  const theme = useTheme();

  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>([]);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(false);

    return () => {};
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => {};
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded: boolean) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded],
  );

  const handlePageItemClick = React.useCallback(
    (itemId: string, hasNestedNavigation: boolean) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds((previousValue) =>
          previousValue.includes(itemId)
            ? previousValue.filter(
                (previousValueItemId) => previousValueItemId !== itemId,
              )
            : [...previousValue, itemId],
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport],
  );

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const getDrawerContent = React.useCallback(
    (viewport: "phone" | "tablet" | "desktop") => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            scrollbarGutter: mini ? "stable" : "auto",
            overflowX: "hidden",
            pt: !mini ? 0 : 2,
            ...(hasDrawerTransitions
              ? getDrawerSxTransitionMixin(isFullyExpanded, "padding")
              : {}),
          }}
        >
          <List
            dense
            sx={{
              padding: mini ? 0 : 0.5,
              mb: 4,
              width: mini ? MINI_DRAWER_WIDTH : "auto",
            }}
          >
            <SidebarHeaderItem>Main items</SidebarHeaderItem>
            {/* {role === "Admin" && ( */}
            {roleId === 1 && (
              <SidebarPageItem
                id="employees"
                title="Employees"
                icon={<PersonIcon />}
                href="/employee"
                selected={
                  !!matchPath("/employee/*", pathname) || pathname === "/"
                }
              />
            )}

            {roleId === 1 && (
              <SidebarPageItem
                id="reports"
                title="Reports"
                icon={<PersonIcon />}
                href="/report/createReport"
                selected={!!matchPath("/report/createReport", pathname)}
              />
            )}

            {roleId === 1 && (
              <SidebarPageItem
                id="reportDesigner"
                title="Report Designer"
                icon={<BarChartIcon />}
                href="/report/createReportDesign"
                selected={!!matchPath("/report/createReportDesign", pathname)}
              />
            )}

            {roleId === 1 && (
              <SidebarPageItem
                id="queryBuilder"
                title="Query Builder"
                icon={<LayersIcon />}
                href="/queryBuilder"
                selected={!!matchPath("/queryBuilder", pathname)}
              />
            )}
            {roleId === 1 && (
              <SidebarPageItem
                id="queryBuilderList"
                title="Saved Queries"
                icon={<DescriptionIcon />}
                href="/queryBuilder/list"
                selected={!!matchPath("/queryBuilder/list", pathname)}
              />
            )}

            <SidebarDividerItem />
            <SidebarHeaderItem>Leave items</SidebarHeaderItem>
            <SidebarPageItem
              id="leaves"
              title="Leave"
              icon={<EventNoteIcon />}
              href="/leaves"
              selected={!!matchPath("/leaves", pathname)}
              defaultExpanded={!!matchPath("/leaves", pathname)}
              expanded={expandedItemIds.includes("leaves")}
              nestedNavigation={
                <List
                  dense
                  sx={{
                    padding: 0,
                    my: 1,
                    pl: mini ? 0 : 1,
                    minWidth: 240,
                  }}
                >
                  {/* { role==="Employee" && ( */}
                  {roleId === 2 && (
                    <SidebarPageItem
                      id="apply leave"
                      title="Apply Leave"
                      icon={<DescriptionIcon />}
                      href="/leaves/apply"
                      selected={!!matchPath("/leaves/apply", pathname)}
                    />
                  )}
                  {/* {role === "Admin" && ( */}
                  {roleId === 1 && (
                    <SidebarPageItem
                      id="approveLeave"
                      title="Approve Leave"
                      //icon={<DescriptionIcon />}
                      icon={<EventAvailableIcon />}
                      href="/leaves/approve"
                      selected={!!matchPath("/leaves/approve", pathname)}
                    />
                  )}
                </List>
              }
            />
            {/* <SidebarPageItem
              id="integrations"
              title="Integrations"
              icon={<LayersIcon />}
              href="/integrations"
              selected={!!matchPath('/integrations', pathname)}
            /> */}
          </List>
        </Box>
      </React.Fragment>
    ),
    [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname],
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary: boolean) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

      return {
        displayPrint: "none",
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(expanded),
        ...(isTemporary ? { position: "absolute" } : {}),
        [`& .MuiDrawer-paper`]: {
          position: "absolute",
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundImage: "none",
          ...getDrawerWidthTransitionMixin(expanded),
        },
      };
    },
    [expanded, mini],
  );

  const sidebarContextValue = React.useMemo(() => {
    return {
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    };
  }, [
    handlePageItemClick,
    mini,
    isFullyExpanded,
    isFullyCollapsed,
    hasDrawerTransitions,
  ]);

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: "block",
            sm: disableCollapsibleSidebar ? "block" : "none",
            md: "none",
          },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent("phone")}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            sm: disableCollapsibleSidebar ? "none" : "block",
            md: "none",
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("tablet")}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent("desktop")}
      </Drawer>
    </SidebarContext.Provider>
  );
}
