"use client";
import ToDos from "@/components/ToDos";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase/clientApp";
import { addDoc, collection } from "firebase/firestore";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";

async function addData(title: string, text: string, date: Date | undefined) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      text: text,
      date: date,
    });
    return true;
  } catch (error) {
    console.error("Error adding values", error);
  }
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const added = await addData(title, text, date);
    if (added) {
      setTitle("");
      setText("");

      location.reload();
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 trans w-[400px] h-auto p-5"
      >
        <label htmlFor="title" className="uppercase text-xl ">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="text" className="uppercase text-xl ">
          Text
        </label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor="date" className="uppercase text-xl">
          Date to:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"primary"}
              className={cn(
                "w-[calc[100%-20%]] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
            <Select
              onValueChange={(value) =>
                setDate(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </div>
          </PopoverContent>
        </Popover>
        <div className="w-full flex items-center justify-center mt-4">
          <button
            type="submit"
            className="bg-orange-500 rounded-xl flex w-[40%] p-2 items-center justify-center "
          >
            Submit
          </button>
        </div>
      </form>
      <ToDos />
    </div>
  );
}
