import { User } from "@supabase/auth-helpers-nextjs";
import { UserDetails } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  uploadsCount: number | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const MyUserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [uploadsCount, setUploadsCount] = useState<number | null>(null);

  const getUserDetails = () => supabase.from("profiles").select("*").single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails()]).then((results) => {
        const userDetailsPromise = results[0];

        if (userDetailsPromise.status === "fulfilled") {
          setUserDetails(userDetailsPromise.value.data as UserDetails);
        }

        setIsLoadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  useEffect(() => {
    if (!userDetails || !user) {
      setUploadsCount(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("audio_files")
      .select("id", { count: "exact", head: true })
      .eq("uploaded_by", user.id)
      .then(({ count, error }) => {
        if (!cancelled) {
          if (error) {
            console.error("Failed to fetch uploads count:", error);
            setUploadsCount(null);
          } else {
            setUploadsCount(count ?? 0);
          }
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userDetails, user, supabase]);

  const value = {
    accessToken,
    user,
    userDetails,
    uploadsCount,
    isLoading: isLoadingUser || isLoadingData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
