import React, { forwardRef, useCallback } from "react";

import { Button, Card, Drawer, Fab, Grid, Typography } from "@mui/material";
import {
  CreateNewFolder as CreateNewFolderIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { createFolder, processUploadQueue, uploadQueue } from "./app/transfer";

function IconCaptionButton({
  icon,
  caption,
  onClick,
}: {
  icon: React.ReactNode;
  caption: string;
  onClick?: () => void;
}) {
  return (
    <Button
      color="inherit"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      {icon}
      <Typography
        variant="caption"
        sx={{ textTransform: "none", textWrap: "nowrap" }}
      >
        {caption}
      </Typography>
    </Button>
  );
}

export const UploadFab = forwardRef<HTMLButtonElement, { onClick: () => void }>(
  function ({ onClick }, ref) {
    return (
      <Fab
        ref={ref}
        variant="circular"
        color="primary"
        size="large"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          color: "white",
        }}
        onClick={onClick}
      >
        <UploadIcon fontSize="large" />
      </Fab>
    );
  }
);

function UploadDrawer({
  open,
  setOpen,
  cwd,
  onUpload,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cwd: string;
  onUpload: () => void;
}) {
  const handleUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async () => {
      if (!input.files) return;
      const files = Array.from(input.files);
      uploadQueue.push(...files.map((file) => ({ file, basedir: cwd })));
      await processUploadQueue();
      setOpen(false);
      onUpload();
    };
    input.click();
  }, [cwd, onUpload, setOpen]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ sx: { borderRadius: "16px 16px 0 0" } }}
    >
      <Card sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <IconCaptionButton
              icon={<UploadIcon fontSize="large" />}
              caption="Upload"
              onClick={handleUpload}
            />
          </Grid>
          <Grid item xs={3}>
            <IconCaptionButton
              icon={<CreateNewFolderIcon fontSize="large" />}
              caption="Create Folder"
              onClick={async () => {
                setOpen(false);
                await createFolder(cwd);
                onUpload();
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Drawer>
  );
}

export default UploadDrawer;
