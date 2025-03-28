"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  Home,
  Youtube,
  FileText,
  LogOut,
  Search,
  HelpCircle,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { firestore , app } from "../../lib/firebase"; 
import { doc, updateDoc } from "firebase/firestore";
import { getAuth  } from "firebase/auth";
import toast from "react-hot-toast";
import {navbarItems} from "../../data/Navitems"

export default function DashboardPage() {
  const { userDetails } = useAppContext();

  const navItems = navbarItems();

  const [profiledata , setProfiledata] = useState(userDetails);
  const auth = getAuth(app);

  const profileHandler = (e)=>{
    const {name ,value} = e.target;
     setProfiledata((prev)=>({
        ...prev ,
        [name]:value.toLowerCase(),
     }))
  }

  const updateProfile = async () => {
    // Get the currently logged-in user
    const user = auth.currentUser;
    if(profiledata.email !== userDetails.email){
      return alert("Changes in email not condering");
    }
    
    if (!user) {
      throw new Error("User not logged in");
    }
    const toastId = toast.loading("Loading...");
    
    try {
  
      // Reference to the Firestore user document
      const userRef = doc(firestore, "users", userDetails.id);
  
      // Update the document in Firestore
      await updateDoc(userRef, profiledata);
  
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Something went wrong");
    } finally{
       toast.dismiss(toastId);
    }
  };

  useEffect(()=>{
     if(userDetails){
        setProfiledata(userDetails);
     }
  } , [userDetails])

  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Profile
        </h1>

        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle>Update Profile</CardTitle>
            <CardDescription className="text-white/80">
              Enter you correct profile to make a correct match with friends
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex w-full gap-6">
                  <Input  placeholder="Enter Full Name" 
                    value={profiledata?.fullName}
                    name="fullName"
                    onChange={(e) => profileHandler(e)}
                    className="border-2 focus-visible:ring-purple-500 w-[100%]"
                  />
                  <Input disabled placeholder="Enter email"
                    value={profiledata?.email}

                    className="border-2 focus-visible:ring-purple-500"
                  />
                </div>
           
                <div className="flex w-full gap-6">
                  <Input  placeholder="Enter Phone Number*" 
                    value={profiledata?.phone}
                    name="phone"
                    type="number"
                    onChange={(e) => profileHandler(e)}
                    className="border-2 focus-visible:ring-purple-500 w-[100%]"
                  />
                  <Input  placeholder="Enter College Name"
                    value={profiledata?.collegeName}
                    name="collegeName"
                    type="text"
                    onChange={(e)=>profileHandler(e)}
                    className="border-2 focus-visible:ring-purple-500"
                  />
                </div>

       

                <Button
                onClick={()=>updateProfile()}
                  className="flex max-w-[400px] w-full mx-auto  items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Youtube className="h-4 w-4" />
                  Save
                </Button>
           
              </div>

          
          
          
            </div>
          </CardContent>
        </Card>

      
    
      </main>

    


    
      {/* <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
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
      </AlertDialog> */}
    </div>
  );
}
