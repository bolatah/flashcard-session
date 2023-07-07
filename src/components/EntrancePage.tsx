import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
}));

const EntrancePage = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        maxWidth="600px"
        padding="32px"
      >
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to Flashcard Session
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Sign in / Log in and Create Personalized Flashcards to Enhance Your
          Learning
        </Typography>
      </Box>
    </Box>
  );
};

export default EntrancePage;
