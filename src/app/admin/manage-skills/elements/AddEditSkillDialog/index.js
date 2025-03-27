import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { editItemSelector } from "@/store/features/common/selectors";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";

const AddEditSkillDialog = ({
  openDialog,
  handleCloseDialog,
  handleSaveSkill,
  editIndex,
}) => {
  const editItem = useSelector(editItemSelector);

  const formik = useFormik({
    initialValues: {
      skillName: editItem?.title || editItem?.skillName || "",
    },
    validationSchema: Yup.object({
      skillName: Yup.string()
        .required("Skill name is required")
        .min(3, "Skill name must be at least 3 characters")
        .max(50, "Skill name can't be longer than 50 characters"),
    }),
    onSubmit: (values) => {
      handleSaveSkill(values);
    },
  });

  useEffect(() => {
    formik.setFieldValue("skillName", editItem?.name || editItem?.skillName || "");
  }, [editItem, openDialog]);

  useEffect(() => {
    if (!openDialog) {
      formik?.resetForm();
    }
  }, [openDialog]);

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1D2126",
          borderRadius: "16px",
          width: 450,
          padding: "20px",
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle className="text-white text-center font-semibold text-xl">
          {editItem ? "Edit Skill" : "Add New Skill"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "10px !important" }}>
          <TextField
            fullWidth
            label="Skill Name"
            name="skillName"
            value={formik.values.skillName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.skillName && Boolean(formik.errors.skillName)}
            helperText={formik.touched.skillName && formik.errors.skillName}
            InputProps={{
              style: {
                backgroundColor: "#1D2126",
                color: "white",
                borderRadius: "12px",
                padding: "10px",
              },
            }}
            sx={{ marginBottom: 3 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: "10px" }}>
          <Button
            onClick={handleCloseDialog}
            size="medium"
            padding="10px 20px"
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="medium"
            padding="10px 20px"
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
          >
            {!editItem ? "Save" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditSkillDialog;
