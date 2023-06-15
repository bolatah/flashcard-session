import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import Flashcard from "./Flashcard";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import {
  AppThunkDispatch,
  store,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import {
  setDialogOpen,
  setEnglishText,
  setTurkishText,
  setSelectedFlashcard,
  setPreviewFlashcard,
} from "@/store/flashcardSlice";
import { IFlashcard } from "@/types/Flashcard";
import { makeStyles } from "@material-ui/core/styles";

interface IFlashDialogsProps {
  handleAddFlashcard?: (newFlashcard: IFlashcard) => void;
  handleUpdateFlashcard?: (updatedFlashcard: IFlashcard) => void;
  handleDeleteFlashcard?: () => void;
  handlePreviewFlashcard?: (direction: "next" | "previous") => void;
  handleEdit?: (updatedFlashcard: IFlashcard) => void;
  handleDelete?: () => void;
  handleFlip?: () => void;
}

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px", // Adjust the width as needed
    minHeight: "300px", // Adjust the height as needed
  },
});

const FlashCardDialogs: React.FC<IFlashDialogsProps> = ({
  handleAddFlashcard,
  handleUpdateFlashcard,
  handleDeleteFlashcard,
  handlePreviewFlashcard,
  handleDelete,
  handleEdit,
  handleFlip,
}) => {
  const dispatch: AppThunkDispatch = useAppDispatch();

  const { englishText, turkishText } = useAppSelector(
    (state) => state.flashcard
  );
  const previewFlashcard = store.getState().flashcard.previewFlashcard;
  const flashcards = useAppSelector((state) => state.flashcard.flashcards);

  const {
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isPreviewDialogOpen,
  } = useAppSelector((state) => state.flashcard.dialogs);

  const classes = useStyles();

  const closeAddDialog = () => {
    dispatch(setEnglishText(""));
    dispatch(setTurkishText(""));
    dispatch(setDialogOpen({ dialogName: "isAddDialogOpen", isOpen: false }));
  };

  const closeEditDialog = () => {
    dispatch(setSelectedFlashcard(null));
    dispatch(setEnglishText(""));
    dispatch(setTurkishText(""));
    dispatch(setDialogOpen({ dialogName: "isEditDialogOpen", isOpen: false }));
  };

  const closeDeleteDialog = () => {
    dispatch(setSelectedFlashcard(null));
    dispatch(
      setDialogOpen({ dialogName: "isDeleteDialogOpen", isOpen: false })
    );
  };

  const closePreviewDialog = () => {
    dispatch(setSelectedFlashcard(null));
    dispatch(setPreviewFlashcard(null));
    dispatch(
      setDialogOpen({ dialogName: "isPreviewDialogOpen", isOpen: false })
    );
  };

  return (
    <>
      {/* Add Flashcard Dialog */}
      <Dialog open={isAddDialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Add Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="EnglishText"
            value={englishText}
            onChange={(e) => dispatch(setEnglishText(e.target.value))}
            fullWidth
          />
          <TextField
            margin="dense"
            label="TurkishText"
            value={turkishText}
            onChange={(e) => dispatch(setTurkishText(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddFlashcard &&
                handleAddFlashcard({
                  englishText,
                  turkishText,
                } as IFlashcard);
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Flashcard Dialog */}
      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="EnglishText"
            value={englishText}
            onChange={(e) => dispatch(setEnglishText(e.target.value))}
            fullWidth
          />
          <TextField
            margin="dense"
            label="TurkishText"
            value={turkishText}
            onChange={(e) => dispatch(setTurkishText(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleUpdateFlashcard &&
              handleUpdateFlashcard({ englishText, turkishText } as IFlashcard)
            }
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Flashcard Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Flashcard</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this flashcard?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFlashcard} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Flashcard Dialog */}
      <Dialog
        open={isPreviewDialogOpen}
        onClose={closePreviewDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Preview Flashcard</DialogTitle>
        <DialogContent>
          {previewFlashcard && (
            <Flashcard
              flashcard={previewFlashcard}
              handleEdit={() => {
                dispatch(setSelectedFlashcard(previewFlashcard));
                dispatch(setEnglishText(previewFlashcard.englishText));
                dispatch(setTurkishText(previewFlashcard.turkishText));
                dispatch(
                  setDialogOpen({
                    dialogName: "isEditDialogOpen",
                    isOpen: true,
                  })
                );
              }}
              handleDelete={() => {
                dispatch(setSelectedFlashcard(previewFlashcard));
                dispatch(
                  setDialogOpen({
                    dialogName: "isDeleteDialogOpen",
                    isOpen: true,
                  })
                );
              }}
              handleFlip={() => {
                const flippedPreviewFlashcard = {
                  ...previewFlashcard,
                  flipped: !previewFlashcard.flipped,
                };

                dispatch(setPreviewFlashcard(flippedPreviewFlashcard));
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() =>
              handlePreviewFlashcard && handlePreviewFlashcard("previous")
            }
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() =>
              handlePreviewFlashcard && handlePreviewFlashcard("next")
            }
          >
            <ArrowForward />
          </IconButton>
          <Button onClick={closePreviewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default FlashCardDialogs;
