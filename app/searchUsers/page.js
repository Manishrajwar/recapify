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
  FileText,
  LogOut,
  Search,
  HelpCircle,
} from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
  const [collegeName, setCollegeName] = useState("");

  const [loading, setLoading] = useState(false);
  const { userDetails } = useAppContext();

  const [allSearchUser, setAllSerchUsers] = useState([]);
  const [alreadyRequestSend, setAlreadyRequestSend] = useState([]);


  const fetchRelatedUsers = async () => {
    try {
      if (!collegeName) {
        return alert("colleage name is not defined");
      }
      setLoading(true);

      const usersRef = collection(firestore, "users");

      const q = query(usersRef, where("collegeName", "==", collegeName));
      const querySnapshot = await getDocs(q);

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userFilters = usersList.filter(
        (user) => user.id !== userDetails.id
      );

      setAllSerchUsers(userFilters);
      return usersList;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };


  const sendAddFriendRequest = async (userId) => {
    const toastId = toast.loading("Loading...");
    try {
      const db = getDatabase();
      const friendRequestRef = ref(db, "friendRequests");

      const pushData = {
        sendBy: userDetails.id,
        sendTo: userId,
        createdAt: serverTimestamp(),
      };

      await push(friendRequestRef, pushData);

      await fetchAvailableRequest();
      toast.success("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const fetchAvailableRequest = async () => {
    try {
      const db = getDatabase();
      const friendRequestRef = ref(db, "friendRequests");

      const snapshot = await get(friendRequestRef);
      if (snapshot.exists()) {
        const allRequests = snapshot.val();
        const filteredRequests = Object.values(allRequests).filter(
          (request) => request.sendBy === userDetails.id
        );

        setAlreadyRequestSend(filteredRequests);
        return filteredRequests;
      } else {
        console.log("No friend requests found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return [];
    }
  };

  useEffect(() => {
    if (userDetails) {
      fetchAvailableRequest();
    }
  }, [userDetails ,setAllSerchUsers]);

  const checkIsFrindReq = (userId) => {
    const ispresent = alreadyRequestSend.find((user) => user.sendTo === userId);
    if (ispresent && ispresent !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Sidebar navItems={navItems} />

      <main className="flex-1 p-6 md:p-10 md:mt-0 mt-[50px]">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Search Users
        </h1>

        <Card className="mb-8 border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle>by college name</CardTitle>
            <CardDescription className="text-white/80">
              Enter the college name and find your buddy to share notes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {allSearchUser?.length > 0 && (
          <div className="allseachusers">
            {allSearchUser.map((user) => (
              <div key={user.uid} className="sinel_userde">
                <div className="user_lefts">
                  <CgProfile fontSize={40} />
                  <div className="profile_dtail">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text cursor-pointer text-[#2563eb] hover:underline hover:decoration-purple-600 w-fit">
                      {user.fullName}
                    </h3>

                    <p className="text-md font-semibold bg-clip-text text-gray-300">
                      {user.collegeName}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => sendAddFriendRequest(user.id)}
                  // disabled={()=>checkIsFrindReq(user.id)}
                  className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300 ${checkIsFrindReq(user.id) && "opacity-50"}`}
                >
                 {checkIsFrindReq(user.id) ? "Request Already Send":"Add Friend"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
