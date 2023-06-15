import React, { useState } from "react";
import styles from "@/styles/custom.module.css";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Fullscreen,
} from "@material-ui/icons";
import { IFlashcard } from "@/types/Flashcard";
import { store } from "@/store/store";

interface Props {
  flashcard: IFlashcard;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleFlip?: () => void;
  handlePreview?: () => void;
}

const Flashcard: React.FC<Props> = ({
  flashcard,
  handleEdit,
  handleDelete,
  handleFlip,
  handlePreview,
}) => {
  const previewFlashcard = store.getState().flashcard.previewFlashcard;
  const { flipped, englishText, turkishText } = flashcard;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card className={styles.card}>
      <CardContent
        className={
          isHovered
            ? styles.cardContentWithHover
            : styles.cardContentWithoutHover
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "150px",
        }}
        onClick={handleFlip}
      >
        <Typography className={styles.cardText}>
          {flipped ? turkishText : englishText}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "flex-end" }}>
        {previewFlashcard ? (
          <>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={handlePreview}>
              <Fullscreen />
            </IconButton>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Flashcard;
