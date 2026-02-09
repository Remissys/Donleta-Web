'use client'

import React, { useEffect, useMemo, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import Image from "next/image"

import Kokomi from "../../../public/Sangonomiya_Kokomi_Icon.png"
import Kuki from "../../../public/Kuki_Shinobu_Icon.png"
import Layla from "../../../public/Layla_Icon.png"
import Nahida from "../../../public/Nahida_Icon.png"
import Sucrose from "../../../public/Sucrose_Icon.png"
import Yanfei from "../../../public/Yanfei_Icon.png"
import YunJin from "../../../public/Yun_Jin_Icon.png"
import AddCharacter from "./addCharacter"
import { Label } from "@/components/ui/label"
import AddBoss from "./addBoss"

export default function BossListings() {

    interface Boss {
        id: number
        name: string
        score: number
        image: any
    }

    const [ bossJson, setBossJson ] = useState<Boss[]>([
        {
            "id": 1,
            "name": "Sangonomiya Kokomi",
            "score": 3,
            "image": Kokomi
        },
        {
            "id": 2,
            "name": "Kuki Shinobu",
            "score": 3,
            "image": Kuki
        },
        {
            "id": 3,
            "name": "Layla",
            "score": 3,
            "image": Layla
        },
        {
            "id": 4,
            "name": "Nahida",
            "score": 3,
            "image": Nahida
        },
        {
            "id": 5,
            "name": "Sucrose",
            "score": 3,
            "image": Sucrose
        },
        {
            "id": 6,
            "name": "Yanfei",
            "score": 3,
            "image": Yanfei
        },
        {
            "id": 7,
            "name": "Yun Jin",
            "score": 3,
            "image": YunJin
        },
        {
            "id": 8,
            "name": "Aino",
            "score": 2,
            "image": "https://genshin-impact.fandom.com/wiki/Special:Filepath/Amber_Icon.png"
        }
    ])

    const [ bossJsonClone, setBossJsonClone] = useState<Boss[]>(structuredClone(bossJson))

    const [ modifiedBoss ] = useState<Set<string>>(new Set())

    console.log(modifiedBoss)

    const setBossScore = (action:string|number, bossId:number, inputValue:string|null=null) => {
        setBossJsonClone((prevState) => {
            const updatedBossJson = [...prevState]
            const boss = updatedBossJson.find(boss => boss.id === bossId)
            const bossOriginal = bossJson.find(boss => boss.id === bossId)

            if (!boss || !bossOriginal) return prevState

            let hasAlteration = false

            console.log('boss: ', boss, bossOriginal)
            console.log('action: ', action)

            if (action === 'sub' && boss.score > 0) {
                boss.score -= 1 //boss score cannot be less than 0
                hasAlteration = true
            } else if (action === 'add') {
                boss.score += 1
                hasAlteration = true
            } else if (action === 'input' && typeof inputValue === "string" && !isNaN(+inputValue)) {
                boss.score = +inputValue //input has to be a number
                hasAlteration = true
            }

            if (hasAlteration) {
                console.log('entrou')
                console.log(boss.score, bossOriginal.score, boss.score !== bossOriginal.score)
                if (boss.score !== bossOriginal.score) modifiedBoss.add(boss.name)
                else if (boss.score === bossOriginal.score) modifiedBoss.delete(boss.name)

                console.log(modifiedBoss, modifiedBoss.size)
            }

            return updatedBossJson
        })
    }

    /*
        For update post

        filter bossess to update based on modified characters set
        ex:
            bossJson.filter(boss => modifiedBoss.includes(boss))
    */

    return (
        <>
            <div className="flex justify-end">
                <div className="actions">
                    {modifiedBoss.size > 0 ?
                        <div className="flex gap-4">
                            <Label className="h-9 text-sm items-center">Você tem alterações não salvas!</Label>
                            <Button
                                onClick={() => console.log('salvar')}
                            >Salvar</Button>
                        </div>
                    :<></>}
                    <AddBoss/>
                </div>
            </div>
            <Accordion type="single" collapsible defaultValue="bossess" className="accordion">
                <Card className="accordion__card">
                    <AccordionItem key={'bossess'} value="bossess" className="border-0">
                        <AccordionTrigger
                            className="accordion__trigger"
                        >Bosses</AccordionTrigger>
                        <AccordionContent className="accordion__content">
                            <div className="flex flex-wrap justify-start space-x-2">
                                {bossJsonClone.map(char => {
                                    return (
                                        <Card className="card drop-shadow-(--drop-shadow)" key={`char ${char.id}`}>
                                            <CardTitle className="card__title">{char.name}</CardTitle>
                                            <CardContent className="card__content">
                                                <Card className="w-[130px] h-[130px] overflow-hidden border-0 drop-shadow-(--drop-shadow)">
                                                    <Image src={char.image} alt='' width={130} height={130}/>
                                                </Card>
                                            </CardContent>
                                            <CardFooter className="card__footer">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="card__footer--button"
                                                    onClick={() => setBossScore('sub', char.id)}
                                                >-</Button>
                                                <Input type="text" placeholder="0" className="card__footer--input" value={char.score} onChange={(e) => {setBossScore('input', char.id, e.target.value)}}/>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="card__footer--button"
                                                    onClick={() => setBossScore('add', char.id)}
                                                >+</Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            </Accordion>
        </>
    )
}