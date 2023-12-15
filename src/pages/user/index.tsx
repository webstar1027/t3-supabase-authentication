import { api } from "../../utils/api";
import { useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/router";

export default function Content() {
  const { data } = api.example.getSecretMessage.useQuery();
  const { data: items, refetch: refetchItems } = api.first.getAll.useQuery();
  const { data: privateItems, refetch: refetchPrivateItems } =
    api.first.getAllPrivate.useQuery();

  const [inputValue, setInputValue] = useState("");
  const [inputPrivateValue, setInputPrivateValue] = useState("");

  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const createExample = api.first.create.useMutation({
    onSuccess: () => {
      setInputValue("");
      void refetchItems();
    },
  });

  const createPrivateExample = api.first.createPrivate.useMutation({
    onSuccess: () => {
      setInputPrivateValue("");
      void refetchPrivateItems();
    },
  });

  const signOut = () => {
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        router.push("/signin").catch((err) => {
          console.error("Failed to navigate", err);
        });
      }
    }).catch((error) => {
      // Catch any errors that occur during the sign-out process
      console.error("Sign out failed:", error);
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-3">
      <div className="space-y-2">
        <h1 className="text-5xl text-blue-800 mt-10"> Welcome to User page </h1>
        <h1 className="text-3xl text-yellow-600">Gmail: {user?.email}</h1>
        <h1 className="text-3xl text-yellow-600">Role: {user?.role}</h1>
        {/* <h1>{data}</h1> */}
        <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          try {
            signOut();
            // Handle successful sign out if needed
          } catch (error) {
            // Handle any errors that occur during sign out
            console.error('Error signing out:', error);
          }
        }}>Sign Out</Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {items && (
          <Table>
            <TableCaption>Items:</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>First Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.firstEntry}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {privateItems && (
          <Table>
            <TableCaption>Private Items:</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>First Entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {privateItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.firstEntry}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
