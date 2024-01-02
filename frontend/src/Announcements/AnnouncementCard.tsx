import { Hyperlink } from "@fi-sci/misc";
import { Close } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { CSSProperties, FunctionComponent, useCallback, useState } from "react";

type AnnouncementCardProps = {
    width: number;
    title: string;
    description: string;
    author: string;
    editable: boolean;
    onDelete: () => void;
    onNewTitle: (newTitle: string) => void;
    onNewDescription: (newDescription: string) => void;
    isSelf: boolean;
}

const messageBubbleStyle: CSSProperties = {
    borderRadius: 25,
    backgroundColor: "#2196F3",
    padding: 5,
    color: 'white',
    fontSize: 11,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8
}

const messageBubbleSelfStyle: CSSProperties = {
    backgroundColor: "#4CAF50"
}

const authorStyle: CSSProperties = {
    fontSize: 11,
    paddingLeft: 15,
    marginTop: 10
}

const AnnouncementCard: FunctionComponent<AnnouncementCardProps> = ({ width, title, description, author, editable, onDelete, onNewTitle, onNewDescription, isSelf }) => {
    const [editing, setEditing] = useState(false);
    const rightButtonWidth = 40;
    const handleEditTitle = useCallback(() => {
        const newTitle = prompt('Enter new title', title || '');
        if (!newTitle) {
            return;
        }
        onNewTitle(newTitle);
    }, [onNewTitle, title]);
    const handleEditDescription = useCallback(() => {
        const newDescription = prompt('Enter new description', description || '');
        if (newDescription === null) {
            return;
        }
        onNewDescription(newDescription);
    }, [onNewDescription, description]);
    return (
        <div style={{position: 'relative', width}}>
            <div
                style={authorStyle}
            >
                {author}
            </div>
            <div
                style={{...messageBubbleStyle, ...(isSelf ? messageBubbleSelfStyle: {}), position: 'relative', left: 5, width: width - 10 - 30}}
            >

                {title}
                {
                    description && (
                        <div style={{color: 'yellow'}}>
                            {description}
                        </div>
                    )
                }
                {editable && (
                    <div style={{position: 'absolute', fontSize: 15, top: 0, left: width - rightButtonWidth, width: rightButtonWidth}} onClick={() => setEditing(e => !e)}>
                        ...
                    </div>
                )}
                {editing && (
                    <div>
                        <hr />
                        <Hyperlink onClick={onDelete} color="white">Delete</Hyperlink>&nbsp;|&nbsp;
                        <Hyperlink onClick={handleEditTitle} color="white">Edit title</Hyperlink>&nbsp;|&nbsp;
                        <Hyperlink onClick={handleEditDescription} color="white">Edit description</Hyperlink>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AnnouncementCard;