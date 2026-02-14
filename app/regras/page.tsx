import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Rules() {
    return (
        <div className="flex flex-col gap-4">
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Regras</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span className="text-lg font-semibold py-4">1 — Quem pode participar?</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Apenas jogadores do servidor <span className="font-bold">América</span> e com pelo menos <span className="font-bold">Nível de Mundo 8</span></span>
                    </div>

                    <span className="text-lg font-semibold py-4">2 — Fase de roletar</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Uma vez por mês serão roletados <span className="font-bold">3 ELEMENTOS</span>. Esses elementos serão referentes aos bonecos que poderão ser roletados durante a temporada mensal</span>
                        <span>Todos os participantes terão <span className="font-bold">1 roleta extra</span>, podendo trocar 1 personagem ou o boss, não podendo voltar à troca de personagem caso rolete o boss:</span>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Se roletar personagem, não roleta boss</li>
                            <li>Se roletar boss, não roleta personagem</li>
                        </ul>
                        <span>Caso o participante não tenha o personagem roletado, será feito um novo sorteio. Caso isso ocorra 3 vezes, será roletado 1 dos personagens iniciais, não podendo ser roletado nem substituído</span>
                    </div>

                    <span className="text-lg font-semibold py-4">3 — Preparação</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Após tudo ser roletado, os jogadores poderão buildar, upar e recarregar energia dos personagens sorteados antes do desafio começar</span>
                        <span>Caso um palpite seja iniciado antes da luta, o jogador que fará o desafio <span className="font-bold">NÃO pode votar em si mesmo</span> (seja contra ou a favor). Fazer isso resultará em <span className="font-bold">desclassificação imediata</span></span>
                    </div>

                    <span className="text-lg font-semibold py-4">4 — Combate</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Durante o combate, os jogadores podem usar apenas <span className="font-bold">comidas de cura e de reviver</span>.Demais comidas e poções de buff são proibidas e seu uso resultará em <span className="font-bold">desclassificação imediata</span></span>
                        <span>O participante terá <span className="font-bold">10 minutos</span> para concluir o desafio e pontuar</span>
                        <span>Além do limite de tempo, há também um limite de resets do boss. Quando os 2 personagens morrem e o jogador renasce no teleporte, isso conta como 1 reset</span>
                        <span>Se o boss resetar <span className="font-bold">2 vezes</span>, o desafio será encerrado e considerado fracassado, não pontuando nada</span>
                    </div>

                </CardContent>
            </Card>
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Pontuação</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span className="text-lg font-semibold py-4">1 — Pontuação dos personagens</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Cada boneco tem uma pontuação individual</span>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Quanto mais forte ou útil, menor a pontuação</li>
                            <li>Quanto mais fraco, maior a pontuação</li>
                        </ul>
                        <span>As pontuações podem mudar ao longo dos meses, com inserção de novos personagens ou novas mecânicas</span>
                    </div>

                    <span className="text-lg font-semibold py-4">2 — Pontuação dos bosses</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Bosses também terão pontuação própria</span>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>quanto mais difíceis, maior a pontuação</li>
                        </ul>
                    </div>

                    <span className="text-lg font-semibold py-4">3 — Pontuação por tempo</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>O tempo de conclusão também gera pontuação</span>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Quanto mais rápido, mais pontos</li>
                        </ul>
                    </div>

                    <span className="text-lg font-semibold py-4">4 — Regras do ranking</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Para o ranking serão consideradas apenas as <span className="font-bold">2 maiores pontuações</span> do mês</span>
                        <span className="font-semibold">Prioridade de participação:</span>
                        <ol className="list-disc pl-6 space-y-1">
                            <li>Quem ainda não concorreu na semana</li>
                            <li>Quem particiou mas não pontuou</li>
                            <li>Demais participantes</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Cronograma</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span className="text-lg font-semibold py-4">1 — Dias de Donleta</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Donletas serão realizadas às:</span>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Quartas-feiras</li>
                            <li>Quintas-feiras</li>
                            <li>Sextas-feiras</li>
                        </ul>
                    </div>
                    
                    <span className="text-lg font-semibold py-4">2 — Donleta em dupla</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Aos sábados haverá <span className="font-bold">Donletas em dupla</span>, sem contar pontuação para o ranking</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="accordion__card py-8 px-12">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Prêmio</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span className="text-lg font-semibold py-4">Premiação Mensal</span>
                    <div className="flex flex-col gap-4 px-12">
                        <span>Ao final do mês, o participante com maior pontuação ganhará uma <span className="font-bold">Bênção da Lua</span></span>
                    </div>
                </CardContent>
            </Card>            
        </div>
    )
}