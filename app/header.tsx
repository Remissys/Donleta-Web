'use client'

import Image from "next/image";
import Link from "next/link";
import Logo from "../public/logo.svg"

export default function Header() {
    return (
            <div className="nav">
                <div id='nav' className="nav__body">
                    <div id='logo' className="nav__logo">
                        <Link href="/">
                            <Image src={Logo} alt="Donleta" unoptimized width={50} height={50} className="nav__logo--img"/>
                        </Link>
                    </div>
                    <div className="nav__menu">
                        <Link href="/" className="nav__menu__options">Tela Inicial</Link>
                        <Link href="/regras" className="nav__menu__options">Regras</Link>
                        <Link href="/personagens" className="nav__menu__options">Personagens</Link>
                        <Link href="/bosses" className="nav__menu__options">Bosses</Link>
                        <Link href="/resultados" className="nav__menu__options">Resultados</Link>
                    </div>
                </div>
            </div>
        )
}