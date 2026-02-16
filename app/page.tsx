import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LatestRuns from "./_components/resultados/latestRuns";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="accordion__card py-8 px-12">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Donleta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 px-12">
            <span>
                A <span className="font-bold">Donleta</span> é um desafio criado pelo streamer <a href="https://www.twitch.tv/don_nobru" className="font-bold !underline">Don Nobru</a> onde os participantes devem,
                dentro de um tempo limite, enfrentar bosses de mundo ou semanais com apenas
                <span className="font-bold"> 2 personagens </span>
                que são sorteados com uma roleta
            </span>
          </div>
        </CardContent>
      </Card>
      <LatestRuns/>
    </div>
  );
}
