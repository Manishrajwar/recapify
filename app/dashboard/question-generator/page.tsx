"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  Home,
  FileText,
  LogOut,
  Search,
  HelpCircle,
  BookOpen,
  Brain,
  Save,
  Download,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { PostRequest } from "@/AllUrls/AllRequest";
import { AllUrls } from "@/AllUrls/AllUrls";
import { navbarItems } from "@/data/Navitems";




export default function QuestionGeneratorPage() {
  const { notes } = useAppContext();

  const navItems = navbarItems();

  const [selectedNote, setSelectedNote] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<null | any[]>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [savedQuestions, setSavedQuestions] = useState<any[]>([]);

  const handleImportNote = () => {
    if (!selectedNote) return;

    setLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const notedetail = notes.find((note) => note.id === selectedNote);
      setNoteContent(notedetail);
      setLoading(false);
    }, 1000);
  };


  const handleGenerateQuestions = async () => {
    if (!noteContent) return;

    setLoading(true);

    try {
      const resp = await PostRequest(AllUrls.GENERATE_EXAM_QUESTION, {
        notes: noteContent.structureNotes,
        examType: "Gate",
      });


      if (resp.status === 200) {
        const response = await resp.json();
        setQuestions(response.data);

     
      }
    } catch (error) {
      console.log("error", error);
    } finally{
       setLoading(false);
    }
  };

  const handleSaveQuestion = (question: any) => {
    if (savedQuestions.some((q) => q.id === question.id)) return;
    setSavedQuestions([...savedQuestions, question]);
  };

 

  const handleSaveAllQuestions = () => {
    if (!questions) return;

    // Filter out questions that are already saved
    const newQuestions = questions.filter(
      (question) => !savedQuestions.some((q) => q.id === question.id)
    );

    setSavedQuestions([...savedQuestions, ...newQuestions]);
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "essay":
        return "bg-blue-100 text-blue-800";
      case "multiple-choice":
        return "bg-purple-100 text-purple-800";
      case "coding":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main className="flex-1 p-6 md:p-10 md:mt-0 mt-[50px]">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Notes to Questions Generator
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle>Import Notes</CardTitle>
              <CardDescription className="text-white/80">
                Select saved notes to generate questions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Notes</label>
                  <Select value={selectedNote} onValueChange={setSelectedNote}>
                    <SelectTrigger className="border-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Select notes" />
                    </SelectTrigger>
                    <SelectContent>
                      {notes.map((note) => (
                        <SelectItem key={note.id} value={note.id}>
                          {note.audioTitle.slice(0, 70)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleImportNote}
                  disabled={!selectedNote || loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Import Notes
                </Button>

                {noteContent && (
                  <div className="mt-4 animate-fade-in">
                    <label className="text-sm font-medium">Note Content</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md border text-sm max-h-[300px] overflow-y-auto whitespace-pre-line noteContent_question">
                      <h2>{noteContent.audioTitle}</h2>

                      <div className="note_structure_data">
                        {noteContent?.structureNotes?.map((strnote, index) => (
                          <div key={index} className="sing_strc_note">
                            <h3>{strnote.title}</h3>
                            <h4>{strnote.subtitle}</h4>
                            <ul className="strcDescription">
                              {strnote.description?.map((desc, ind) => (
                                <li key={ind}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle>Generate Questions</CardTitle>
              <CardDescription className="text-white/80">
                Create questions based on your notes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Tabs
                  defaultValue="generate"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generate">Generate New</TabsTrigger>
                    <TabsTrigger value="past">Past Exam Questions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="generate" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Generate new questions based on your imported notes. Our
                      AI will create questions that test understanding of the
                      key concepts.
                    </p>
                  </TabsContent>
                  <TabsContent value="past" className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Find relevant past exam questions that match the content
                      of your notes. Great for exam preparation.
                    </p>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handleGenerateQuestions}
                  disabled={!noteContent || loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {loading
                    ? "Generating..."
                    : `Generate ${
                        activeTab === "past"
                          ? "Past Exam Questions"
                          : "New Questions"
                      }`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {questions && !loading && (
          <div className="mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === "past"
                  ? "Relevant Past Exam Questions"
                  : "Generated Questions"}
              </h2>
              <Button
                onClick={handleSaveAllQuestions}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All Questions
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((question , index) => (
                <Card
                  key={index}
                  className="border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getDifficultyBadgeColor(
                          // question.difficulty
                        )}`}
                      >
                        {/* {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)} */}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(
                          // question.type
                        )}`}
                      >
                        {/* {question.type
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")} */}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {question.question}
                    </CardTitle>
                    <p className="text-lg">
                      {question.answer}
                    </p>
                  </CardHeader>
                  <CardContent>
                  
                
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      onClick={() => handleSaveQuestion(question)}
                      disabled={savedQuestions.some(
                        (q) => q.id === question.id
                      )}
                    >
                      {savedQuestions.some((q) => q.id === question.id)
                        ? "Saved"
                        : "Save Question"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {savedQuestions.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Saved Questions
              </h2>
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Questions
              </Button>
            </div>

            <div className="space-y-4">
              {savedQuestions.map((question, index) => (
                <Card
                  key={question.id}
                  className="border-l-4 border-l-indigo-500 shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getDifficultyBadgeColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(
                          question.type
                        )}`}
                      >
                        {question.type
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {question.type === "multiple-choice" && (
                      <div className="space-y-2">
                        {question.options.map(
                          (option: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  option === question.answer
                                    ? "bg-green-100 text-green-800 border border-green-300"
                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                }`}
                              >
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
