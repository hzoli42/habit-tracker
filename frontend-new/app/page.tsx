'use client'
import Stopwatch from "@/components/TrackPage/StopwatchButtons";
import TrackPageCard from "@/components/TrackPage/InfoCard";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import InfoCard from "@/components/TrackPage/InfoCard";
import NewSessionInput from "@/components/TrackPage/NewSessionInput";
import StopwatchTimer from "@/components/TrackPage/StopwatchTimer";
import StopwatchButtons from "@/components/TrackPage/StopwatchButtons";
import StopwatchActions from "@/components/TrackPage/StopwatchActions";

export type StopwatchTime = {
  hours: number;
  minutes: number;
  seconds: number;
}

export type Action = {
  timestamp: number;
  stopwatch_time: StopwatchTime;
  action: string;
}

export default function Home() {
  // const [isActive, setIsActive] = useState(false);
  // const [time, setTime] = useState<StopwatchTime>({hours: 0, minutes: 0, seconds: 0});
  // const [sessionId, setSessionId] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();
  // const [titleInput, setTitleInput] = useState("");
  // const [actions, setActions] = useState<Action[]>([]);

  return (
    <main>
      <div className="container mx-auto max-w-screen-lg">
        <InfoCard />
        <NewSessionInput/>
        <StopwatchTimer />
        <StopwatchButtons />
        <StopwatchActions />
      </div>
    </main>
  )
}
