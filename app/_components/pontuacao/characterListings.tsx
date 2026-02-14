'use client'

import React, { useEffect, useMemo, useState } from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { elementHex, elements } from "@/utils/characterUtils"
import { GetImage, ImageUpload } from "@/utils/imageUtils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import AddCharacter from "./addCharacter"
import axios from "axios"
import Image from "next/image"

export default function CharacterListings() {

    interface Char {
        _id: string
        name: string
        element: number
        score: number
        image_key: string
    }

    interface CharData {
        name: string
        element: number
        score: number
        image: File
    }

    const [ charJson, setCharJson ] = useState<Char[]>([])
    const [ charJsonClone, setCharJsonClone] = useState<Char[]>([])
    const [ modifiedChar, setModifiedChar ] = useState<Set<string>>(new Set())
    const [ selectedElements, setSelectedElements ] = useState<Set<number>>(new Set())
    const [ open, setOpen ] = useState<boolean>(false)

    const groupedElements = useMemo(() => {
        return charJsonClone.reduce<Record<number, Char[]>>((acc, char) => {
            if (!acc[char.element]) acc[char.element] = []
            acc[char.element].push(char)
            return acc
        }, {} as Record<number, Char[]>)
    }, [charJsonClone])

    useEffect(() => {
        fetchCharacters()
    }, [])

    useEffect(() => {
        defineClone()
    }, [charJson])

    useEffect(() => {
        const elements = Object.keys(groupedElements).map(Number)
        setSelectedElements(new Set(elements))
    }, [groupedElements])

    const fetchCharacters = async () => {
        try {
            const characters = await axios.get('/characters/', {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

            setCharJson(characters.data.data)
        } catch(err) {
            console.error(err)
        }
    }

    async function addCharacter(data: CharData) {
        try {
            if (!data.image || !(data.image instanceof File)) return

            const image_key = await ImageUpload('character', data.image)

            const payload = {
                'name': data.name,
                'element': data.element,
                'score': data.score,
                'image_key': image_key
            }
    
            const newChar = await axios.post('/characters/', payload, {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })
    
            setCharJson([
                ...charJson,
                {
                    _id: newChar.data.data._id,
                    name: newChar.data.data.name,
                    element: newChar.data.data.element,
                    score: newChar.data.data.score,
                    image_key: newChar.data.data.image_key,
                }
            ])
        } catch(err) {
            console.error(err)
        } finally {
            setOpen(false)
        }
    }

    async function updateCharacters() {
        try {
            const payload = Array.from(modifiedChar).map((_id) => {
                const char = charJsonClone.find(char => char._id === _id)
                
                return ({
                    _id,
                    score: char?.score
                })
            })

            await axios.put('/characters/', payload, {
                baseURL: process.env.NEXT_PUBLIC_DONLETA_URL
            })

        } catch(err) {
            console.error(err)
        } finally {
            setModifiedChar(new Set())
            setCharJson(charJsonClone)
        }
    }

    const defineClone = () => {
        setCharJsonClone(structuredClone(charJson))
    }

    const setCharScore = (action:string|number, charId:string, inputValue:string|null=null) => {
        setCharJsonClone((prevState) => {
            const updatedCharJson = [...prevState]
            const char = updatedCharJson.find(char => char._id === charId)
            const charOriginal = charJson.find(char => char._id === charId)

            if (!char || !charOriginal) return prevState

            let hasAlteration = false

            if (action === 'sub' && char.score > 0) {
                char.score -= 1
                hasAlteration = true
            } else if (action === 'add') {
                char.score += 1
                hasAlteration = true
            } else if (action === 'input' && typeof inputValue === "string" && !isNaN(+inputValue)) {
                char.score = +inputValue
                hasAlteration = true
            }

            if (hasAlteration) {
                if (char.score !== charOriginal.score) modifiedChar.add(char._id)
                else if (char.score === charOriginal.score) modifiedChar.delete(char._id)
            }

            return updatedCharJson
        })
    }

    const handleCloseDialog = () => {setOpen(false)}

    const handleToggleElement = (element:number) => {
        setSelectedElements(prevState => {
            const newState = new Set(prevState)

            if (newState.has(element)) newState.delete(element)
            else newState.add(element)

            return newState
        })
    }

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
                        const elementlabel = elements.find(e => e.value === element)?.label

                        return(
                            <ToggleGroupItem
                                key={`Toggle ${element}`}
                                value={element.toString()}
                                onClick={() => handleToggleElement(element)}
                                className="toggle--group__items data-[state=on]:bg-[#1F1F24E6]"
                            ><span className="px-2">{elementlabel}</span></ToggleGroupItem>
                        )
                    })}
                </ToggleGroup>
                <div className="flex justify-end gap-4">
                    {modifiedChar.size > 0 ?
                        <div className="flex gap-4">
                            <Label className="h-9 text-sm items-center">Você tem alterações não salvas!</Label>
                            <Button
                                onClick={() => updateCharacters()}
                            >Salvar</Button>
                        </div>
                    :<></>}
                    <AddCharacter
                        open={open}
                        setOpen={setOpen}
                        onClose={handleCloseDialog}
                        onSubmit={addCharacter}
                    />
                </div>
            </div>
            <Accordion type="multiple" value={Array.from(selectedElements).map(String)} className="accordion">
                {Object.keys(groupedElements).map(elementKey => {
                    const element = Number(elementKey)
                    const elementInfo = elementHex.find(e => e.id === element)
                    const chars = groupedElements[element]
                    
                    return(
                        <>
                            <Card className="accordion__card">
                                <AccordionItem key={element} value={element.toString()} className="border-0">
                                    <AccordionTrigger
                                        className="accordion__trigger"
                                        onClick={() => handleToggleElement(element)}
                                    >{elementInfo?.label}</AccordionTrigger>
                                    <AccordionContent className="accordion__content">
                                        <div className="flex flex-wrap justify-start space-x-2">
                                            {chars.map(char => {
                                                return (
                                                    <Card className="card drop-shadow-(--drop-shadow)" key={`char ${char._id}`}>
                                                        <CardTitle className="card__title">{char.name}</CardTitle>
                                                        <CardContent className="card__content">
                                                            <Card className="w-[130px] h-[130px] overflow-hidden border-0 drop-shadow-(--drop-shadow)" style={{backgroundColor: elementInfo?.hex}}>
                                                                <Image src={GetImage('character', char.image_key)} alt='' width={130} height={130}/>
                                                            </Card>
                                                        </CardContent>
                                                        <CardFooter className="card__footer">
                                                            <Button 
                                                                variant="outline" 
                                                                size="icon" 
                                                                className="card__footer--button"
                                                                style={{backgroundColor: elementInfo?.hex}}
                                                                onClick={() => setCharScore('sub', char._id)}
                                                            >-</Button>
                                                            <Input 
                                                                type="text" 
                                                                placeholder="0" 
                                                                className="card__footer--input" 
                                                                style={{backgroundColor: elementInfo?.hex}} 
                                                                value={char.score} 
                                                                onChange={(e) => {setCharScore('input', char._id, e.target.value)}}
                                                            />
                                                            <Button 
                                                                variant="outline" 
                                                                size="icon" 
                                                                className="card__footer--button"
                                                                style={{backgroundColor: elementInfo?.hex}}
                                                                onClick={() => setCharScore('add', char._id)}
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