import { Button, TextField, styled } from "@mui/material";
import { FunctionComponent, useCallback, useContext, useMemo, useState } from "react";
import { HarmonyContext } from "../HarmonyState/HarmonyContext";
import { HarmonyItem } from "../types";
import useAnnouncements from "./useAnnouncements";
import AnnouncementCard from "./AnnouncementCard";

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
        else if (x.description !== undefined) {
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
        <AnnouncementCard
            width={width}
            title={announcement.title || ''}
            description={announcement.meta.description || ''}
            author={announcement.userName}
            editable={isEditable}
            onDelete={onDelete}
            onNewTitle={handleEditTitle}
            onNewDescription={handleEditDescription}
            isSelf={announcement.userName === user}
        />
    )
    // return (
    //     <Card sx={{ minWidth: width - 20, maxWidth: width - 20 }}>
    //         <CardHeader
    //             title={title}
    //             action={
    //                 isEditable && (
    //                     <IconButton aria-label="delete" onClick={onDelete}>
    //                         <Close />
    //                     </IconButton>
    //                 )
    //             }
    //         />
    //         {
    //             (
    //                 <CardContent>
    //                     <>
    //                         <Typography color="text.secondary">
    //                             {description && <>{description}<br /></>}
    //                             <span style={{color: 'darkblue'}}>{announcement.userName}</span>
    //                         </Typography>
    //                     </>
    //                     {
    //                         editing && (
    //                             <>
    //                                 <EditTitleComponent width={width} onNewTitle={handleEditTitle} />
    //                                 <EditDescriptionComponent width={width} onNewDescription={handleEditDescription} />
    //                             </>
    //                         )
    //                     }
    //                 </CardContent>
    //             )
    //         }
    //         {isEditable && (
    //             <CardActions disableSpacing>
    //                 <IconButton aria-label="edit" onClick={() => setEditing(editing => !editing)}>
    //                     <Edit />
    //                 </IconButton>
    //             </CardActions>
    //         )}
    //     </Card>
    // )
}

type AddAnnouncementControlProps = {
    // none
}

const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 20px;
    height: 53px;
  }
`;

const AddAnnouncementControl: FunctionComponent<AddAnnouncementControlProps> = () => {
    const { addAnnouncement } = useAnnouncements();
    const [newTitle, setNewTitle] = useState('');
    const addEnabled = newTitle.length > 0;
    const componentHeight = 50;
    return (
        <div style={{display: 'flex', alignItems: 'center', paddingLeft: 10, paddingBottom: 15, marginRight: 25}}>
            <TextFieldWrapper
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

export default AnnouncementsView