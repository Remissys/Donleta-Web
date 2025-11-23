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

export default function CharacterListings() {

    const elementHex = [
        {
            "id": 1,
            "element": "Pyro",
            "hex": "#682E2F"
        },
        {
            "id": 2,
            "element": "Hydro",
            "hex": "#262F52"
        },
        {
            "id": 3,
            "element": "Anemo",
            "hex": "#397069"
        },
        {
            "id": 4,
            "element": "Electro",
            "hex": "#382B4B"
        },
        {
            "id": 5,
            "element": "Dendro",
            "hex": "#275E32"
        },
        {
            "id": 6,
            "element": "Cryo",
            "hex": "#3D83A2"
        },
        {
            "id": 7,
            "element": "Geo",
            "hex": "#786937"
        },
    ]

    type Char = {
        id: number
        name: string
        element: number
        score: number
        image: any
    }

    const charJson:Char[] = [
        {
            "id": 1,
            "name": "Sangonomiya Kokomi",
            "element": 1,
            "score": 3,
            "image": Kokomi
        },
        {
            "id": 2,
            "name": "Kuki Shinobu",
            "element": 3,
            "score": 3,
            "image": Kuki
        },
        {
            "id": 3,
            "name": "Layla",
            "element": 5,
            "score": 3,
            "image": Layla
        },
        {
            "id": 4,
            "name": "Nahida",
            "element": 4,
            "score": 3,
            "image": Nahida
        },
        {
            "id": 5,
            "name": "Sucrose",
            "element": 2,
            "score": 3,
            "image": Sucrose
        },
        {
            "id": 6,
            "name": "Yanfei",
            "element": 0,
            "score": 3,
            "image": Yanfei
        },
        {
            "id": 7,
            "name": "Yun Jin",
            "element": 6,
            "score": 3,
            "image": YunJin
        },
        {
            "id": 8,
            "name": "Aino",
            "element": 1,
            "score": 2,
            "image": "https://genshin-impact.fandom.com/wiki/Special:Filepath/Amber_Icon.png"
        }
    ]

    const [charJsonClone, setCharJsonClone] = useState<Char[]>([...charJson])

    const [modifiedChar, setModifiedChar] = useState<Set<string>>(new Set())

    const groupedElements = useMemo(() => {
        return charJsonClone.reduce<Record<number, Char[]>>((acc, char) => {
            if (!acc[char.element]) acc[char.element] = []
            acc[char.element].push(char)
            return acc
        }, {} as Record<number, Char[]>)
    }, [charJsonClone])

    const setCharScore = (action:string|number, charId:number, inputValue:string|null=null) => {
        setCharJsonClone((prevState) => {
            let updatedCharJson = [...prevState]
            let char = updatedCharJson.find(char => char.id === charId)
            let charOriginal = charJson.find(char => char.id === charId)

            if (!char || !charOriginal) return prevState

            let hasAlteration = false

            if (action === 'sub' && char.score > 0) {
                char.score -= 1 //character score cannot be less than 0
                hasAlteration = true
            } else if (action === 'add') {
                char.score += 1
                hasAlteration = true
            } else if (action === 'input' && typeof inputValue === "string" && !isNaN(+inputValue)) {
                char.score = +inputValue //input has to be a number
                hasAlteration = true
            }

            if (hasAlteration) {
                if (char.score !== charOriginal.score) modifiedChar.add(char.name)
                else if (char.score === charOriginal.score) modifiedChar.delete(char.name)
            }

            return updatedCharJson
        })
    }

    const [selectedElements, setSelectedElements] = useState<Set<number>>(new Set())

    const handleToggleElement = (element:number) => {
        setSelectedElements(prevState => {
            const newState = new Set(prevState)

            if (newState.has(element)) newState.delete(element)
            else newState.add(element)

            return newState
        })
    }

    useEffect(() => {
        const elements = Object.keys(groupedElements).map(Number)
        setSelectedElements(new Set(elements))
    }, [])

    /*
        For update post

        filter characters to update based on modified characters set
        ex:
            charJson.filter(char => modifiedChar.includes(char))
    */

    return (
        <>
            <div className="flex justify-between">
                <ToggleGroup
                    type="multiple"
                    value={Array.from(selectedElements).map(String)}
                    onValueChange={(values) => setSelectedElements(new Set(values.map(Number)))}
                    className="toggle--group"
                >
                    {Object.keys(groupedElements).map(elementKey => {
                        const element = Number(elementKey)

                        return(
                            <ToggleGroupItem
                                key={`Toggle ${element}`}
                                value={element.toString()}
                                onClick={() => handleToggleElement(element)}
                                className="toggle--group__items data-[state=on]:bg-[#1F1F24E6]"
                            >{`Element ${element}`}</ToggleGroupItem>
                        )
                    })}
                </ToggleGroup>
                <div className="flex justify-end gap-4">
                    {modifiedChar.size > 0 ?
                        <div className="flex gap-4">
                            <Label className="h-9 text-sm items-center">Você tem alterações não salvas!</Label>
                            <Button
                                onClick={() => console.log('salvar')}
                            >Salvar</Button>
                        </div>
                    :<></>}
                    <AddCharacter/>
                </div>
            </div>
            <Accordion type="multiple" value={Array.from(selectedElements).map(String)} className="accordion">
                {Object.keys(groupedElements).map(elementKey => {
                    const element = Number(elementKey)
                    const chars = groupedElements[element]
                    
                    return(
                        <>
                        <Card className="accordion__card">
                            <AccordionItem key={element} value={element.toString()} className="border-0">
                                <AccordionTrigger
                                    className="accordion__trigger"
                                    onClick={() => handleToggleElement(element)}
                                >{element}</AccordionTrigger>
                                <AccordionContent className="accordion__content">
                                    <div className="flex flex-wrap justify-start space-x-2">
                                        {chars.map(char => {
                                            return (
                                                <Card className="char-card drop-shadow-(--drop-shadow)" key={`char ${char.id}`}>
                                                    <CardTitle className="char-card__title">{char.name}</CardTitle>
                                                    <CardContent className="char-card__content">
                                                        <Card className="w-[130px] h-[130px] overflow-hidden border-0 drop-shadow-(--drop-shadow)" style={{backgroundColor: elementHex[char.element].hex}}>
                                                            <Image src={char.image} alt='' width={130} height={130}/>
                                                        </Card>
                                                    </CardContent>
                                                    <CardFooter className="char-card__footer">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="char-card__footer--button"
                                                            style={{backgroundColor: elementHex[char.element].hex}}
                                                            onClick={() => setCharScore('sub', char.id)}
                                                        >-</Button>
                                                        <Input type="text" placeholder="0" className="char-card__footer--input" style={{backgroundColor: elementHex[char.element].hex}} value={char.score} onChange={(e) => {setCharScore('input', char.id, e.target.value)}}/>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="char-card__footer--button"
                                                            style={{backgroundColor: elementHex[char.element].hex}}
                                                            onClick={() => setCharScore('add', char.id)}
                                                        >+</Button>
                                                    </CardFooter>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                        </>
                    )
                })}
            </Accordion>
        </>
    )
}