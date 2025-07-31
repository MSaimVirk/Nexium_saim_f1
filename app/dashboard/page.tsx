// import { AppSidebar } from "@/components/app-sidebar"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// export default function Page() {
//   return (
//     <SidebarProvider>
//       <div className="flex">
//         <AppSidebar />
//         <SidebarInset className="flex-1">
//           <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//             <div className="flex items-center gap-2 px-4">
//               <SidebarTrigger className="-ml-1" />
//             </div>
//           </header>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   )
// }






'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; // import SidebarProvider

type ChatHead = { id: string; title: string }
type Message = {
  id: string;
  message: string;
  response: string;
  emotional_analysis: string;
  created_at?: string;
};

const fetchChatHeads = async (userId: string): Promise<ChatHead[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_heads")
    .select("id, title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    return [];
  }
  return data ?? [];
};

const fetchChatMessages = async (chatHeadId: string): Promise<Message[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chats")
    .select("id, message, response, emotional_analysis, created_at")
    .eq("chat_head_id", chatHeadId)
    .order("created_at", { ascending: true });
  if (error) {
    return [];
  }
  return data ?? [];
};

const sendMessage = async (chatHeadId: string, message: string) => {
  const groqResponse = await fetch("/api/groq", {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: { "Content-Type": "application/json" },
  });
  const { response, emotional_analysis } = await groqResponse.json();

  const supabase = createClient();
  await supabase.from("chats").insert([
    {
      chat_head_id: chatHeadId,
      message,
      response,
      emotional_analysis,
    },
  ]);

  return { response, emotional_analysis };
};

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chatHeads, setChatHeads] = useState<ChatHead[]>([]);
  const [selectedChatHead, setSelectedChatHead] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchChatHeads(userId).then(setChatHeads);
    }
  }, [userId]);

  useEffect(() => {
    if (selectedChatHead) {
      fetchChatMessages(selectedChatHead).then(setMessages);
    }
  }, [selectedChatHead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedChatHead) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendMessage(selectedChatHead, input);
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now().toString(), message: input, response: result.response, emotional_analysis: result.emotional_analysis },
      ]);
      setInput("");
    } catch {
      setError("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar
          chatHeads={chatHeads}
          onSelectChatHead={setSelectedChatHead}
          selectedChatHead={selectedChatHead}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <main className="flex flex-col items-center justify-center bg-black dark:bg-black flex-1">
            <section className="w-full max-w-2xl flex flex-col items-center justify-center flex-1">
              <div className="w-full flex flex-col gap-4 mb-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-neutral-900 text-white rounded-xl p-4 mb-2">
                    <div className="font-semibold">You:</div>
                    <div>{msg.message}</div>
                    <div className="mt-2 text-xs text-neutral-400">Emotional Analysis: {msg.emotional_analysis}</div>
                    <div className="mt-2 font-semibold">AI:</div>
                    <div>{msg.response}</div>
                  </div>
                ))}
                {error && <div className="text-red-500">{error}</div>}
              </div>
              <form className="w-full flex items-center bg-neutral-900 rounded-2xl px-6 py-4 shadow-lg" onSubmit={handleSend}>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white text-lg placeholder:text-neutral-400 outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="ml-4 bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full text-white"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}