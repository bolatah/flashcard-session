import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Add, ViewList, Search, ExitToApp } from "@material-ui/icons";
import { AppBar, Toolbar, TextField } from "@material-ui/core";
import axios from "axios";
import { toast } from "react-toastify";
import { signInInstance, signOutInstance } from "@/store/authSlice";
import styles from "@/styles/custom.module.css";
import {
  setDialogOpen,
  setFlashcards,
  setSearchText,
} from "@/store/flashcardSlice";
import {
  AppThunkDispatch,
  useAppDispatch,
  useAppSelector,
} from "@/store/store";

const LockOpen = dynamic(() => import("@material-ui/icons/LockOpen"), {
  ssr: false,
});

const Button = dynamic(() => import("@material-ui/core/Button"), {
  ssr: false,
});

const NavBar = () => {
  const dispatch: AppThunkDispatch = useAppDispatch();
  const session = useSession();
  const flashcards = useAppSelector((state) => state.flashcard.flashcards);
  const searchText = useAppSelector((state) => state.flashcard.searchText);
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const apiUrl = "/api/flashcards";

  const handleShowFlashcards = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        withCredentials: true,
      });
      if (res.status === 204) {
        toast.info("There is no flashcard to display");
      }
      dispatch(setFlashcards(res.data));
    } catch (error: any) {
      console.error("Error fetching flashcards:", error.message);
    }
  };

  const handleSearchFlashcard = (searchText: string) => {
    if (flashcards.length > 0) {
      const filteredFlashcards = flashcards.filter(
        (flashcard) =>
          flashcard.englishText
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          flashcard.turkishText.toLowerCase().includes(searchText.toLowerCase())
      );
      filteredFlashcards && dispatch(setFlashcards(filteredFlashcards));
    } else {
      toast.info("There is no flashcard to display");
    }
  };

  const handleAddButtonClick = () => {
    dispatch(
      setDialogOpen({
        dialogName: "isAddDialogOpen",
        isOpen: true,
      })
    );
  };

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenWidth);
    updateScreenWidth();
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  return (
    <>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar className={styles.toolbar}>
          {session && session.status === "authenticated" ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddButtonClick}
              >
                {screenWidth && screenWidth > 600 ? "Add Flashcard" : ""}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ViewList />}
                onClick={handleShowFlashcards}
              >
                {screenWidth && screenWidth > 600 ? "Show Flashcards" : ""}
              </Button>
              <TextField
                className={styles["searchTextField"]}
                label={screenWidth && screenWidth > 600 ? "Search" : ""}
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchFlashcard(searchText);
                  }
                }}
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
              <Button
                href={`/api/auth/signout`}
                variant="contained"
                color="secondary"
                startIcon={<ExitToApp />}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(signOutInstance());
                }}
              >
                {screenWidth && screenWidth > 600 ? "Logout" : ""}
              </Button>
            </>
          ) : (
            <Button
              href={`/api/auth/signin`}
              variant="contained"
              color="primary"
              startIcon={<LockOpen />}
              onClick={(e) => {
                e.preventDefault();
                dispatch(signInInstance());
                dispatch(setFlashcards([]));
              }}
            >
              Log in / Sign in
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
