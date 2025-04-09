"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  Home,
  Youtube,
  FileText,
  LogOut,
  Edit,
  Trash2,
  Printer,
  Search,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { PostRequest } from "../../AllUrls/AllRequest";
import { AllUrls } from "../../AllUrls/AllUrls";
import { useAppContext } from "@/context/AppContext";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { navbarItems } from "@/data/Navitems";

export default function DashboardPage() {
  const { userDetails, fetchSavedNotes, notes } = useAppContext();

  const navItems = navbarItems();
  const router = useRouter();
  const [videoId, setVideoId] = useState("");
  const [editingNote, setEditingNote] = useState<null | {
    id: number;
    content: [];
  }>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState("");
  const [noteType, setNoteType] = useState("short");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [noteData, setNoteData] = useState(null);
  const [showingNote, setShowingNote] = useState(null);


  const handleGenerateNotes = async () => {
    if (!videoId.trim()) {
      toast.error("Please Enter the Video ID");
      return;
    }

    setLoading(true);
    setIsNewNoteOpen(true);
    const toastId = toast.loading("loading...");
    try {
      const response = await PostRequest(AllUrls.SUMMARISE_POST_REQ, {
        videoId,
        noteType,
      });
      if (response.status === 200) {
        //  toast.success("Successfully generated");
        const result = await response.json();
        setNoteData(result);
        const {
          videoId,
          videoAudio,
          audioCloudinaryLink,
          audioText,
          structureNotes,
          audioTitle,
          audioFileSize,
        } = result;

        const videoData = {
          videoId,
          videoAudio,
          audioCloudinaryLink,
          audioText,
          structureNotes,
          audioTitle,
          audioFileSize,
          createdAt: new Date(),
          userId: userDetails.uid,
        };

        try {
          const docRef = await addDoc(
            collection(firestore, "videoData"),
            videoData
          );
          fetchSavedNotes();
          // console.log("Document written with ID: ", docRef.id);
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong, Please try later");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const showNoteHandler = (data) => {
    console.log("Dat" , data);
    setIsShowDialogOpen(true);
    setShowingNote(data);
  };

  const handleEditNote = (id: number, content) => {
    setEditingNote({ id, content });
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;

    //  save the updated notes in firebase
    let toastId = toast.loading("Loading...");
    const noteRef = doc(firestore, "videoData", editingNote.id);

    await updateDoc(noteRef, {
      structureNotes: editingNote.content,
    });

    await fetchSavedNotes();
    setIsDialogOpen(false);
    setEditingNote(null);
    toast.success("Successfuly saved");
    toast.dismiss(toastId);
  };

  const confirmDeleteNote = (id: number) => {
    setNoteToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteNote = async () => {
    if (noteToDelete === null) return;
    let toastId = toast.loading("Loading...");
    try {
      const noteRef = doc(firestore, "videoData", noteToDelete);

      await deleteDoc(noteRef);
      fetchSavedNotes();
      toast.success("Successfuly deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      toast.dismiss(toastId);
    }

    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  const handleInputChange = (e, field, index) => {
    console.log("e", e.target.value, field, index);
    setEditingNote((prev) => ({
      ...prev,
      content: prev?.content.map((item, ind) =>
        index === ind
          ? {
              ...item,
              [field]: e.target.value,
            }
          : item
      ),
    }));
  };

  const handleDescriptionChange = (index, descInd, value) => {
    setEditingNote((prev) => ({
      ...prev,
      content: prev.content.map((item, ind) =>
        ind === index
          ? {
              ...item,
              description: item.description.map((desc, descIndex) =>
                descIndex === descInd ? value : desc
              ),
            }
          : item
      ),
    }));
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main  className="flex-1 p-6 md:p-10 md:mt-0 mt-[50px]">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle>Generate New Notes</CardTitle>
            <CardDescription className="text-white/80">
              Enter a YouTube video ID to generate detailed notes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    className="border-2 focus-visible:ring-purple-500"
                  />
                </div>
                <Button
                  onClick={handleGenerateNotes}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Youtube className="h-4 w-4" />
                  Generate Notes
                </Button>
              </div>

              <div className="mt-2">
                <RadioGroup
                  defaultValue="short"
                  value={noteType}
                  onValueChange={setNoteType}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short" className="cursor-pointer">
                      Quick Notes
                    </Label>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long" className="cursor-pointer">
                      Long Notes
                    </Label>
                  </div> */}
                </RadioGroup>
              </div>

              {generatedNote && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <Textarea
                    placeholder="Generated notes will appear here"
                    value={generatedNote}
                    onChange={(e) => setGeneratedNote(e.target.value)}
                    className="min-h-[200px] border-2 focus-visible:ring-purple-500"
                  />
                  <Button
                    // onClick={handleSaveNote}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Save Notes
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Saved Notes
        </h2>

        {notes.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">
              You don't have any saved notes yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="border-none max-w-[390px] w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {note?.audioTitle?.length > 20
                        ? note.audioTitle.slice(0, 20) + "..."
                        : note.audioTitle}
                    </CardTitle>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        note.type === "short"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {note.type === "short" ? "Short Notes" : "Long Notes"}
                    </span>
                  </div>
                  <CardDescription>Video ID: {note.videoId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-4 text-sm">{note.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleEditNote(note.id, note.structureNotes)
                      }
                      className="flex items-center gap-1 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                    onClick={()=>{
                      sessionStorage.setItem("printNotes", JSON.stringify(note));
                      router.push("/printPage")
                    }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      showNoteHandler(note);
                    }}
                    className="flex items-center gap-1 bg-green-400"
                  >
                    {/* <Trash2 className="h-3.5 w-3.5" /> */}
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDeleteNote(note.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* generated Note Dialog */}
      <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{loading ? "Generating..." : "New"} Note</DialogTitle>
            <DialogDescription>Note automatically saved.</DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="new_note_loading">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="show_new_notes"></div>
          )}
        </DialogContent>
      </Dialog>

      {/* THIS IS FOR SHOW THE NOTES */}
      <Dialog open={isShowDialogOpen} onOpenChange={setIsShowDialogOpen}>

        <DialogContent  style={{ maxHeight: "500px" }}  className="sm:max-w-[600px] overflow-y-scroll" >
          <DialogHeader>
            <DialogTitle
              style={{
                lineHeight: "34px",
                color: "black",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              {" "}
              {showingNote?.audioTitle} 
            </DialogTitle>
          </DialogHeader>

          <div className="show_note">
            {showingNote?.structureNotes?.map((shownote, index) => (
              <div key={index} className="single_shownote">
                <h2>{shownote?.title}</h2>
                <h4>{shownote?.subtitle}</h4>
                <ul>
                  {shownote?.description?.map((desc, descIndex) => (
                    <li key={descIndex}>{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* THIS IS FOR EDIT THE NOTE */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          style={{
            maxHeight: "500px",
          }}
          className="sm:max-w-[600px] overflow-y-scroll"
        >
          <DialogHeader>
            <DialogTitle>Edit Note </DialogTitle>
            <DialogDescription>
              Make changes to your note content below.
            </DialogDescription>
          </DialogHeader>
          {editingNote && (
            <>
              <div className="editnoteswrap">
                {editingNote.content?.map((data, index) => (
                  <div key={index} className="singl_note_edit">
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => handleInputChange(e, "title", index)}
                      className="edit_heading"
                    />
                    <input
                      type="text"
                      value={data.subtitle}
                      onChange={(e) => handleInputChange(e, "subtitle", index)}
                      className="edit_subheading"
                    />

                    {/* 📌 Editable Description Array */}
                    {data.description.map((desc, descIndex) => (
                      <textarea
                        key={descIndex}
                        type="text"
                        value={desc}
                        onChange={(e) =>
                          handleDescriptionChange(
                            index,
                            descIndex,
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded mb-2 edit_description"
                      />
                    ))}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this note?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
