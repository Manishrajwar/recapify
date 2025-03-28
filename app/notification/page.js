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
import { Search,} from "lucide-react";
import {collection,doc,getDoc,getDocs,query,where,} from "firebase/firestore";
import { CgProfile } from "react-icons/cg";
import { firestore } from "@/lib/firebase";
import { useAppContext } from "@/context/AppContext";
import {
  getDatabase,
  ref,
  push,
  serverTimestamp,
  get,
} from "firebase/database";
import toast from "react-hot-toast";
import { navbarItems } from "@/data/Navitems";


export default function ContentCheckerPage() {

  const navItems = navbarItems();

  const [loading, setLoading] = useState(false);
  const { userDetails } = useAppContext();

  const [allFriendRq ,setAllFrindRq] = useState([]);


  const fetchAvailableRequest = async () => {
    try {
      const db = getDatabase();
      const friendRequestRef = ref(db, "friendRequests");

      const snapshot = await get(friendRequestRef);
      if (snapshot.exists()) {
        const allRequests = snapshot.val();

        const filteredRequests = Object.entries(allRequests)
         .map(([id, request]) => ({ id, ...request }))
         .filter((request) => request.sendTo === userDetails.id);


      const populatedRequests = await Promise.all(
        filteredRequests.map(async (request) => {
          const senderRef = doc(firestore, "users", request.sendBy); 
          const senderSnapshot = await getDoc(senderRef);

          return {
            ...request,
            sendBy: senderSnapshot.exists() ? senderSnapshot.data() : null, 
          };
        })
      );
              setAllFrindRq(populatedRequests);

      
      } else {
        console.log("No friend requests found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return [];
    }
  };

  console.log("allFriendRq" , allFriendRq);

  useEffect(() => {
    if (userDetails) {
      fetchAvailableRequest();
    }
  }, [userDetails]);

  const acceptRequest = async(reqId)=>{
 try{

    

 } catch(error){
    console.log("error" , error);
 }
  }


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Notification
        </h1>

        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle>Check your all notifications</CardTitle>
            <CardDescription className="text-white/80">
             Notification like friend Requests, Notes Share
            </CardDescription>
          </CardHeader>
          {/* <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-col gap-4">
                    <Input
                      placeholder="Enter User College Name"
                      value={collegeName}
                      onChange={(e) => {
                        console.log("e ", e.target.value);
                        setCollegeName(e.target.value.toLocaleLowerCase());
                      }}
                      className="border-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  onClick={() => fetchRelatedUsers()}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Analyzing..." : "Check Content"}
                </Button>
              </div>
            </div>
          </CardContent> */}
        </Card>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {allFriendRq?.length > 0 && (
          <div className="allseachusers">
            {allFriendRq.map((frndreq) => (
              <div key={frndreq.id} className="sinel_userde">
                <div className="user_lefts">
                  <CgProfile fontSize={40} />
                  <div className="profile_dtail">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text cursor-pointer text-[#2563eb] hover:underline hover:decoration-purple-600 w-fit">
                      {frndreq?.sendBy?.fullName}
                    </h3>

                    <p className="text-md font-semibold bg-clip-text text-gray-300">
                      {frndreq?.sendBy?.collegeName}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => acceptRequest(frndreq.id)}
                  className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300 `}
                >
                 Accept request 
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
