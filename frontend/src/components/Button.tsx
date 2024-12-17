import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon: ReactElement;
}

const VariantClasses = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-200 text-purple-600",
}

const defaultStyles = "px-4 py-2 rounded-lg font-light flex items-center";

export function Button ({variant, text, startIcon}: ButtonProps) {

    return <button className={VariantClasses[variant] + " " + defaultStyles}>
        <div className="pr-2 flex">
            {startIcon}  
        </div>
        {text}

    </button>

}