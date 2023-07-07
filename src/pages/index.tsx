import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Grid } from "@material-ui/core";
import FlashCardDialogs from "@/components/FlashcardDialogs";
import { IFlashcard } from "@/types/Flashcard";
import Flashcard from "@/components/Flashcard";
import {
  store,
  AppThunkDispatch,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";
import NavBar from "@/components/NavBar";
import {
  setDialogOpen,
  setEnglishText,
  setFlashcards,
  setPreviewFlashcard,
  setPreviewIndex,
  setSelectedFlashcard,
  setTurkishText,
} from "@/store/flashcardSlice";
import EntrancePage from "@/components/EntrancePage";

const FlashcardList = () => {
  const dispatch: AppThunkDispatch = useAppDispatch();
  const flashcards = useAppSelector((state) => state.flashcard.flashcards);
  const { data: session } = useSession();
  const previewFlashcard = store.getState().flashcard.previewFlashcard;

  const selectedFlashcard = useAppSelector(
    (state) => state.flashcard.selectedFlashcard
  );

  const apiUrl = "/api/flashcards";

  const handleAddFlashcard = async (newFlashcard: IFlashcard) => {
    try {
      if (!newFlashcard) return;
      else if (
        newFlashcard.englishText.length >= 2 &&
        newFlashcard.turkishText.length >= 2
      ) {
        await axios.post(apiUrl, newFlashcard, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        dispatch(setEnglishText(""));
        dispatch(setTurkishText(""));

        toast.success("Flash card is added");

        const response = await axios.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        const updatedFlashcards = response.data;

        dispatch(setFlashcards(updatedFlashcards));

        dispatch(
          setDialogOpen({ dialogName: "isAddDialogOpen", isOpen: false })
        );
      } else {
        toast.warn("Text must be at least 2 characters");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Flashcard with the same text already exists");
      }
      console.error("Error adding flashcard:", error.message);
    }
  };
  const handleUpdateFlashcard = async (updatedFlashcard: IFlashcard) => {
    try {
      if (!selectedFlashcard) return;
      else if (
        updatedFlashcard.englishText.length >= 2 &&
        updatedFlashcard.turkishText.length >= 2
      ) {
        await axios.patch(apiUrl, updatedFlashcard, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          withCredentials: true,
          params: { id: selectedFlashcard?._id },
        });
        const updatedFlashcards = flashcards.map((flashcard) =>
          flashcard === selectedFlashcard
            ? { ...flashcard, ...updatedFlashcard }
            : flashcard
        );

        dispatch(setFlashcards(updatedFlashcards));

        previewFlashcard &&
          dispatch(
            setPreviewFlashcard({
              ...updatedFlashcard,
              _id: selectedFlashcard._id,
            })
          );

        dispatch(setEnglishText(""));
        dispatch(setTurkishText(""));
        dispatch(
          setDialogOpen({ dialogName: "isEditDialogOpen", isOpen: false })
        );
      } else {
        toast.warn("Text must be at least 2 characters");
      }
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleDeleteFlashcard = async () => {
    try {
      if (!selectedFlashcard) return;
      await axios.delete(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        params: {
          id: selectedFlashcard?._id,
        },
      });
      const updatedFlashcards = flashcards.filter(
        (flashcard) => flashcard !== selectedFlashcard
      );
      toast.success("Flash card is removed.");
      dispatch(setFlashcards(updatedFlashcards));
      dispatch(setPreviewFlashcard(null));
      dispatch(
        setDialogOpen({ dialogName: "isDeleteDialogOpen", isOpen: false })
      );
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };
  const handlePreviewFlashcard = (direction: "next" | "previous") => {
    const currentIndex = store.getState().flashcard.previewIndex;
    const flashcards = store.getState().flashcard.flashcards;

    let newIndex: number;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % flashcards.length;
    } else {
      newIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    }
    const newFlashcard = flashcards[newIndex];
    dispatch(setPreviewIndex(newIndex));
    dispatch(setPreviewFlashcard(newFlashcard));
  };
  useEffect(() => {
    if (previewFlashcard) {
      dispatch(
        setDialogOpen({
          dialogName: "isPreviewDialogOpen",
          isOpen: true,
        })
      );
    }
  }, [previewFlashcard]);

  return (
    <div>
      <NavBar />

      {session ? (
        <>
          <Grid container spacing={2}>
            {flashcards &&
              flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Flashcard
                    flashcard={flashcard}
                    handleEdit={() => {
                      dispatch(setSelectedFlashcard(flashcard));
                      dispatch(setEnglishText(flashcard.englishText));
                      dispatch(setTurkishText(flashcard.turkishText));
                      dispatch(
                        setDialogOpen({
                          dialogName: "isEditDialogOpen",
                          isOpen: true,
                        })
                      );
                    }}
                    handleDelete={() => {
                      dispatch(setSelectedFlashcard(flashcard));
                      dispatch(
                        setDialogOpen({
                          dialogName: "isDeleteDialogOpen",
                          isOpen: true,
                        })
                      );
                    }}
                    handlePreview={() => {
                      dispatch(setPreviewFlashcard(flashcard));

                      dispatch(
                        setDialogOpen({
                          dialogName: "isPreviewDialogOpen",
                          isOpen: true,
                        })
                      );
                    }}
                    handleFlip={() => {
                      const updatedFlashcards = flashcards.map(
                        (flashcard, i) => {
                          if (i === index) {
                            return Object.assign({}, flashcard, {
                              flipped: !flashcard.flipped,
                            });
                          }
                          return flashcard;
                        }
                      );
                      dispatch(setFlashcards(updatedFlashcards));
                    }}
                  />
                </Grid>
              ))}
          </Grid>

          <FlashCardDialogs
            handleAddFlashcard={handleAddFlashcard}
            handleUpdateFlashcard={handleUpdateFlashcard}
            handleDeleteFlashcard={handleDeleteFlashcard}
            handlePreviewFlashcard={handlePreviewFlashcard}
            handleEdit={handleUpdateFlashcard}
            handleDelete={handleDeleteFlashcard}
          />
        </>
      ) : (
        <EntrancePage />
      )}
    </div>
  );
};

export default FlashcardList;
