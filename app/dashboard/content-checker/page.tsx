"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  Home,
  FileText,
  LogOut,
  Search,
  HelpCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { PostRequest } from "@/AllUrls/AllRequest";
import { AllUrls } from "@/AllUrls/AllUrls";
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAppContext } from "@/context/AppContext";
import { navbarItems } from "@/data/Navitems";

export default function ContentCheckerPage() {

  const navItems = navbarItems();
  const router = useRouter();
  const [videoId, setVideoId] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [keyPoints, setKeyPoints] = useState(null);
  const [currNote , setCurrNote] = useState(null);

   
  const [loading, setLoading] = useState(false);
  const { userDetails } = useAppContext();

  const handleCheckContent = async () => {
    if (!videoId.trim()) return;
    if (!userPrompt.trim()) return;

    setLoading(true);

    const response = await PostRequest(AllUrls.CONTENT_RELEVANCE_CHECKER, {
      videoId,
      userPrompt,
    });
    const result = await response.json();

    if (response.status === 200) {
      const {
        videoId,
        videoAudio,
        audioCloudinaryLink,
        audioText,
        structureNotes,
        audioTitle,
        audioFileSize,
        userPrompt
      } = result;

      setKeyPoints(structureNotes);
      setCurrNote(result);

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
        userPrompt
      };

      try {
        const docRef = await addDoc(
          collection(firestore, "contentRelevanceData"),
          videoData
        );
        // fetchSavedNotes();
      } catch (error) {
        console.error("Error adding document: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("error while content checker");
    }
  };

  // const fetchSavedContents = async()=>{
  //      const q = query(
  //            collection(firestore, "contentRelevanceData"),
  //            where("userId", "==", userDetails?.uid)
  //          );
     
  //              const querySnapshot = await getDocs(q); // Pass `q` to `getDocs`
           
  //                const notes = querySnapshot.docs.map((doc) => ({
  //                  id: doc.id,
  //                  ...doc.data(),
  //                }));

  //                setKeyPoints(notes[0].structureNotes);
               
  // }

  // useEffect(()=>{
  //   // fetchSavedContents();
  // }, [userDetails])

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "high":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRelevanceIcon = (relevance: string) => {
    switch (relevance) {
      case "high":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "medium":
        return <CheckCircle className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };


  const savetonotes = async(note)=>{
      try{

    const q = query(
      collection(firestore, "videoData"),
      where("userId", "==", userDetails.uid),
      where("videoId", "==", videoId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      
      const existingDoc = querySnapshot.docs[0]; 
      const docRef = doc(firestore, "videoData", existingDoc.id);

      await updateDoc(docRef, {
        structureNotes: arrayUnion(note) 
      });


    } else {
      const cleanedData = Object.fromEntries(
        Object.entries({
          userId: userDetails?.uid,
          videoId: currNote?.videoId,
          videoAudio: currNote?.videoAudio,
          audioCloudinaryLink: currNote?.audioCloudinaryLink,
          audioText: currNote?.audioText,
          structureNotes: [note],  
          audioTitle: currNote?.audioTitle,
          audioFileSize: currNote?.audioFileSize,
          userPrompt: currNote?.userPrompt
        }).filter(([_, value]) => value !== undefined) 
      );
      
      await addDoc(collection(firestore, "videoData"), cleanedData);
      
      
    }

      } catch(error){
        console.log("error" , error);
      }
  }



  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Video Content Relevance Checker
        </h1>

        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle>Check Video Content</CardTitle>
            <CardDescription className="text-white/80">
              Enter a YouTube video ID to analyze its content and relevance and
              Prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col gap-4">
                    <Input
                      placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
                      value={videoId}
                      onChange={(e) => setVideoId(e.target.value)}
                      className="border-2 focus-visible:ring-blue-500"
                    />
                    <Textarea
                      placeholder="Enter Prompt"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="border-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCheckContent}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Analyzing..." : "Check Content"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {keyPoints && !loading && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Content Analysis Results
            </h2>


            <div className="grid gap-6 md:grid-cols-2">
              {keyPoints?.high_relevance?.map((section, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${getRelevanceColor(
                    "high"
                  )} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getRelevanceIcon('high')}
                        <span className="text-sm capitalize">
                          High Relevance
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5 overflow-y-scroll max-h-[80px]">
                      {section?.description?.map((point, pointIndex) => (
                        <>
                        <li key={pointIndex} className="text-sm">
                          {point}
                        </li>
                      
                        </>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={()=>savetonotes(section)}
                    >
                      Save to Notes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
                {keyPoints?.low_relevance?.map((section, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${getRelevanceColor(
                    "low"
                  )} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getRelevanceIcon("low")}
                        <span className="text-sm capitalize">
                          Low Relevance
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5 overflow-y-scroll max-h-[80px]">
                      {section?.description?.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={()=>savetonotes(section)}
                      className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Save to Notes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
                    {keyPoints?.medium_relevance?.map((section, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${getRelevanceColor(
                    "medium"
                  )} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] `}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getRelevanceIcon("medium")}
                        <span className="text-sm capitalize">
                          Medium Relevance
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5 overflow-y-scroll max-h-[80px]">
                      {section?.description?.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={()=>savetonotes(section)}
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors "
                    >
                      Save to Notes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>





            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-teal-50 border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Content Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      This video has{" "}
                      <span className="font-medium text-green-600">
                        2 highly relevant
                      </span>
                      ,
                      <span className="font-medium text-yellow-600">
                        {" "}
                        1 moderately relevant
                      </span>
                      , and
                      <span className="font-medium text-red-600">
                        {" "}
                        1 less relevant
                      </span>{" "}
                      sections for your study topic.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
