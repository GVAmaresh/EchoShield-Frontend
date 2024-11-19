import React from "react";

import { Typography, Popover, Box } from "@mui/material";

type NavCompProps = {
    logo: React.ReactNode;
  str: string;
};

export default function NavComp({ logo, str }: NavCompProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };


  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

     

      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ cursor: "pointer", fontWeight: "bold" }}
      >
         {logo}
      </Typography>

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{str}</Typography>
      </Popover>
    </Box>
  );
}
