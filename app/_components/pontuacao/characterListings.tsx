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

    const [charJson, setCharJson] = useState<Char[]>([
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
    ])

    const groupedElements = useMemo(() => {
        return charJson.reduce<Record<number, Char[]>>((acc, char) => {
            if (!acc[char.element]) acc[char.element] = []
            acc[char.element].push(char)
            return acc
        }, {} as Record<number, Char[]>)
    }, [charJson])

    const setCharScore = (action:string|number, charId:number, inputValue:string|null=null) => {
        setCharJson((prevState) => {
            let updatedCharJson = [...prevState]
            let char = updatedCharJson.find(char => char.id === charId)

            if (!char) return prevState

            if (action === 'sub'&& char.score > 0) char.score -= 1 //character score cannot be less than 0
            else if (action === 'add') char.score += 1
            else if (action === 'input' && typeof inputValue === "string" && !isNaN(+inputValue)) char.score = +inputValue //input has to be a number

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
    }, [groupedElements])

    return (
        <>
            <ToggleGroup
                type="multiple"
                value={Array.from(selectedElements).map(String)}
                onValueChange={(values) => setSelectedElements(new Set(values.map(Number)))}
            >
                {Object.keys(groupedElements).map(elementKey => {
                    const element = Number(elementKey)

                    return(
                        <ToggleGroupItem
                            key={`Toggle ${element}`}
                            value={element.toString()}
                            onClick={() => handleToggleElement(element)}>
                        {element}</ToggleGroupItem>
                    )
                })}
            </ToggleGroup>
            <Accordion type="multiple" value={Array.from(selectedElements).map(String)}>
                {Object.keys(groupedElements).map(elementKey => {
                    const element = Number(elementKey)
                    const chars = groupedElements[element]
                    
                    return(
                        <>
                        <AccordionItem key={element} value={element.toString()} className="border-0">
                            <AccordionTrigger onClick={() => handleToggleElement(element)}>{element}</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap justify-start space-x-2">
                                    {chars.map(char => {
                                        return (
                                            <Card className="card" key={`char ${char.id}`}>
                                                <CardTitle className="card__title">{char.name}</CardTitle>
                                                <CardContent className="card__content">
                                                    <Card className="w-[120px] h-[120px] overflow-hidden" style={{backgroundColor: elementHex[char.element].hex}}>
                                                        <Image src={char.image} alt='' className="card__content--image"/>
                                                    </Card>
                                                </CardContent>
                                                <CardFooter className="card__footer">
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="rounded-full"
                                                        onClick={() => setCharScore('sub', char.id)}
                                                    >-</Button>
                                                    <Input type="text" placeholder="0" className="text-center w-10" value={char.score} onChange={(e) => {setCharScore('input', char.id, e.target.value)}}/>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="rounded-full"
                                                        onClick={() => setCharScore('add', char.id)}
                                                    >+</Button>
                                                </CardFooter>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        </>
                    )
                })}
            </Accordion>
        </>
    )
}