import React from 'react'

interface HeroElementProps {
    id: string
    title: string
    subtitle: string
    description: string
}
const HeroElement : React.FC<HeroElementProps> = ({id, title, subtitle, description}) => {
    return (
        <div id={id} className="w-full pt-16 pb-16 h-96 relative">
            <div className="md:w-10/12 w-11/12 mx-auto text-center">
                <h1 className="text-primary font-semibold">{title}</h1>
                <h2 className="text-4xl font-bold mt-2 md:w-7/12 w-11/12 mx-auto">{subtitle}</h2>
                <p className="text-slate-700 text-sm mt-4 md:w-7/12 w-11/12 mx-auto tracking-wide">{description}</p>
            </div>
            {/* <img className="absolute md:-bottom-24 -bottom-10 md:left-32 -left-28 w-48 md:w-64 -z-10 " src={Props1} /> */}
            {/* <img className="absolute top-0 md:right-10 -right-24 -z-10 w-48 md:w-64" src={Props2} /> */}
        </div>
    )
}

export default HeroElement