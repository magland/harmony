import { FunctionComponent, useCallback, useContext, useMemo, useState } from "react"
import useAnnouncements from "./useAnnouncements"
import { HarmonyItem } from "../types";
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, CardHeader, IconButton, TextField, Typography } from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { HarmonyContext } from "../HarmonyState/HarmonyContext";

type AnnouncementsViewProps = {
    width: number;
    height: number;
}

const AnnouncementsView: FunctionComponent<AnnouncementsViewProps> = ({width, height}) => {
    const { announcements, removeAnnouncement, editAnnouncement } = useAnnouncements();
    let cardWidth = 300;
    if (width < 600) {
        cardWidth = width
    }
    else if (width < 900) {
        cardWidth = width / 2
    }
    else if (width < 1200) {
        cardWidth = width / 3
    }
    else {
        cardWidth = width / 4
    }

    const handleDeleteAnnouncement = useCallback((itemId: string) => {
        const ok = window.confirm('Delete this announcement?');
        if (!ok) {
            return;
        }
        removeAnnouncement(itemId);
    }, [removeAnnouncement]);

    const handleEditAnnouncement = useCallback((itemId: string, x: {title?: string, description?: string}) => {
        if (x.title) {
            editAnnouncement(itemId, {title: x.title});
        }
        else if (x.description) {
            editAnnouncement(itemId, {meta: {description: x.description}})
        }
    }, [editAnnouncement]);

    return (
        <div style={{position: 'absolute', width, height}}>
            <div>
                <AddAnnouncementControl />
            </div>
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                {announcements.map((announcement, index) => (
                    <div key={index} style={{position: 'relative', width: cardWidth}}>
                        <AnnouncementView
                            announcement={announcement}
                            width={cardWidth}
                            onDelete={() => {handleDeleteAnnouncement(announcement.itemId)}}
                            onEdit={(x: {title?: string, description?: string}) => {handleEditAnnouncement(announcement.itemId, x)}}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

type AnnouncementViewProps = {
    announcement: HarmonyItem
    width: number;
    onDelete: () => void;
    onEdit: (x: {title?: string, description?: string}) => void;
}

const AnnouncementView: FunctionComponent<AnnouncementViewProps> = ({ announcement, width, onDelete, onEdit }) => {
    const description = announcement.meta.description || '';
    const title = announcement.title || '';
    const [editing, setEditing] = useState(false);
    const {user} = useContext(HarmonyContext);
    const handleEditTitle = useCallback((newTitle: string) => {
        onEdit({title: newTitle});
    }, [onEdit]);
    const handleEditDescription = useCallback((newDescription: string) => {
        onEdit({description: newDescription});
    }, [onEdit]);
    const isEditable = useMemo(() => {
        return ['anonymous', user].includes(announcement.userName)
    }, [announcement.userName, user]);
    return (
        <Card sx={{ minWidth: width - 20, maxWidth: width - 20 }}>
            <CardHeader
                title={title}
                action={
                    isEditable && (
                        <IconButton aria-label="delete" onClick={onDelete}>
                            <Close />
                        </IconButton>
                    )
                }
            />
            {
                (
                    <CardContent>
                        <>
                            <Typography color="text.secondary">
                                {description && <>{description}<br /></>}
                                <span style={{color: 'darkblue'}}>{announcement.userName}</span>
                            </Typography>
                        </>
                        {
                            editing && (
                                <>
                                    <EditTitleComponent width={width} onNewTitle={handleEditTitle} />
                                    <EditDescriptionComponent width={width} onNewDescription={handleEditDescription} />
                                </>
                            )
                        }
                    </CardContent>
                )
            }
            {isEditable && (
                <CardActions disableSpacing>
                    <IconButton aria-label="edit" onClick={() => setEditing(editing => !editing)}>
                        <Edit />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    )
    // return (
    //     <div style={{position: 'relative', width: 300, height: 100, overflow: 'hidden', border: 'solid 1px brown', margin: 10, padding: 10}}>
    //         <h2>{announcement.title}</h2>
    //         <p>{description}</p>
    //     </div>
    // )
}

type AddAnnouncementControlProps = {
    // none
}

const AddAnnouncementControl: FunctionComponent<AddAnnouncementControlProps> = () => {
    const { addAnnouncement } = useAnnouncements();
    const [newTitle, setNewTitle] = useState('');
    const addEnabled = newTitle.length > 0;
    const componentHeight = 50;
    return (
        <div style={{display: 'flex', alignItems: 'center', paddingBottom: 15, marginRight: 25}}>
            <TextField
                label="New announcement"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{flexGrow: 1, height: componentHeight}}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        addAnnouncement(newTitle);
                        setNewTitle('');
                    }
                }}
            />
            &nbsp;
            <Button
                variant="contained"
                onClick={() => {
                    addAnnouncement(newTitle);
                    setNewTitle('');
                }}
                style={{height: componentHeight}}
                disabled={!addEnabled}
            >add</Button>
        </div>
    )
}

type EditTitleComponentProps = {
    width: number;
    onNewTitle: (newTitle: string) => void;
}

const EditTitleComponent: FunctionComponent<EditTitleComponentProps> = ({ onNewTitle }) => {
    const [newTitle, setNewTitle] = useState('');
    const addEnabled = newTitle.length > 0;
    const componentHeight = 50;
    return (
        <div style={{display: 'flex', alignItems: 'center', paddingBottom: 15}}>
            <TextField
                label="Edit title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{flexGrow: 1, height: componentHeight}}
            />
            <Button
                variant="contained"
                onClick={() => {
                    onNewTitle(newTitle);
                    setNewTitle('');
                }}
                style={{height: componentHeight}}
                disabled={!addEnabled}
            >set</Button>
        </div>
    )
}

type EditDescriptionComponentProps = {
    width: number;
    onNewDescription: (newDescription: string) => void;
}

const EditDescriptionComponent: FunctionComponent<EditDescriptionComponentProps> = ({ onNewDescription }) => {
    const [newDescription, setNewDescription] = useState('');
    const addEnabled = newDescription.length > 0;
    const componentHeight = 50;
    return (
        <div style={{display: 'flex', alignItems: 'center', paddingBottom: 15}}>
            <TextField
                label="Edit description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{flexGrow: 1, height: componentHeight}}
            />
            <Button
                variant="contained"
                onClick={() => {
                    onNewDescription(newDescription);
                    setNewDescription('');
                }}
                style={{height: componentHeight}}
                disabled={!addEnabled}
            >set</Button>
        </div>
    )
}



export default AnnouncementsView